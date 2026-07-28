export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-center text-sm text-muted sm:text-left">
        Page {page} of {totalPages} · {total} tasks
      </p>
      <div className="flex w-full max-w-full items-center justify-center gap-1 overflow-x-auto sm:w-auto">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="pagination-btn"
        >
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={p === page ? 'pagination-btn-active' : 'pagination-btn'}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
