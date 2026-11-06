// Online database: any Postgres server (e.g. Neon), reached through DATABASE_URL.
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

await pool.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id         SERIAL PRIMARY KEY,
    title      TEXT        NOT NULL,
    body       TEXT        NOT NULL,
    author     TEXT        NOT NULL,
    likes      INTEGER     NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS comments (
    id         SERIAL PRIMARY KEY,
    post_id    INTEGER     NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author     TEXT        NOT NULL,
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`);

const rows = async (sql, params) => (await pool.query(sql, params)).rows;
const row = async (sql, params) => (await rows(sql, params))[0];

export default {
  name: `Postgres (${new URL(process.env.DATABASE_URL).hostname})`,
  async isEmpty() { return (await row('SELECT COUNT(*)::int AS n FROM posts')).n === 0; },
  listPosts: () => rows(`
    SELECT p.id, p.title, p.author, p.likes, p.created_at,
           substr(p.body, 1, 180) AS excerpt,
           (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM posts p
    ORDER BY p.created_at DESC, p.id DESC
  `),
  getPost: (id) => row('SELECT * FROM posts WHERE id = $1', [id]),
  createPost: (title, body, author) =>
    row('INSERT INTO posts (title, body, author) VALUES ($1, $2, $3) RETURNING *', [title, body, author]),
  async deletePost(id) { await pool.query('DELETE FROM posts WHERE id = $1', [id]); },
  async likePost(id) {
    return (await row('UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes', [id])).likes;
  },
  listComments: (postId) => rows('SELECT * FROM comments WHERE post_id = $1 ORDER BY id', [postId]),
  createComment: (postId, author, body) =>
    row('INSERT INTO comments (post_id, author, body) VALUES ($1, $2, $3) RETURNING *', [postId, author, body]),
};
