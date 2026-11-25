import { z } from 'zod';
import { CreateTransactionInput, CreateTransferInput } from '../types/transaction.types';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const paymentMethodSchema = z.enum([
  'cash',
  'debit_card',
  'credit_card',
  'bank_transfer',
  'qris',
  'e_wallet',
  'other',
]);

export const transactionStatusSchema = z.enum(['pending', 'completed', 'cancelled']);

export const createTransactionSchema = z.object({
  accountId: z.string().uuid('Pilih akun yang valid'),
  categoryId: z.string().uuid('Kategori tidak valid').nullable().optional(),
  transactionType: z.enum(['income', 'expense']),
  amount: z.number().finite().positive('Jumlah nominal harus lebih dari 0'),
  currencyCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'Kode mata uang harus 3 huruf')
    .optional(),
  title: z
    .string()
    .trim()
    .min(1, 'Judul transaksi wajib diisi')
    .max(150, 'Judul transaksi maksimal 150 karakter'),
  merchant: z.string().trim().max(150).nullable().optional(),
  paymentMethod: paymentMethodSchema.nullable().optional(),
  transactionDate: z.string().regex(isoDateRegex, 'Format tanggal harus YYYY-MM-DD'),
  transactionTime: z.string().nullable().optional(),
  referenceNumber: z.string().trim().max(120).nullable().optional(),
  description: z.string().trim().max(500).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
  status: transactionStatusSchema.optional().default('completed'),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const createTransferSchema = z
  .object({
    fromAccountId: z.string().uuid('Pilih akun asal'),
    toAccountId: z.string().uuid('Pilih akun tujuan'),
    amount: z.number().finite().positive('Nominal transfer harus lebih dari 0'),
    currencyCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{3}$/)
      .optional(),
    transferDate: z.string().regex(isoDateRegex, 'Format tanggal harus YYYY-MM-DD'),
    notes: z.string().trim().max(500).nullable().optional(),
    goalId: z.string().uuid().nullable().optional(),
    goalAction: z.enum(['contribution', 'withdrawal']).nullable().optional(),
    status: transactionStatusSchema.optional().default('completed'),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'Akun asal dan tujuan tidak boleh sama',
    path: ['toAccountId'],
  })
  .refine(
    (data) => (!data.goalId && !data.goalAction) || (!!data.goalId && !!data.goalAction),
    {
      message: 'Target tabungan dan aksi transfer harus berpasangan',
      path: ['goalAction'],
    }
  );

function zodIssuesToRecord(issues: z.ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0]?.toString() || '_form';
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export function validateTransactionInput(input: Partial<CreateTransactionInput>) {
  const result = createTransactionSchema.safeParse(input);
  if (result.success) return {};
  return zodIssuesToRecord(result.error.issues);
}

export function validateTransferInput(input: Partial<CreateTransferInput>) {
  const normalized = {
    ...input,
    goalAction: input.goalId ? input.goalAction || 'contribution' : null,
  };
  const result = createTransferSchema.safeParse(normalized);
  if (result.success) return {};
  return zodIssuesToRecord(result.error.issues);
}
