import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../api.js';
import { useSavedName } from '../utils.js';
import { BackLink } from '../components/BackLink.jsx';
import { Button, Card, ErrorMessage, Field, Heading, Input, Stack, Textarea } from '../components/ui';

export default function NewPost() {
  const navigate = useNavigate();
  const [author, setAuthor] = useSavedName();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const post = await api.createPost({ author, title, body });
      navigate(`/post/${post.id}`);
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  return (
    <Stack gap={4}>
      <BackLink />
      <Card>
        <Stack gap={4}>
          <Heading level={1} size="xl">New post</Heading>
          <Stack as="form" gap={3} onSubmit={submit}>
            <Field label="Your name">
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={40} required />
            </Field>
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
            </Field>
            <Field label="Text">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} required />
            </Field>
            <ErrorMessage>{error}</ErrorMessage>
            <Stack direction="row" gap={2}>
              <Button type="submit" disabled={sending}>Publish</Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
