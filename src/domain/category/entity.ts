export interface Category { id: number; name: string }
export interface NewCategory { name: string }

export class NotFoundError extends Error {}
export class ConflictError extends Error {}
