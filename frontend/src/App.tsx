import { PageHeader } from './components/PageHeader'
import { PostList } from './components/PostList'
import { posts } from './data/posts'
import './App.css'

function App() {
  return (
    <main className="posts-page">
      <PageHeader title="Блог про розробку" />
      <PostList posts={posts} />
    </main>
  )
}

export default App
