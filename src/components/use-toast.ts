"use client"

import { useState } from "react"
import { toast } from "sonner"

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success" | "warning" | "info"
}

const TOAST_LIMIT = 5

type ToasterToast = ToastProps & {
  id: string
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const addToast = (props: ToastProps) => {
    const id = genId()
    const newToast = { ...props, id }

    // Use sonner to show the toast
    if (newToast.variant === "success") {
      toast.success(newToast.title, {
        description: newToast.description,
        action: newToast.action,
        duration: 5000,
        onDismiss: () => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        },
      })
    } else if (newToast.variant === "warning") {
      toast.warning(newToast.title, {
        description: newToast.description,
        action: newToast.action,
        duration: 5000,
        onDismiss: () => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        },
      })
    } else if (newToast.variant === "info") {
      toast.info(newToast.title, {
        description: newToast.description,
        action: newToast.action,
        duration: 5000,
        onDismiss: () => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        },
      })
    } else if (newToast.variant === "destructive") {
      toast.error(newToast.title, {
        description: newToast.description,
        action: newToast.action,
        duration: 5000,
        onDismiss: () => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        },
      })
    } else {
      toast(newToast.title, {
        description: newToast.description,
        action: newToast.action,
        duration: 5000,
        onDismiss: () => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        },
      })
    }
    setToasts((prev) => [...prev, newToast].slice(0, TOAST_LIMIT))
  }

  const dismissToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId))
  }

  return {
    toasts,
    addToast,
    dismissToast,
  }
}

export { useToast }