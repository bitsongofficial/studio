import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Country, LicenseType, TrackExpicit, TrackGenre, toMarkdown, trackMetadata } from "@bitsongjs/metadata";
import pinataSDK from '@pinata/sdk'
import prisma from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { track } = await ensureUserTrack(event)

  if (!track.artwork && !track.audio) {
    throw createError({
      message: "Track has no audio or artwork",
      status: 400,
    })
  }

  if (track.artwork_ipfs_cid && track.audio_ipfs_cid) {
    throw createError({
      message: "Track already published",
      status: 400,
    })
  }

  try {
    const pinata = new pinataSDK(
      useRuntimeConfig().pinataApiKey,
      useRuntimeConfig().pinataApiSecret
    );

    const artwork = await getS3Client().send(new GetObjectCommand({
      Bucket: useRuntimeConfig().awsS3BucketTracks,
      Key: `${track.artwork}`,
    }));

    const { IpfsHash: artworkCid } = await pinata.pinFileToIPFS(artwork.Body, { pinataMetadata: { name: `track_artwork_${track.id}.jpg` } })
    console.log('-----> artworkCid', artworkCid)

    const audio = await getS3Client().send(new GetObjectCommand({
      Bucket: useRuntimeConfig().awsS3BucketTracks,
      Key: `${track.audio}`,
    }));

    const audioExtension = track.audio!.split('.').pop()

    const { IpfsHash: audioCid } = await pinata.pinFileToIPFS(audio.Body, { pinataMetadata: { name: `track_audio_${track.id}.${audioExtension}` } })
    console.log('-----> audioCid', audioCid)

    let videoCid;
    if (track.video) {
      const video = await getS3Client().send(new GetObjectCommand({
        Bucket: useRuntimeConfig().awsS3BucketTracks,
        Key: `${track.video}`,
      }));

      const videoExtension = track.video!.split('.').pop()

      const { IpfsHash } = await pinata.pinFileToIPFS(video.Body, { pinataMetadata: { name: `track_video_${track.id}.${videoExtension}` } })
      videoCid = IpfsHash
      console.log('-----> videoCid', videoCid)
    }

    // TODO: add video to metadata
    const metadata = trackMetadata({
      id: track.id,
      title: track.title!,
      titleLocale: track.titleLocale!,
      description: toMarkdown(track.description!),
      artists: track.artists.map((artist) => ({
        name: artist.name,
        role: artist.role,
        address: artist.address,
      })),
      artwork: `ipfs://${artworkCid}`,
      audio: `ipfs://${audioCid}`,
      duration: track.duration!,
      license: LicenseType.ALL_RIGHTS_RESERVED,
      genre: TrackGenre.R_AND_B,
      country: Country.ITALY,
      explicit: TrackExpicit.EXPLICIT,
      liveRecording: false,
      previousRelease: false,
      previewStartTime: 0,
      previewDuration: 15000,
      authors_publishers: track.authors_publishers.map((author) => ({
        name: author.name,
        role: author.role,
        address: author.address,
      })),
      lyrics: track.lyrics,
      lyricsLocale: track.lyricsLocale,
    })

    const { IpfsHash: metadataCid } = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: `track_metadata_${track.id}.json` } })

    await prisma?.tracks.update({
      where: { id: track.id },
      data: {
        artwork_ipfs_cid: artworkCid,
        audio_ipfs_cid: audioCid,
        video_ipfs_cid: videoCid,
        metadata_ipfs_cid: metadataCid,
        //published: true,
        //publishedAt: new Date(),
      }
    })

    return {
      artwork: artworkCid,
      audio: audioCid,
      video: videoCid,
      metadata: metadataCid,
    }
  } catch (err) {
    throw createError({
      message: "Failed to publish track artwork",
      status: 500,
    })
  }

})