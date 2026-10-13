import type { Category } from '../category/entity.js';
export interface Post {
  id: number;
  category: Category;
  title: string;
  content: string;
  author: string;
  categoryId: number;
}

export interface NewPost {
  title: string;
  content: string;
  author: string;
  categoryId: number;
}

