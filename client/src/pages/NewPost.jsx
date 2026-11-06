import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api } from '../api.js';
import { useSavedName } from '../utils.js';

export default function NewPost() {
  const navigate = useNavigate();
  const [author, setAuthor] = useSavedName();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const post = await api.createPost({ author, title, body });
      navigate(`/post/${post.id}`);
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  return (
    <>
      <p><Link to="/">← All posts</Link></p>
      <div className="card">
        <h2>New post</h2>
        <form onSubmit={submit}>
          <label>Your name
            <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={40} required />
          </label>
          <label>Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
          </label>
          <label>Text
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} required />
          </label>
          <p className="error">{error}</p>
          <div><button className="btn" disabled={sending}>Publish</button></div>
        </form>
      </div>
    </>
  );
}
