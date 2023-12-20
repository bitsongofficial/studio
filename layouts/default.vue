<template>
  <v-layout>
    <app-drawer> </app-drawer>
    <app-bar :show-logo="false"> </app-bar>
    <v-main>
      <slot> </slot>
    </v-main>
  </v-layout>
</template>