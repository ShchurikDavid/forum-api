const posts = [];

export function getAll(category, take) {
  let result = posts;

  if (category) {
    result = posts.filter((post) => post.category === category);
  }

  return take === undefined ? result : result.slice(0, take);
}

export function getById(id) {
  return posts.find((post) => post.id === id);
}

export async function addPost({ title, content, author, category }) {
  const post = { id: posts.length + 1, title, content, author, category };
  posts.push(post);
  return post;
}
