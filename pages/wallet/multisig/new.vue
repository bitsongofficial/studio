<template>
  <AppPage>
    <template #title>
      New Multisig Wallet
    </template>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-row no-gutters class="pt-2">
              <v-col>
                <h2 class="text-h6 mb-3">Members</h2>

                <v-row v-for="(member, index) in members" :key="index" no-gutters>
                  <v-col cols="11">
                    <v-text-field v-model="member.address" :disabled="member.address === user?.address" label="Address"
                      variant="outlined" dense required></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-btn v-if="member.address !== user?.address" variant="text" color="red" size="large" class="mt-1"
                      @click="removeMember(index)">
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col>
                    <v-btn color="grey-darken-4" prepend-icon="mdi-plus" size="small" @click="addMember">
                      Add Member
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-2">Threshold</h3>
                <v-text-field v-model="threshold" class="w-25 text-center" variant="solo" prepend-icon="mdi-chevron-left"
                  append-icon="mdi-chevron-right" @click:append="increaseThreshold" @click:prepend="decreaseThreshold"
                  readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-right">
                <v-btn color="primary" @click="onCreateMultisig" :loading="loading">
                  Create Multisig Wallet
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"]
});

const user = useUserState()
const loading = ref(false)
const threshold = ref(1)
const members = ref<{
  name: string
  address: string
}[]>([])

function increaseThreshold() {
  threshold.value = Math.min(threshold.value + 1, members.value.length)
}

function decreaseThreshold() {
  threshold.value = Math.max(threshold.value - 1, 1)
}

function addMember() {
  members.value.push({ name: '', address: '' })
}

function removeMember(index: number) {
  members.value.splice(index, 1)
}

onMounted(async () => {
  if (user.value) {
    members.value.push({ name: '', address: user.value.address })
  }
})

const { success, error: errorNotify } = useNotify()
async function onCreateMultisig() {
  if (members.value.length < 2) {
    return errorNotify('At least 2 members are required')
  }

  try {
    loading.value = true

    const address = getAddress("bitsong");
    const client = await useCWClient()

    await client.instantiate(
      address,
      6,
      {
        "voters": members.value.map((m) => {
          return {
            "addr": m.address,
            "weight": 1
          }
        }),
        "threshold": {
          "absolute_count": {
            "weight": threshold.value
          }
        },
        "max_voting_period": {
          "time": 604800
        }
      },
      "cw3-fixed-multisig",
      "auto"
    )

    success('Multisig wallet created successfully')
    navigateTo(`/wallet/multisig/${address}`)
  } catch (error) {
    console.error(error)
    errorNotify('Failed to create multisig wallet')
  } finally {
    loading.value = false
  }
}
</script>
