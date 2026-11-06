import { Link } from 'react-router';
import { Button } from './ui';
import './SiteHeader.css';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__logo">Mini Blog</Link>
      <Button to="/new">New post</Button>
    </header>
  );
}
