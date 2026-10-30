import type { Credentials, PublicUser } from '../domain/user/entity.js';

export interface UserService {
  register(credentials: Credentials): Promise<PublicUser>;
  login(credentials: Credentials): Promise<{ user: PublicUser; accessToken: string; refreshToken: string }>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
}
