import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, getErrorMessage } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="heading-page mb-1">Good to see you again</h1>
        <p className="text-muted mb-6">Sign in and pick up where you left off.</p>

        {apiError && <div className="alert-error mb-4">{apiError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Your password"
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary btn-block">
            {submitting ? <LoadingSpinner size="sm" /> : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{' '}
          <Link to="/register" className="link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
