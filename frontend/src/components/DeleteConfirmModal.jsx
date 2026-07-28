import LoadingSpinner from './LoadingSpinner';

export default function DeleteConfirmModal({ open, task, onClose, onConfirm, deleting }) {
  if (!open || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-panel sm:max-w-md">
        <h2 className="heading-section mb-2">Delete task?</h2>
        <p className="text-muted mb-1">
          This will permanently remove <span className="font-medium text-ink">&quot;{task.title}&quot;</span>.
        </p>
        <p className="text-sm text-soft mb-6">You can&apos;t undo this action.</p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={deleting} className="btn-secondary btn-block">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={deleting} className="btn-danger btn-block">
            {deleting ? <LoadingSpinner size="sm" /> : 'Delete task'}
          </button>
        </div>
      </div>
    </div>
  );
}
