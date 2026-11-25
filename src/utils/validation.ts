export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

export function isNotBlank(str?: string | null): boolean {
  return !!str && str.trim().length > 0;
}
