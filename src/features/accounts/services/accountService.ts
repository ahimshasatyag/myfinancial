import { accountRepository } from '../repositories/account-repository';
import { createAccountSchema, updateAccountSchema } from '../schemas/account.schema';
import { CreateAccountInput, UpdateAccountInput } from '../types/account.types';

function mapAccountError(err: any): Error {
  if (err?.code === '23505') {
    return new Error('Nama akun sudah digunakan. Pilih nama lain.');
  }
  if (err?.code === '23503') {
    return new Error('Akun sudah memiliki transaksi. Nonaktifkan akun alih-alih menghapusnya.');
  }
  return err instanceof Error ? err : new Error(err?.message || 'Gagal memproses akun');
}

export const accountService = {
  async getAccounts(userId: string, options?: { onlyActive?: boolean }) {
    return await accountRepository.getAccountBalances(userId, options);
  },

  async getAccountById(userId: string, id: string) {
    return await accountRepository.getAccountById(userId, id);
  },

  async createAccount(userId: string, input: CreateAccountInput) {
    const parsed = createAccountSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data akun tidak valid');
    }
    try {
      return await accountRepository.createAccount(userId, {
        ...parsed.data,
        accountNumberLast4: parsed.data.accountNumberLast4 || null,
      });
    } catch (err) {
      throw mapAccountError(err);
    }
  },

  async updateAccount(userId: string, id: string, input: UpdateAccountInput) {
    const parsed = updateAccountSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data perubahan akun tidak valid');
    }
    try {
      return await accountRepository.updateAccount(userId, id, {
        ...parsed.data,
        accountNumberLast4:
          parsed.data.accountNumberLast4 === '' ? null : parsed.data.accountNumberLast4,
      });
    } catch (err) {
      throw mapAccountError(err);
    }
  },

  async toggleAccountActive(userId: string, id: string, isActive: boolean) {
    try {
      return await accountRepository.updateAccount(userId, id, { isActive });
    } catch (err) {
      throw mapAccountError(err);
    }
  },

  async deleteAccount(userId: string, id: string) {
    try {
      await accountRepository.deleteAccount(userId, id);
    } catch (err) {
      throw mapAccountError(err);
    }
  },
};
