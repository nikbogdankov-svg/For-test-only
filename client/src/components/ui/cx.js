// Joins class names, skipping empty ones: cx('btn', isActive && 'btn--active').
export const cx = (...names) => names.filter(Boolean).join(' ');
