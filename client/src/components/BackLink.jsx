import { Link } from 'react-router';
import { Text } from './ui';

// "← All posts" style link back to another page.
export function BackLink({ to = '/', children = 'All posts' }) {
  return (
    <Text>
      <Link to={to}>← {children}</Link>
    </Text>
  );
}
