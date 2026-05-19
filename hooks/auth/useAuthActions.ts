"use client"

import { useMemo } from "react"
import {
  loginUser,
  loginWithGoogleToken,
  logoutUser,
  registerUser,
  type AuthCartItemRequest,
} from "@/services/api/client"

export function useAuthActions() {
  return useMemo(
    () => ({
      login: {
        mutateAsync: (payload: {
          identifier: string
          password: string
          cartItems?: AuthCartItemRequest[]
        }) => loginUser(payload.identifier, payload.password, payload.cartItems),
      },
      register: {
        mutateAsync: (payload: {
          username: string
          email: string
          password: string
          cartItems?: AuthCartItemRequest[]
        }) =>
          registerUser(
            payload.username,
            payload.email,
            payload.password,
            payload.cartItems,
          ),
      },
      googleLogin: {
        mutateAsync: (payload: {
          idToken: string
          cartItems?: AuthCartItemRequest[]
        }) => loginWithGoogleToken(payload.idToken, payload.cartItems),
      },
      logout: {
        mutateAsync: () => logoutUser(),
      },
    }),
    [],
  )
}
