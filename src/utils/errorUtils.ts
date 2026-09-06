/**
 * Parses Firebase and generic runtime errors into human-readable messages.
 */
export const parseFirebaseError = (error: any): string => {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;

  const errorCode = error?.code || '';
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later.';
    default:
      return error?.message || 'An unknown error occurred. Please try again.';
  }
};
