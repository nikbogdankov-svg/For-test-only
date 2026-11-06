# Mini Blog

A small full-stack site: write posts, comment on them and like them.

- **Frontend** — React 19 + React Router, built with Vite, in `client/`
- **Backend** — Node.js + Express JSON API in `server.js`
- **Database** — either of two, picked in `db.js`:
  - **Online Postgres** (e.g. Neon) when `DATABASE_URL` is set in `.env` / `.env.local` — `db-postgres.js`
  - **Local SQLite** file `blog.db` otherwise — `db-sqlite.js`

  The server prints which one it is using when it starts.

## Run

Requires Node.js 22.13+.

```bash
npm install
npm run dev        # development: http://localhost:3000, React reloads live as you edit
```

For production:

```bash
npm run build      # compiles the React app into dist/
npm start          # serves dist/ and the API
```

To start over with an empty local database, delete `blog.db`.

## Project layout

```
server.js            Express: API routes + serves the React app
db.js                picks Postgres or SQLite, seeds example posts
db-postgres.js       Postgres queries
db-sqlite.js         SQLite queries
vite.config.js       Vite build settings
client/
  index.html
  src/
    main.jsx         React entry point + router
    App.jsx          header and routes
    api.js           calls to the backend API
    utils.js         date formatting, data-loading and saved-name hooks
    pages/           PostList, PostPage (with comments), NewPost
    styles.css
```

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
