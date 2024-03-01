<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col>
        <template v-for="msg in messages">
          <component :is="msg.component" v-model="msg.value" />
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Transaction Builder</v-card-title>
          <v-list class="pb-0" lines="two" :items="actionItems"> </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import WalletMultisigTxBuilderMsgSend from '@/components/Wallet/Multisig/TxBuilderMsgSend.vue'

interface Action {
  icon: string
  label: string
  description: string
  template: {
    component: any
    value: {
      [key: string]: any
    }
  }
}

const actions = ref<Action[]>([
  {
    icon: 'mdi-send',
    label: 'Send',
    description: 'Send funds to another account',
    template: {
      component: WalletMultisigTxBuilderMsgSend,
      value: {
        bank: {
          send: {
            to_address: "",
            amount: [{
              denom: "ubtsg",
              amount: "0"
            }]
          }
        }
      }
    }
  }
])

const messages = ref<any[]>([{
  component: WalletMultisigTxBuilderMsgSend,
  value: {
    bank: {
      send: {
        to_address: "",
        amount: [{
          denom: "ubtsg",
          amount: "0"
        }]
      }
    }
  }
}])

const actionItems = computed(() => actions.value.map((action, index) => ({
  title: action.label,
  props: {
    prependIcon: action.icon,
    subtitle: action.description,
    onClick: () => messages.value.push(action.template),
  },
})))
</script>