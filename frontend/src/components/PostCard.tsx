import type { Post } from '../types/post'

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <span className="post-category">{post.category}</span>
      <h2>{post.title}</h2>
      <p className="post-content">{post.content}</p>
      <footer className="post-author">
        <span className="author-avatar" aria-hidden="true">
          {post.author.split(' ').filter(Boolean).slice(0, 2).map((name) => name[0]).join('')}
        </span>
        <span>Автор: {post.author}</span>
      </footer>
    </article>
  )
}
