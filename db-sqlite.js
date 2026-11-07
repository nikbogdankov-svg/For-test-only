// Local database: SQLite file via Node's built-in `node:sqlite` module.
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(process.env.DB_FILE || 'blog.db');

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    summary    TEXT,
    body       TEXT    NOT NULL,
    author     TEXT    NOT NULL,
    likes      INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author     TEXT    NOT NULL,
    body       TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Migration: databases created before the summary field existed get the column added.
const hasSummary = db.prepare('PRAGMA table_info(posts)').all().some((c) => c.name === 'summary');
if (!hasSummary) db.exec('ALTER TABLE posts ADD COLUMN summary TEXT');

// SQLite stores "YYYY-MM-DD HH:MM:SS" (UTC); return ISO-8601 like Postgres does.
const ISO = `strftime('%Y-%m-%dT%H:%M:%SZ', created_at) AS created_at`;

const q = {
  count: db.prepare('SELECT COUNT(*) AS n FROM posts'),
  listPosts: db.prepare(`
    SELECT p.id, p.title, p.summary, p.author, p.likes,
           strftime('%Y-%m-%dT%H:%M:%SZ', p.created_at) AS created_at,
           substr(p.body, 1, 180) AS excerpt,
           (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p
    ORDER BY p.created_at DESC, p.id DESC
  `),
  getPost: db.prepare(`SELECT id, title, summary, body, author, likes, ${ISO} FROM posts WHERE id = ?`),
  createPost: db.prepare('INSERT INTO posts (title, summary, body, author) VALUES (?, ?, ?, ?)'),
  deletePost: db.prepare('DELETE FROM posts WHERE id = ?'),
  likePost: db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?'),
  getLikes: db.prepare('SELECT likes FROM posts WHERE id = ?'),
  listComments: db.prepare(`SELECT id, post_id, author, body, ${ISO} FROM comments WHERE post_id = ? ORDER BY id`),
  createComment: db.prepare('INSERT INTO comments (post_id, author, body) VALUES (?, ?, ?)'),
  getComment: db.prepare(`SELECT id, post_id, author, body, ${ISO} FROM comments WHERE id = ?`),
};

// Same async interface as db-postgres.js, so server.js works with either.
export default {
  name: 'SQLite (blog.db)',
  async isEmpty() { return q.count.get().n === 0; },
  async listPosts() { return q.listPosts.all(); },
  async getPost(id) { return q.getPost.get(id); },
  async createPost({ title, summary = null, body, author }) {
    return q.getPost.get(q.createPost.run(title, summary, body, author).lastInsertRowid);
  },
  async deletePost(id) { q.deletePost.run(id); },
  async likePost(id) { q.likePost.run(id); return q.getLikes.get(id).likes; },
  async listComments(postId) { return q.listComments.all(postId); },
  async createComment(postId, author, body) {
    return q.getComment.get(q.createComment.run(postId, author, body).lastInsertRowid);
  },
};
