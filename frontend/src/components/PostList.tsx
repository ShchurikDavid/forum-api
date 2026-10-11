import type { Post } from '../types/post'
import { PostCard } from './PostCard'

type PostListProps = {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p>Постів поки немає.</p>
  }

  return (
    <ul className="post-list" aria-label="Список постів">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  )
}
