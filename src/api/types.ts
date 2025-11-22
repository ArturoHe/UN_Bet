export interface User {
  id: number;
  username: string;
  image_perfil: string;
  description: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface authResponse {
  username: string;
  id: string;
}

export interface BalanceResponse {
  balance: number;
}
