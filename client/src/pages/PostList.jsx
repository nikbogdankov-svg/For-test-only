import { Link } from 'react-router';
import { api } from '../api.js';
import { formatDate, useLoad } from '../utils.js';

export default function PostList() {
  const { data: posts, error, loading } = useLoad(api.listPosts, []);

  if (loading && !posts) return <p className="muted">Loading…</p>;
  if (error) return <p className="error">{error.message}</p>;
  if (posts.length === 0) {
    return <p className="muted">No posts yet. <Link to="/new">Write the first one</Link>.</p>;
  }

  return posts.map((p) => (
    <article className="card" key={p.id}>
      <h2><Link style={{ fontSize: "1.875rem", lineHeight: "1.2" }} to={`/post/${p.id}`}>{p.title}</Link></h2>
      <div className="meta" style={{ fontSize: "1rem", lineHeight: "1.5" }}>by {p.author} · {formatDate(p.created_at)}</div>
      <p>{p.excerpt}{p.excerpt.length >= 180 && '…'}</p>
      <div className="meta">♥ {p.likes} · 💬 {p.comment_count}</div>
    </article>
  ));
}
