interface IForm {
  title: string | null
  description: string | null
  content: "clean" | "explicit"
  episode_type: "full" | "trailer" | "bonus"
}

export default async () => {
  const episode_id = ref<string | null>(null)
  const form = reactive<IForm>({
    title: null,
    description: null,
    content: "clean",
    episode_type: "full",
  })

  function onUploadComplete({ audio_original, id }: { audio_original: string, id: string }) {
    episode_id.value = id
  }

  const { execute: saveEpisode, status } = useLazyAsyncData(async () => {
    //errorMessage.value = ''
    if (!episode_id.value) return

    try {
      await $fetch(`/api/me/podcast/episodes/${episode_id.value}`, {
        method: 'POST',
        body: JSON.stringify(toValue(form))
      })

      navigateTo('/me/podcast/episodes')
    } catch (e) {
      console.log(e)
      // @ts-ignore
      //errorMessage.value = e.data.message
    }
  }, {
    immediate: false,
  })

  return {
    episode_id,
    form,
    onUploadComplete,
    saveEpisode,
    status,
  }
}