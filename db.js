// Picks the database: online Postgres when DATABASE_URL is set, otherwise the local SQLite file.
const db = process.env.DATABASE_URL
  ? (await import('./db-postgres.js')).default
  : (await import('./db-sqlite.js')).default;

// Seed a couple of posts the first time so the page isn't empty.
if (await db.isEmpty()) {
  const first = await db.createPost({
    title: 'Hello, world!',
    summary: 'The very first post on Mini Blog.',
    body: 'This is the first post. Everything you see here is stored in a database and served by an Express backend.',
    author: 'Admin',
  });
  await db.createPost({
    title: 'How this site works',
    summary: 'A quick tour of the frontend, API and database behind this blog.',
    body: 'The browser calls a JSON API (/api/posts). The server reads and writes the database, then sends the data back. Try writing a post, leaving a comment or hitting like — then restart the server and see that it all persists.',
    author: 'Admin',
  });
  await db.createComment(first.id, 'Visitor', 'Nice first post!');
}

export default db;
