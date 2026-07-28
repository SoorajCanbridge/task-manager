import { getAvatarTone, getInitials } from '../styles/theme';

export default function UserAvatar({ email, size = 'sm' }) {
  const initials = getInitials(email);
  const tone = getAvatarTone(email);
  const sizeClass = size === 'sm' ? 'avatar-sm' : 'avatar-md';

  return (
    <div className={`${sizeClass} ${tone}`} title={email || 'Unknown user'}>
      {initials}
    </div>
  );
}
