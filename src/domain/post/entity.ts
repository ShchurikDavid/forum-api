import type { PublicUser } from '../user/entity.js';
import type { Category } from '../category/entity.js';
export interface Post {
  id: number;
  author: PublicUser;
  category: Category;
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
}

export interface NewPost {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
}

