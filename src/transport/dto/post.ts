export interface CreatePost {
  title: string;
  content: string;
  author: string;
  category: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
}