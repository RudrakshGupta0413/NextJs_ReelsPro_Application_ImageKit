"use client"

import { toast as sonnerToast } from "sonner"

// Wrapper around sonner's toast
export function useToast() {
  return {
    toast: sonnerToast,
  }
}

// Optional: export toast directly if you want to import without hook
export const toast = sonnerToast
