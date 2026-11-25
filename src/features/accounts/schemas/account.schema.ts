import { z } from 'zod';

export const accountTypeSchema = z.enum([
  'cash',
  'bank',
  'e_wallet',
  'credit_card',
  'investment',
  'other',
]);

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama akun wajib diisi')
    .max(100, 'Nama akun maksimal 100 karakter'),
  accountType: accountTypeSchema,
  institutionName: z
    .string()
    .trim()
    .max(120, 'Nama institusi maksimal 120 karakter')
    .nullable()
    .optional(),
  accountNumberLast4: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, 'Masukkan tepat 4 digit angka terakhir')
    .or(z.literal(''))
    .nullable()
    .optional(),
  currencyCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'Kode mata uang harus 3 huruf (contoh: IDR)')
    .default('IDR'),
  openingBalance: z.number().finite('Saldo awal tidak valid'),
  includeInTotal: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
  icon: z.string().max(60).nullable().optional(),
  color: z.string().max(20).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

export type AccountSchemaValues = z.infer<typeof createAccountSchema>;

export function extractZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() || '_form';
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
