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
    pages/           PostList, PostPage, NewPost — composed from the components below
    components/
      ui/            reusable building blocks, each with its own CSS:
                     Button, Input, Textarea, Field, Card, Heading, Text, Meta,
                     ErrorMessage, Container, Stack
      SiteHeader, PostCard, Comment (+ CommentForm), BackLink
    styles/
      tokens.css     design tokens: colors, fonts, font sizes, line heights,
                     spacing, border radius, shadows — change the look here
      base.css       page-wide defaults
```

### Styling

Never hard-code sizes or colors; use the tokens from `styles/tokens.css`:

```css
padding: var(--space-4);          /* 16px — spacing scale 1–16 on a 4px grid */
font-size: var(--text-lg);        /* xs, sm, base, lg, xl, 2xl, 3xl */
border-radius: var(--radius-lg);  /* sm, md, lg, xl, full */
color: var(--color-text-muted);
```

The names follow Tailwind's scale, so `text-3xl` in a design tool is `--text-3xl` here.

## API

| Method | Path                       | What it does                 |
|--------|----------------------------|------------------------------|
| GET    | `/api/posts`               | List posts                   |
| GET    | `/api/posts/:id`           | One post with its comments   |
| POST   | `/api/posts`               | Create a post `{title, summary?, body, author}` (summary optional, ≤200 chars) |
| DELETE | `/api/posts/:id`           | Delete a post (and its comments) |
| POST   | `/api/posts/:id/like`      | Add a like                   |
| POST   | `/api/posts/:id/comments`  | Add a comment `{author, body}` |

## Database schema

- `posts` — id, title, summary (optional), body, author, likes, created_at
- `comments` — id, post_id → posts.id (cascade delete), author, body, created_at
