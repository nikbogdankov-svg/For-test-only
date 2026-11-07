import { useState } from 'react';
import { api } from '../api.js';
import { formatDate, useSavedName } from '../utils.js';
import { Button, ErrorMessage, Input, Meta, Stack, Text, Textarea } from './ui';
import './Comment.css';

// A single comment: who wrote it, when, and the text.
export function Comment({ comment }) {
  return (
    <div className="comment">
      <Meta>{comment.author} · {formatDate(comment.created_at)}</Meta>
      <Text preserveLines>{comment.body}</Text>
    </div>
  );
}

// All comments of a post, or a note when there are none yet.
export function CommentList({ comments }) {
  if (comments.length === 0) return <Text tone="muted">No comments yet.</Text>;
  return (
    <Stack gap={0}>
      {comments.map((c) => <Comment key={c.id} comment={c} />)}
    </Stack>
  );
}

// Form for adding a comment to a post; calls onAdded() after saving.
export function CommentForm({ postId, onAdded }) {
  const [author, setAuthor] = useSavedName();
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.addComment(postId, { author, body });
      setBody('');
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Stack as="form" gap={3} onSubmit={submit}>
      <Input value={author} onChange={(e) => setAuthor(e.target.value)}
             placeholder="Your name" aria-label="Your name" maxLength={40} required />
      <Textarea value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Write a comment…" aria-label="Comment" maxLength={1000} required />
      <ErrorMessage>{error}</ErrorMessage>
      <Stack direction="row" gap={2}>
        <Button type="submit" disabled={sending}>Add comment</Button>
      </Stack>
    </Stack>
  );
}
