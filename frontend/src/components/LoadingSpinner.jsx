export default function LoadingSpinner({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : 'spinner-md';

  return (
    <div className={sizeClass} role="status" aria-label="Loading" />
  );
}
