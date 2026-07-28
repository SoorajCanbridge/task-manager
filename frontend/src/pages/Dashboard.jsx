import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/api';
import { getErrorMessage } from '../utils/validation';
import Navbar from '../components/Navbar';
import TaskFilters from '../components/TaskFilters';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const DEFAULT_PAGINATION = { page: 1, limit: 10, total: 0, totalPages: 0 };

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;

      const { data } = await fetchTasks(params);
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, search ? 300 : 0);

    return () => clearTimeout(timer);
  }, [loadTasks, search]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value) {
    setStatus(value);
    setPage(1);
  }

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSave(formData) {
    setSaving(true);
    setError('');

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setFormOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(taskId, nextStatus) {
    setUpdatingStatusId(taskId);
    setError('');

    try {
      await updateTask(taskId, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      setError(getErrorMessage(err));
      await loadTasks();
    } finally {
      setUpdatingStatusId(null);
    }
  }

  function openDeleteConfirm(task) {
    setTaskToDelete(task);
  }

  function closeDeleteConfirm() {
    if (!deletingId) setTaskToDelete(null);
  }

  async function confirmDelete() {
    if (!taskToDelete) return;

    setDeletingId(taskToDelete.id);
    setError('');

    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      await loadTasks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-container">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="heading-page">Your tasks</h2>
            <p className="text-muted">
              {user.role === 'admin'
                ? 'You can see and manage everyone\'s tasks.'
                : 'These are the tasks assigned to you.'}
            </p>
          </div>
          <button type="button" onClick={openCreateForm} className="btn-primary btn-block">
            + Add task
          </button>
        </div>

        <div className="mb-6">
          <TaskFilters
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />
        </div>

        {error && <div className="alert-error mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              isAdmin={user.role === 'admin'}
              onEdit={openEditForm}
              onDeleteClick={openDeleteConfirm}
              onStatusChange={handleStatusChange}
              deletingId={deletingId}
              updatingStatusId={updatingStatusId}
            />
            <div className="mt-6">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </main>

      <DeleteConfirmModal
        open={!!taskToDelete}
        task={taskToDelete}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        deleting={!!deletingId}
      />

      <TaskForm
        open={formOpen}
        task={editingTask}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
