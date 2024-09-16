<template>
  <div>
    <button @click="generate">Generate</button>
    <div v-if="pairingURI">URI: {{ pairingURI }}</div>
    <div v-if="newUri" :style="{ wordBreak: 'break-all' }">New URI ({{ newUri.length }}):
      {{ newUri }}
    </div>
    <div v-if="newUri">
      <a :href="`https://t.me/tg_bwallet_dev_bot/app?startapp=${newUri}`">Connect</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { connect } = useConnect();

const { pairingURI } = useWalletConnect();
const newUri = ref<string | null>(null);

async function generate() {
  await connect("keplrmobile");
}

watch(pairingURI, (newVal) => {
  // 1. remove relay-protocol=irn
  let uri = newVal.replace('relay-protocol', 'r');

  // 2. change expiryTimestamp to e
  uri = uri.replace('expiryTimestamp', 'e');

  // 3. change symKey to s
  uri = uri.replace('symKey', 's');

  // 4. convert to base64
  uri = btoa(uri);

  newUri.value = uri;

  console.log("pairingURI", uri);
  console.log("length", uri.length);
  // if (!newVal) return;

  // const [host, querystring] = newVal!.split("?");

  // const params = new URLSearchParams(querystring);

  // console.log("host", host);
  // console.log("params", params.get('expiryTimestamp'));
});
</script>