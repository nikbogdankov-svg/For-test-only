import { Route, Routes } from 'react-router';
import { SiteHeader } from './components/SiteHeader.jsx';
import { BackLink } from './components/BackLink.jsx';
import { Container, ErrorMessage, Stack } from './components/ui';
import PostList from './pages/PostList.jsx';
import PostPage from './pages/PostPage.jsx';
import NewPost from './pages/NewPost.jsx';

export default function App() {
  return (
    <>
      <SiteHeader />
      <Container as="main">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

function NotFound() {
  return (
    <Stack gap={2}>
      <ErrorMessage>Page not found.</ErrorMessage>
      <BackLink />
    </Stack>
  );
}
