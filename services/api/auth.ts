import type { AuthResponse } from "@/types/auth"
import {
  get,
  post,
  requestAccessTokenRefresh,
} from "@/services/api/request"

export interface AuthCartItemRequest {
  productId: number
  quantity: number
}

export const loginUser = (
  identifier: string,
  password: string,
  cartItems: AuthCartItemRequest[] = [],
) => post<AuthResponse>("/api/auth/login", { identifier, password, cartItems })

export const registerUser = (
  username: string,
  email: string,
  password: string,
  cartItems: AuthCartItemRequest[] = [],
) => post<AuthResponse>("/api/auth/register", { username, email, password, cartItems })

export const loginWithGoogleToken = (
  idToken: string,
  cartItems: AuthCartItemRequest[] = [],
) => post<AuthResponse>("/api/auth/google", { idToken, cartItems })

export const refreshAccessToken = async (): Promise<AuthResponse | null> => {
  try {
    return await requestAccessTokenRefresh()
  } catch {
    return null
  }
}

export const logoutUser = () =>
  post<void>("/api/auth/logout")
