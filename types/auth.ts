export interface AuthUser {
  id: number
  username: string
  email: string
  isAdmin: boolean
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}
