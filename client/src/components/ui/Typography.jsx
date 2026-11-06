import { cx } from './cx.js';
import './Typography.css';

const DEFAULT_HEADING_SIZE = { 1: '2xl', 2: 'xl', 3: 'lg', 4: 'base' };

/**
 * Heading <h1>–<h4>.
 *   level: 1–4 (which tag)
 *   size:  'base' | 'lg' | 'xl' | '2xl' | '3xl' (how big; defaults by level)
 */
export function Heading({ level = 2, size, className, ...props }) {
  const Tag = `h${level}`;
  return <Tag className={cx('heading', `heading--${size || DEFAULT_HEADING_SIZE[level]}`, className)} {...props} />;
}

/**
 * Body text.
 *   as:   HTML tag (default <p>)
 *   size: 'xs' | 'sm' | 'base' | 'lg'
 *   tone: 'default' | 'muted' | 'danger'
 */
export function Text({ as: Tag = 'p', size, tone, className, ...props }) {
  return <Tag className={cx('text', size && `text--${size}`, tone && `text--${tone}`, className)} {...props} />;
}

// Small grey line for authors, dates and counts.
export function Meta(props) {
  return <Text as="div" size="sm" tone="muted" {...props} />;
}

// Red error message; renders nothing when there's no message.
export function ErrorMessage({ children, ...props }) {
  if (!children) return null;
  return <Text size="sm" tone="danger" role="alert" {...props}>{children}</Text>;
}
