// All calls to the backend JSON API live here.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  listPosts: () => request('/posts'),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (post) => request('/posts', { method: 'POST', body: post }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  likePost: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
  addComment: (id, comment) => request(`/posts/${id}/comments`, { method: 'POST', body: comment }),
};
