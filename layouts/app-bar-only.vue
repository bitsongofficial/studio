<template>
  <v-layout>
    <app-bar :show-user-menu="true"> </app-bar>
    <v-main>
      <slot> </slot>
    </v-main>
  </v-layout>
</template>