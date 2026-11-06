// Frontend: tiny hash-based router that talks to the backend JSON API.
const app = document.getElementById('app');

// Remember the visitor's name so they don't have to retype it.
const savedName = () => localStorage.getItem('name') || '';
const saveName = (n) => localStorage.setItem('name', n);

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

// The API sends ISO-8601 UTC timestamps; show them in the visitor's local time.
function when(ts) {
  return new Date(ts).toLocaleString();
}

// --- Views ---------------------------------------------------------------
async function showList() {
  const posts = await api('/posts');
  if (posts.length === 0) {
    app.innerHTML = `<p class="muted">No posts yet. <a href="#/new">Write the first one</a>.</p>`;
    return;
  }
  app.innerHTML = posts.map((p) => `
    <article class="card">
      <h2><a href="#/post/${p.id}">${esc(p.title)}</a></h2>
      <div class="meta">by ${esc(p.author)} · ${when(p.created_at)}</div>
      <p>${esc(p.excerpt)}${p.excerpt.length >= 180 ? '…' : ''}</p>
      <div class="meta">♥ ${p.likes} · 💬 ${p.comment_count}</div>
    </article>
  `).join('');
}

async function showPost(id) {
  const post = await api(`/posts/${id}`);
  app.innerHTML = `
    <p><a href="#/">← All posts</a></p>
    <article class="card">
      <h2>${esc(post.title)}</h2>
      <div class="meta">by ${esc(post.author)} · ${when(post.created_at)}</div>
      <p class="post-body">${esc(post.body)}</p>
      <div class="row">
        <button class="btn secondary" id="like">♥ <span id="likes">${post.likes}</span></button>
        <button class="btn danger" id="delete">Delete</button>
      </div>
    </article>

    <section class="card">
      <h3>Comments (${post.comments.length})</h3>
      <div>
        ${post.comments.map((c) => `
          <div class="comment">
            <div class="meta">${esc(c.author)} · ${when(c.created_at)}</div>
            <div>${esc(c.body)}</div>
          </div>
        `).join('') || '<p class="muted">No comments yet.</p>'}
      </div>
      <form id="comment-form">
        <input name="author" placeholder="Your name" maxlength="40" value="${esc(savedName())}" required>
        <textarea name="body" placeholder="Write a comment…" maxlength="1000" required></textarea>
        <p class="error" id="error"></p>
        <div><button class="btn">Add comment</button></div>
      </form>
    </section>
  `;

  document.getElementById('like').onclick = async (e) => {
    e.currentTarget.disabled = true;
    const { likes } = await api(`/posts/${id}/like`, { method: 'POST' });
    document.getElementById('likes').textContent = likes;
    e.currentTarget.disabled = false;
  };

  document.getElementById('delete').onclick = async () => {
    if (!confirm('Delete this post and all its comments?')) return;
    await api(`/posts/${id}`, { method: 'DELETE' });
    location.hash = '#/';
  };

  document.getElementById('comment-form').onsubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      saveName(form.get('author'));
      await api(`/posts/${id}/comments`, {
        method: 'POST',
        body: { author: form.get('author'), body: form.get('body') },
      });
      showPost(id);
    } catch (err) {
      document.getElementById('error').textContent = err.message;
    }
  };
}

function showNew() {
  app.innerHTML = `
    <p><a href="#/">← All posts</a></p>
    <div class="card">
      <h2>New post</h2>
      <form id="post-form">
        <label>Your name<input name="author" maxlength="40" value="${esc(savedName())}" required></label>
        <label>Title<input name="title" maxlength="120" required></label>
        <label>Text<textarea name="body" maxlength="5000" required></textarea></label>
        <p class="error" id="error"></p>
        <div><button class="btn">Publish</button></div>
      </form>
    </div>
  `;
  document.getElementById('post-form').onsubmit = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    try {
      saveName(form.author);
      const post = await api('/posts', { method: 'POST', body: form });
      location.hash = `#/post/${post.id}`;
    } catch (err) {
      document.getElementById('error').textContent = err.message;
    }
  };
}

// --- Router --------------------------------------------------------------
async function route() {
  const hash = location.hash || '#/';
  try {
    const match = hash.match(/^#\/post\/(\d+)$/);
    if (match) await showPost(match[1]);
    else if (hash === '#/new') showNew();
    else await showList();
  } catch (err) {
    app.innerHTML = `<p class="error">${esc(err.message)}</p><p><a href="#/">← Back</a></p>`;
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
