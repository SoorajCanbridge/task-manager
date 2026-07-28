import { useEffect, useState } from 'react';
import { validateTaskTitle } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

export default function TaskForm({ open, task, onClose, onSave, saving }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setError('');
    }
  }, [open, task]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const titleError = validateTaskTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <h2 className="heading-section mb-4">
          {task ? 'Edit task' : 'New task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="What needs doing?"
            />
            {error && <p className="field-error">{error}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input"
              placeholder="Any extra details (optional)"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={saving} className="btn-secondary btn-block">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary btn-block">
              {saving ? <LoadingSpinner size="sm" /> : task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
