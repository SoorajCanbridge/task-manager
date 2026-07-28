import { FILTER_STATUS_OPTIONS } from '../styles/theme';

export default function TaskFilters({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks by title..."
        className="input flex-1"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="input sm:min-w-[180px] sm:w-auto"
      >
        {FILTER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
