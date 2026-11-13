export interface User {
  id: number;
  email: string;
  password: string;
}

export type PublicUser = Omit<User, 'password'>;
export type Credentials = Pick<User, 'email' | 'password'>;

export class EmailConflictError extends Error {}
export class InvalidCredentialsError extends Error {}
