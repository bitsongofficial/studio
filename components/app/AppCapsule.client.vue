<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Register User</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="registerUser">
              <v-text-field v-model="email" label="Email" required></v-text-field>
              <v-btn :loading="loadingRegister" type="submit" color="primary">Register</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Verify Email</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="verifyEmail">
              <v-text-field v-model="verificationCode" label="Verification Code" required></v-text-field>
              <v-btn :loading="loadingVerifyEmail" type="submit" color="primary">Verify Email</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Recovery Key</v-card-title>
          <v-card-text>
            <code>{{ recoveryKey }}</code>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Login User</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="loginUser">
              <v-text-field v-model="email" label="Email" required></v-text-field>
              <v-btn :loading="loadingLogin" type="submit" color="primary">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Capsule, { CapsuleProtoSigner, Environment } from '@usecapsule/web-sdk';

const capsule = new Capsule(
  Environment.DEVELOPMENT,
  useRuntimeConfig().public.capsuleApiKey
);

const { success, error } = useNotify()

const recoveryKey = ref('');

const email = ref('');
const loadingRegister = ref(false);

async function registerUser() {
  loadingRegister.value = true;

  try {
    await capsule.createUser(email.value);
  } catch (e) {
    error((e as Error).message);
  } finally {
    loadingRegister.value = false;
  }
}

const verificationCode = ref('');
const loadingVerifyEmail = ref(false);

async function verifyEmail() {
  loadingVerifyEmail.value = true;

  try {
    const passkeyUrl = await capsule.verifyEmail(verificationCode.value);
    window.open(passkeyUrl, 'popup', 'width=575,height=820');

    recoveryKey.value = await capsule.waitForPasskeyAndCreateWallet();
  } catch (e) {
    error((e as Error).message);
  } finally {
    loadingVerifyEmail.value = false;
  }
}

const loadingLogin = ref(false);
async function loginUser() {
  loadingLogin.value = true;

  try {
    const passkeyUrl = await capsule.initiateUserLogin(email.value);
    window.open(passkeyUrl, 'popup', 'width=575,height=820');

    await capsule.waitForLoginAndSetup();

    const protoSigner = new CapsuleProtoSigner(capsule);
    const msg = JSON.stringify({
      address: protoSigner.address,
      walletId: protoSigner.currentWalletId,
      //prefix: protoSigner.prefix,
    });
    alert(msg);
  } catch (e) {
    error((e as Error).message);
  } finally {
    loadingLogin.value = false;
  }
}
</script>