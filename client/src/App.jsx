import { Link, Route, Routes } from 'react-router';
import PostList from './pages/PostList.jsx';
import PostPage from './pages/PostPage.jsx';
import NewPost from './pages/NewPost.jsx';

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">Mini Blog</Link>
        <Link to="/new" className="btn">New post</Link>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

function NotFound() {
  return (
    <>
      <p className="error">Page not found.</p>
      <p><Link to="/">← All posts</Link></p>
    </>
  );
}
