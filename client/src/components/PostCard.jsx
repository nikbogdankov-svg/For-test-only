import { Link } from 'react-router';
import { formatDate } from '../utils.js';
import { Card, Heading, Meta, Stack, Text } from './ui';

const EXCERPT_LENGTH = 180;

// One post in the list: title, author/date, a short excerpt and counts.
export function PostCard({ post }) {
  return (
    <Card as="article">
      <Stack gap={2}>
        <Stack gap={1}>
          <Heading level={2} size="3xl">
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </Heading>
          <Meta size="base">by {post.author} · {formatDate(post.created_at)}</Meta>
        </Stack>
        <Text>{post.excerpt}{post.excerpt.length >= EXCERPT_LENGTH && '…'}</Text>
        <Meta>♥ {post.likes} · 💬 {post.comment_count}</Meta>
      </Stack>
    </Card>
  );
}
