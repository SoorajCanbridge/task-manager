export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const STATUS_BADGE_CLASS = {
  pending: 'badge-pending',
  in_progress: 'badge-in_progress',
  completed: 'badge-completed',
};

export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const FILTER_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...TASK_STATUS_OPTIONS,
];

export const AVATAR_TONES = [
  'avatar-tone-0',
  'avatar-tone-1',
  'avatar-tone-2',
  'avatar-tone-3',
  'avatar-tone-4',
  'avatar-tone-5',
];

export function getAvatarTone(email) {
  if (!email) return AVATAR_TONES[0];

  let hash = 0;
  for (let i = 0; i < email.length; i += 1) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

export function getInitials(email) {
  if (!email) return '?';

  const local = email.split('@')[0];
  const parts = local.split(/[._-]/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return local.slice(0, 2).toUpperCase();
}
