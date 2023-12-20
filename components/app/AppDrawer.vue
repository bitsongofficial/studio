<template>
  <!--<v-navigation-drawer :permanent="mdAndUp" :temporary="mdAndDown" v-model="drawer">-->
  <v-navigation-drawer permanent v-model="drawer">
    <div class="d-flex pt-3 pb-1 pl-4">
      <div><app-logo> </app-logo></div>
      <div class="ml-3 text-h5 d-flex align-center mr-2">{{ appName }}</div>
      <div class="d-flex align-center">
        <v-chip color="primary" class="text-capitalize">{{ network }}</v-chip>
      </div>
    </div>

    <!--<div v-if="isLoggedIn">
      <v-list class="pb-0">
        <v-list-item class="pr-1" :title="name" :subtitle="formatShortAddress(address, 6)">
          <template v-slot:append>
            <app-btn-copy :text="address ?? ``"></app-btn-copy>
            <v-btn icon="mdi:mdi-logout" color="grey-lighten-1" size="small" variant="text"
              @click.stop="disconnect"></v-btn>
          </template>
        </v-list-item>
        <v-list-item :subtitle="`Balance: ${balance.toLocaleString()} BTSG`">
          <template v-slot:append>
            <v-btn :loading="loading" icon="mdi-refresh" color="grey-lighten-1" size="small" variant="text"
              @click.stop="getBalance"></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>-->

    <v-list nav>
      <div v-for="item in navItems" :key="item.to">
        <v-list-item :exact="item.exact" :to="item.to" :prepend-icon="item.icon" rounded="lg">
          <v-list-item-title class="text-body-1">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { network, appName } = useRuntimeConfig().public
const { drawer, navItems } = useNavigationDrawer();
</script>
