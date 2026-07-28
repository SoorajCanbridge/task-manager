import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="nav-header">
      <div className="nav-inner">
        <h1 className="nav-brand">Taskboard</h1>

        <div className="nav-user">
          <UserAvatar email={user.email} />

          <div className="nav-user-info">
            <p className="nav-user-email">{user.email}</p>
            <p className="nav-user-role hidden sm:block">
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </p>
          </div>
          <button onClick={logout} type="button" className="nav-logout">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
