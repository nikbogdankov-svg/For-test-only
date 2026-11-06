import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api } from '../api.js';
import { formatDate, useLoad } from '../utils.js';
import { BackLink } from '../components/BackLink.jsx';
import { Comment, CommentForm } from '../components/Comment.jsx';
import { Button, Card, ErrorMessage, Heading, Meta, Stack, Text } from '../components/ui';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, error, loading, reload } = useLoad(() => api.getPost(id), [id]);
  const [liking, setLiking] = useState(false);

  if (loading && !post) return <Text tone="muted">Loading…</Text>;
  if (error) {
    return (
      <Stack gap={2}>
        <ErrorMessage>{error.message}</ErrorMessage>
        <BackLink>Back</BackLink>
      </Stack>
    );
  }

  async function like() {
    setLiking(true);
    try {
      await api.likePost(id);
      reload();
    } finally {
      setLiking(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this post and all its comments?')) return;
    await api.deletePost(id);
    navigate('/');
  }

  return (
    <Stack gap={4}>
      <BackLink />

      <Card as="article">
        <Stack gap={3}>
          <Stack gap={1}>
            <Heading level={1} size="2xl">{post.title}</Heading>
            <Meta>by {post.author} · {formatDate(post.created_at)}</Meta>
          </Stack>
          <Text className="pre-wrap">{post.body}</Text>
          <Stack direction="row" gap={2} wrap>
            <Button variant="secondary" onClick={like} disabled={liking}>♥ {post.likes}</Button>
            <Button variant="danger" onClick={remove}>Delete</Button>
          </Stack>
        </Stack>
      </Card>

      <Card as="section">
        <Stack gap={3}>
          <Heading level={2} size="lg">Comments ({post.comments.length})</Heading>
          {post.comments.length === 0
            ? <Text tone="muted">No comments yet.</Text>
            : <div>{post.comments.map((c) => <Comment key={c.id} comment={c} />)}</div>}
          <CommentForm postId={id} onAdded={reload} />
        </Stack>
      </Card>
    </Stack>
  );
}
