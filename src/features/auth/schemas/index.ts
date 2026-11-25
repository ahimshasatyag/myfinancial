import { isValidEmail, isStrongPassword, isNotBlank } from '../../../utils/validation';
import { LoginCredentials, RegisterCredentials } from '../types';

export function validateLogin(values: LoginCredentials) {
  const errors: Partial<Record<keyof LoginCredentials, string>> = {};
  if (!values.email) errors.email = 'Email wajib diisi';
  else if (!isValidEmail(values.email)) errors.email = 'Format email tidak valid';

  if (!values.password) errors.password = 'Kata sandi wajib diisi';
  return errors;
}

export function validateRegister(values: RegisterCredentials) {
  const errors: Partial<Record<keyof RegisterCredentials, string>> = {};
  if (!isNotBlank(values.fullName)) errors.fullName = 'Nama lengkap wajib diisi';
  if (!values.email) errors.email = 'Email wajib diisi';
  else if (!isValidEmail(values.email)) errors.email = 'Format email tidak valid';

  if (!values.password) errors.password = 'Kata sandi wajib diisi';
  else if (!isStrongPassword(values.password)) errors.password = 'Kata sandi minimal 8 karakter';

  return errors;
}
