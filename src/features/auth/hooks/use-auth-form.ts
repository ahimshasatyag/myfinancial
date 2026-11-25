import { useState } from 'react';
import { authService } from '../services/auth-service';
import { LoginCredentials, RegisterCredentials } from '../types';
import { validateLogin, validateRegister } from '../schemas';

export function useAuthForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials, onSuccess?: () => void) => {
    const errors = validateLogin(credentials);
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors)[0] || 'Validasi gagal');
      return false;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await authService.login(credentials);
      onSuccess?.();
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials, onSuccess?: () => void) => {
    const errors = validateRegister(credentials);
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors)[0] || 'Validasi gagal');
      return false;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      await authService.register(credentials);
      onSuccess?.();
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, errorMessage, setErrorMessage };
}
