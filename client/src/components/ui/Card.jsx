import { cx } from './cx.js';
import './Card.css';

// A bordered, rounded panel. `as` picks the HTML tag (div, article, section…).
export function Card({ as: Tag = 'div', className, ...props }) {
  return <Tag className={cx('card', className)} {...props} />;
}
