import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { api } from '../api.js';
import { formatDate, useLoad, useSavedName } from '../utils.js';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, error, loading, reload } = useLoad(() => api.getPost(id), [id]);
  const [liking, setLiking] = useState(false);

  if (loading && !post) return <p className="muted">Loading…</p>;
  if (error) {
    return (
      <>
        <p className="error">{error.message}</p>
        <p><Link to="/">← Back</Link></p>
      </>
    );
  }

  async function like() {
    setLiking(true);
    try {
      await api.likePost(id);
      reload();
    } finally {
      setLiking(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this post and all its comments?')) return;
    await api.deletePost(id);
    navigate('/');
  }

  return (
    <>
      <p><Link to="/">← All posts</Link></p>

      <article className="card">
        <h2>{post.title}</h2>
        <div className="meta">by {post.author} · {formatDate(post.created_at)}</div>
        <p className="post-body">{post.body}</p>
        <div className="row">
          <button className="btn secondary" onClick={like} disabled={liking}>
            ♥ {post.likes}
          </button>
          <button className="btn danger" onClick={remove}>Delete</button>
        </div>
      </article>

      <section className="card">
        <h3>Comments ({post.comments.length})</h3>
        {post.comments.length === 0 && <p className="muted">No comments yet.</p>}
        {post.comments.map((c) => (
          <div className="comment" key={c.id}>
            <div className="meta">{c.author} · {formatDate(c.created_at)}</div>
            <div>{c.body}</div>
          </div>
        ))}
        <CommentForm postId={id} onAdded={reload} />
      </section>
    </>
  );
}

function CommentForm({ postId, onAdded }) {
  const [author, setAuthor] = useSavedName();
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.addComment(postId, { author, body });
      setBody('');
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={author} onChange={(e) => setAuthor(e.target.value)}
             placeholder="Your name" maxLength={40} required />
      <textarea value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Write a comment…" maxLength={1000} required />
      <p className="error">{error}</p>
      <div><button className="btn" disabled={sending}>Add comment</button></div>
    </form>
  );
}
