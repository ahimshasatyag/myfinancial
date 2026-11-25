import { Transaction } from '../types/database.types';

export const exportService = {
  exportTransactionsToCSV(transactions: Transaction[]): string {
    const headers = ['Tanggal', 'Judul', 'Tipe', 'Jumlah', 'Mata Uang', 'Metode', 'Status'];
    const rows = transactions.map((t) => [
      t.transaction_date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.transaction_type,
      t.amount,
      t.currency_code,
      t.payment_method || '-',
      t.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return csvContent;
  },
};
