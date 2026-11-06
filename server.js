// Backend: Express server exposing a small JSON API and serving the frontend from /public.
import express from 'express';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Validate a required text field; returns the trimmed value or null.
function text(value, max) {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  return v.length > 0 && v.length <= max ? v : null;
}

// Wraps async handlers so database errors become a 500 instead of crashing the server.
const handle = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });

async function findPost(req, res) {
  const id = Number(req.params.id);
  const post = Number.isInteger(id) ? await db.getPost(id) : null;
  if (!post) res.status(404).json({ error: 'Post not found' });
  return post;
}

// --- Posts ---------------------------------------------------------------
app.get('/api/posts', handle(async (req, res) => {
  res.json(await db.listPosts());
}));

app.get('/api/posts/:id', handle(async (req, res) => {
  const post = await findPost(req, res);
  if (!post) return;
  res.json({ ...post, comments: await db.listComments(post.id) });
}));

app.post('/api/posts', handle(async (req, res) => {
  const title = text(req.body.title, 120);
  const body = text(req.body.body, 5000);
  const author = text(req.body.author, 40);
  if (!title || !body || !author) {
    return res.status(400).json({ error: 'Title, text and name are required.' });
  }
  res.status(201).json(await db.createPost(title, body, author));
}));

app.delete('/api/posts/:id', handle(async (req, res) => {
  const post = await findPost(req, res);
  if (!post) return;
  await db.deletePost(post.id); // comments are removed via ON DELETE CASCADE
  res.status(204).end();
}));

app.post('/api/posts/:id/like', handle(async (req, res) => {
  const post = await findPost(req, res);
  if (!post) return;
  res.json({ likes: await db.likePost(post.id) });
}));

// --- Comments ------------------------------------------------------------
app.post('/api/posts/:id/comments', handle(async (req, res) => {
  const post = await findPost(req, res);
  if (!post) return;
  const author = text(req.body.author, 40);
  const body = text(req.body.body, 1000);
  if (!author || !body) {
    return res.status(400).json({ error: 'Name and comment are required.' });
  }
  res.status(201).json(await db.createComment(post.id, author, body));
}));

app.listen(PORT, () => {
  console.log(`Mini Blog running at http://localhost:${PORT} — database: ${db.name}`);
});
