<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

interface Props {
  username: string
  confirmationLink: string
}

const props = withDefaults(defineProps<Props>(), {
  username: '',
  confirmationLink: '',
})

const previewText = `Confirm your email address on Bitsong Studio`
</script>

<template>
  <ETailwind>
    <EHtml>
      <EHead />
      <EPreview>{{ previewText }}</EPreview>
      <EBody class="bg-white my-auto mx-auto font-sans">
        <EContainer class="border border-solid border-[#eaeaea] p-[20px] md:p-7 rounded my-[40px] mx-auto max-w-[465px]">

          <ESection class="mt-[32px]">
            <EImg src="/images/logo-circle-email.png" width="40" height="37" alt="Bitsong Studio" class="my-0 mx-auto" />
          </ESection>

          <EHeading class="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            Confirm your Email Address
          </EHeading>
          <EText class="text-black text-[14px] leading-[24px]"> Hello <strong>{{ username }}</strong>, </EText>
          <EText class="text-black text-[14px] leading-[24px]">
            We're excited to have you on board. Before you can start using Bitsong Studio! To complete your profile,
            please confirm your email address by clicking the button below:
          </EText>
          <ESection class="text-center mt-[32px] mb-[32px]">
            <EButton px="20" py="12"
              class="bg-[#f40a63] rounded text-white text-[12px] font-semibold no-underline text-center"
              :href="confirmationLink"> Confirm email address </EButton>
          </ESection>
          <EText class="text-black text-[14px] leading-[24px]">
            or copy and paste this URL into your browser:
            <ELink :href="confirmationLink" class="text-blue-600 no-underline">
              {{ confirmationLink }}
            </ELink>
          </EText>
          <EHr class="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <EText class="text-[#666666] text-[12px] leading-[24px]">
            This email was sent by Bitsong Studio. This link was intended for <span class="text-black">{{ username }}
            </span>.
            This link is valid for 24 hours. If you did not sign up for
            If you were not expecting this confirmation, you can ignore this email.If you are concerned about your
            account's safety, please reply to this email to get in
            touch with us.
          </EText>
        </EContainer>
      </EBody>
    </EHtml>
  </ETailwind>
</template>