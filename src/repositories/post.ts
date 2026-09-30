import type { Post } from '../domain/post/entity.js';
import type { Repository } from '../domain/post/repository.js';

export function createPostRepository(): Repository {
  const posts: Post[] = [];

  return {
    getAll(category, take) {
      let result = posts;

      if (category) {
        result = posts.filter((post) => post.category === category);
      }
      return take === undefined ? result : result.slice(0, take);
    },
    getById(id) {
      return posts.find((post) => post.id === id);
    },
    async addPost({ title, content, author, category }) {
      const post = { id: posts.length + 1, title, content, author, category };
      posts.push(post);
      return post;
    },
  };
}

