import argon2 from 'argon2';

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!hash.startsWith('$argon2')) return false;
  return argon2.verify(hash, password);
}
