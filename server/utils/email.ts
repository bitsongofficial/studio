import { SES } from '@aws-sdk/client-ses'
import { useCompiler } from '#vue-email'

const ses = new SES({ region: process.env.NUXT_AWS_SES_REGION })

export async function sendEmailVerification(email: string, username: string, confirmationToken: string) {
  const { vueEmail } = useRuntimeConfig().public
  const confirmationLink = `${vueEmail.baseUrl}/confirm-email?token=${confirmationToken}`

  const template = await useCompiler('email_confirmation.vue', {
    props: {
      username,
      confirmationLink
    }
  })

  const params = {
    Source: 'Bitsong Studio <nobody@bitsong.studio>',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: template.html,
        },
        Text: {
          Charset: 'UTF-8',
          Data: template.text,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Confirm your email address',
      },
    },
  }

  return await ses.sendEmail(params)
}