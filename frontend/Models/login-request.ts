export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
  role: 'Admin' | 'Researcher' | string;
}
