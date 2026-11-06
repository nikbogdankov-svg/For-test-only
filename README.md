# Mini Blog

A small full-stack site: write posts, comment on them and like them.

- **Frontend** — plain HTML/CSS/JS in `public/`
- **Backend** — Node.js + Express JSON API in `server.js`
- **Database** — either of two, picked in `db.js`:
  - **Online Postgres** (e.g. Neon) when `DATABASE_URL` is set in `.env` / `.env.local` — `db-postgres.js`
  - **Local SQLite** file `blog.db` otherwise — `db-sqlite.js`

  The server prints which one it is using when it starts.

## Run

Requires Node.js 22.13+.

```bash
npm install
npm start
```

Open http://localhost:3000. Data is saved to `blog.db`; delete that file to start fresh.

## API

| Method | Path                       | What it does                 |
|--------|----------------------------|------------------------------|
| GET    | `/api/posts`               | List posts                   |
| GET    | `/api/posts/:id`           | One post with its comments   |
| POST   | `/api/posts`               | Create a post `{title, body, author}` |
| DELETE | `/api/posts/:id`           | Delete a post (and its comments) |
| POST   | `/api/posts/:id/like`      | Add a like                   |
| POST   | `/api/posts/:id/comments`  | Add a comment `{author, body}` |

## Database schema

- `posts` — id, title, body, author, likes, created_at
- `comments` — id, post_id → posts.id (cascade delete), author, body, created_at
