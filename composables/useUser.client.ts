import { ConnectionStates, signArbitrary, getAddress } from '@quirks/store';
import { useUserState, type User } from './useUserState';
import type { Session } from "lucia";

export async function useUser() {
  const user = useUserState()

  function createMsg() {
    const { appName, links, chainId } = useRuntimeConfig().public
    const address = getAddress("bitsong");
    const msg = `Welcome to ${appName}!

Click to sign in and accept the ${appName} Terms of Service (${links.tos}) and Privacy Policy (${links.privacy}).

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address:
${address}

Domain:
${window.location.hostname}

Date:
${new Date().toUTCString()}`;

    return {
      address,
      msg,
      chainId,
      appName,
      links,
    }
  }

  const { status, disconnect } = useConnect();

  async function logout() {
    const { data, error } = await useFetch('/api/auth/logout', {
      method: 'POST'
    })

    if (error.value) {
      user.value = null

      throw createError({
        message: 'Logout failed',
        statusCode: 500,
        data: error.value
      })
    }

    if (data.value) {
      user.value = null
    }
  }

  async function login() {
    try {
      const { address, chainId, msg } = createMsg()
      console.log('msg created')

      console.log('signing data', chainId, address, msg)

      const signData = await signArbitrary(
        chainId,
        address,
        msg,
      )

      if (!signData) {
        throw createError({
          message: 'Signature not created',
          statusCode: 500,
        })
      }

      console.log('signature created')

      const loginState = await $fetch<Session>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          msg: window.btoa(
            JSON.stringify({
              address,
              msg,
              pub_key: signData.pub_key,
              signature: signData.signature,
            }),
          )
        }),
      })

      console.log('promise done', loginState)

      return {
        user: loginState.user
      }
    } catch (e) {
      console.log('error while login', e)
    }
  }

  watch(
    status,
    async () => {
      console.log('--------> Wallet Status Changed', status.value)
      console.log('--------> User', user.value)
      if (status.value === ConnectionStates.DISCONNECTED) {
        if (user.value) {
          console.log('--------> Logout')
          await logout()
        }
      }

      if (status.value === ConnectionStates.CONNECTED) {
        if (user.value === null || user.value.address !== getAddress("bitsong")) {
          console.log('--------> Login')

          let remainingAttempts = 2

          while (remainingAttempts > 0) {
            try {
              const loginData = await login()
              console.log('--------> Login Data', loginData)

              if (loginData?.user !== null && loginData?.user.address !== getAddress("bitsong")) {
                await logout()
                user.value = null

                throw createError({
                  message: 'Address mismatch, disconnected!',
                  statusCode: 500,
                })
              }

              user.value = loginData?.user
              console.log('--------> New User Value', user.value)

              break
            } catch (e) {
              console.log('--------> Login Error', e)
              remainingAttempts--

              if (remainingAttempts === 0) {
                disconnect()
                user.value = null
              }
            }
          }
        }
      }
    },
    {
      immediate: true,
    }
  )

  return user as Ref<User | null>
}