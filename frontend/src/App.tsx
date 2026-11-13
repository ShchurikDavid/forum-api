import { PageHeader } from './components/PageHeader'
import { PostList } from './components/PostList'
import { useGetPostsQuery } from './api/baseApi'
import './App.css'

function App() {
  const { data: posts = [], isLoading, isError } = useGetPostsQuery()

  return (
    <main className="posts-page">
      <PageHeader title="Блог про розробку" />
      {isLoading ? (
        <p role="status">Завантаження постів...</p>
      ) : isError ? (
        <p role="alert">Не вдалося завантажити пости.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </main>
  )
}

export default App
