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

export function getTodayDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getMonthStartAndEnd(date: Date = new Date()): { startDate: string; endDate: string } {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);

  const formatLocal = (d: Date) => {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  return {
    startDate: formatLocal(first),
    endDate: formatLocal(last),
  };
}

export function getCurrentWeekDates(referenceDate: Date = new Date()): {
  label: string;
  subLabel: string;
  dayNumber: number;
  dateString: string;
  fullDateLabel: string;
}[] {
  const date = new Date(referenceDate);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  return labels.map((label, index) => {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + index);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    const dayNumber = cur.getDate();
    const dateString = `${y}-${m}-${d}`;
    const fullDateLabel = cur.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return {
      label,
      subLabel: String(dayNumber),
      dayNumber,
      dateString,
      fullDateLabel,
    };
  });
}
