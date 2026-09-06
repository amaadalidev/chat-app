import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authRepository, IAuthRepository } from '../repositories/AuthRepository';
import { useAuthStore } from '../store/useAuthStore';
import { parseFirebaseError } from '../utils/errorUtils';
import {
  loginSchema,
  LoginFormData,
  registerSchema,
  RegisterFormData,
} from '../utils/validationSchemas';

export const useAuthViewModel = (authRepo: IAuthRepository = authRepository) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  // Login Form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register Form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = loginForm.handleSubmit(async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authRepo.signIn(data.email, data.password);
      setUser(user);
    } catch (err: any) {
      const parsedError = parseFirebaseError(err);
      setError(parsedError);
    } finally {
      setIsLoading(false);
    }
  });

  const handleRegister = registerForm.handleSubmit(async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authRepo.signUp(
        data.email,
        data.password,
        data.displayName
      );
      setUser(user);
    } catch (err: any) {
      const parsedError = parseFirebaseError(err);
      setError(parsedError);
    } finally {
      setIsLoading(false);
    }
  });

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authRepo.signOut();
      clearSession();
    } catch (err: any) {
      setError(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loginForm,
    registerForm,
    handleLogin,
    handleRegister,
    handleLogout,
    isLoading,
    error,
    clearError,
  };
};
