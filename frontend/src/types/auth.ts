export interface RegisterRequest {
  email: string
  password: string
}

export type LoginRequest = RegisterRequest

export interface RegisterResponse {
  id: number
  email: string
}

export type LoginResponse = RegisterResponse
