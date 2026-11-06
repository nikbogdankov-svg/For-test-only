import { Link } from 'react-router';
import { api } from '../api.js';
import { useLoad } from '../utils.js';
import { PostCard } from '../components/PostCard.jsx';
import { ErrorMessage, Stack, Text } from '../components/ui';

export default function PostList() {
  const { data: posts, error, loading } = useLoad(api.listPosts, []);

  if (loading && !posts) return <Text tone="muted">Loading…</Text>;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  if (posts.length === 0) {
    return <Text tone="muted">No posts yet. <Link to="/new">Write the first one</Link>.</Text>;
  }

  return (
    <Stack gap={4}>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </Stack>
  );
}
