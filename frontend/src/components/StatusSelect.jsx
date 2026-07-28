import { TASK_STATUS_OPTIONS, STATUS_BADGE_CLASS } from '../styles/theme';

export default function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`status-select ${STATUS_BADGE_CLASS[value] || ''}`}
      aria-label="Change task status"
    >
      {TASK_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
