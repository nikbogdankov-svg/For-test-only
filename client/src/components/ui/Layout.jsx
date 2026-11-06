import { cx } from './cx.js';
import './Layout.css';

// Centered page column with side padding.
export function Container({ as: Tag = 'div', className, ...props }) {
  return <Tag className={cx('container', className)} {...props} />;
}

/**
 * Lays children out in a column (or a row) with even spacing between them.
 *   gap:       spacing step from the tokens: 0, 1, 2, 3, 4, 5, 6, 8… (default 3 = 12px)
 *   direction: 'column' | 'row'
 *   align / justify: CSS align-items / justify-content
 *   wrap:      let row items wrap onto the next line
 */
export function Stack({
  as: Tag = 'div', gap = 3, direction = 'column', align, justify, wrap, className, style, ...props
}) {
  return (
    <Tag
      className={cx('stack', direction === 'row' && 'stack--row', wrap && 'stack--wrap', className)}
      style={{ gap: `var(--space-${gap})`, alignItems: align, justifyContent: justify, ...style }}
      {...props}
    />
  );
}
