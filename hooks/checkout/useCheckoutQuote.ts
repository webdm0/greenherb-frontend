"use client"

import { useMutation } from "@tanstack/react-query"
import { previewCheckoutQuote } from "@/services/api/client"

export function useCheckoutQuote() {
  return useMutation({
    mutationFn: previewCheckoutQuote,
  })
}
