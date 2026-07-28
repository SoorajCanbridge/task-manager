export function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export function validateTaskTitle(title) {
  if (!title.trim()) return 'Title is required';
  if (title.trim().length < 3) return 'Title must be at least 3 characters';
  return '';
}

export function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  return 'Something went wrong. Please try again.';
}
