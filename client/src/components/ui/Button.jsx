import { Link } from 'react-router';
import { cx } from './cx.js';
import './Button.css';

/**
 * Button, or a link that looks like one when `to` is given.
 *   variant: 'primary' | 'secondary' | 'danger'
 *   size:    'sm' | 'md'
 */
export function Button({ variant = 'primary', size = 'md', to, className, ...props }) {
  const classes = cx('btn', `btn--${variant}`, `btn--${size}`, className);
  if (to) return <Link to={to} className={classes} {...props} />;
  return <button type="button" className={classes} {...props} />;
}
