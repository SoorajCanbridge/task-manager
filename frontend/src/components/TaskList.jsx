import UserAvatar from './UserAvatar';
import StatusSelect from './StatusSelect';
import { EditIcon, DeleteIcon } from './Icons';
import { formatRelativeTime, formatFullDateTime } from '../utils/formatDate';

function TaskActions({ task, onEdit, onDeleteClick, deletingId }) {
  return (
    <div className="action-group">
      <button
        type="button"
        onClick={() => onEdit(task)}
        className="icon-btn-edit"
        aria-label={`Edit ${task.title}`}
        title="Edit task"
      >
        <EditIcon />
      </button>
      <button
        type="button"
        onClick={() => onDeleteClick(task)}
        disabled={deletingId === task.id}
        className="icon-btn-delete"
        aria-label={`Delete ${task.title}`}
        title="Delete task"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

function TaskCard({ task, isAdmin, onEdit, onDeleteClick, onStatusChange, deletingId, updatingStatusId }) {
  return (
    <article className="card-mobile">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-ink">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
        <StatusSelect
          value={task.status}
          onChange={(next) => onStatusChange(task.id, next)}
          disabled={updatingStatusId === task.id}
        />
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-soft">Created</span>
          <span className="text-muted" title={formatFullDateTime(task.created_at)}>
            {formatRelativeTime(task.created_at)}
          </span>
        </div>

        {isAdmin && (
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-soft">Owner</span>
            <div className="flex min-w-0 items-center gap-2">
              <UserAvatar email={task.owner_email} />
              <span className="truncate text-muted">{task.owner_email || '—'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-line pt-3">
        <TaskActions
          task={task}
          onEdit={onEdit}
          onDeleteClick={onDeleteClick}
          deletingId={deletingId}
        />
      </div>
    </article>
  );
}

export default function TaskList({
  tasks,
  isAdmin,
  onEdit,
  onDeleteClick,
  onStatusChange,
  deletingId,
  updatingStatusId,
}) {
  if (tasks.length === 0) {
    return (
      <div className="card-empty">
        Nothing here yet — add your first task when you&apos;re ready.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 lg:hidden">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDeleteClick={onDeleteClick}
            onStatusChange={onStatusChange}
            deletingId={deletingId}
            updatingStatusId={updatingStatusId}
          />
        ))}
      </div>

      <div className="table-wrap">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-line bg-cream/60">
              <tr>
                <th className="table-th">Title</th>
                <th className="table-th">Status</th>
                <th className="table-th">Created</th>
                {isAdmin && <th className="table-th">Owner</th>}
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="table-row">
                  <td className="max-w-xs px-4 py-3 sm:max-w-md">
                    <p className="font-medium text-ink">{task.title}</p>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      value={task.status}
                      onChange={(next) => onStatusChange(task.id, next)}
                      disabled={updatingStatusId === task.id}
                    />
                  </td>
                  <td
                    className="whitespace-nowrap px-4 py-3 text-sm text-muted"
                    title={formatFullDateTime(task.created_at)}
                  >
                    {formatRelativeTime(task.created_at)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar email={task.owner_email} />
                        <span className="text-sm text-muted">{task.owner_email || '—'}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <TaskActions
                      task={task}
                      onEdit={onEdit}
                      onDeleteClick={onDeleteClick}
                      deletingId={deletingId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
