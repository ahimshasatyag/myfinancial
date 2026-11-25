export function formatDate(
  dateStringOrDate: string | Date,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  const date = typeof dateStringOrDate === 'string' ? new Date(dateStringOrDate) : dateStringOrDate;

  if (isNaN(date.getTime())) {
    return '';
  }

  if (format === 'short') {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }

  if (format === 'medium') {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (format === 'long') {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Relative
  const now = new Date();
  const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays === -1) return 'Besok';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getMonthStartAndEnd(date: Date = new Date()): { startDate: string; endDate: string } {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  return {
    startDate: first.toISOString().split('T')[0],
    endDate: last.toISOString().split('T')[0],
  };
}
