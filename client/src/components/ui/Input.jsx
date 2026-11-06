import { cx } from './cx.js';
import './Input.css';

// Single-line text input. Accepts every normal <input> prop.
export function Input({ className, ...props }) {
  return <input className={cx('input', className)} {...props} />;
}

// Multi-line text input. Accepts every normal <textarea> prop.
export function Textarea({ className, ...props }) {
  return <textarea className={cx('input', 'input--multiline', className)} {...props} />;
}

// Wraps an Input/Textarea with a label above it (and an optional hint below).
export function Field({ label, hint, className, children }) {
  return (
    <label className={cx('field', className)}>
      <span className="field__label">{label}</span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}
