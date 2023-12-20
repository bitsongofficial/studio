import { useToast } from 'vue-toastification'

export const useNotify = () => {
  const toast = useToast()

  return {
    success: (message: string) => {
      toast.success(message)
    },
    error: (message: string) => {
      toast.error(message)
    },
  }
}