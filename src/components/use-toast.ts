'use client'

import { toast as sonnerToast, Toaster } from 'sonner'

function useToast() {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
  }
}

export { useToast, Toaster }
