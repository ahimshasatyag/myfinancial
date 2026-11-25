import { accountRepository } from '../../accounts/repositories/account-repository';
import { categoryRepository } from '../../categories/repositories/category-repository';
import { transactionRepository } from '../repositories/transaction-repository';
import {
  createTransactionSchema,
  createTransferSchema,
  updateTransactionSchema,
} from '../schemas/transaction.schema';
import {
  CreateTransactionInput,
  CreateTransferInput,
  UpdateTransactionInput,
} from '../types/transaction.types';
import { TransactionFilterOptions } from '../../../types/common.types';

export const transactionService = {
  async getTransactions(userId: string, filters?: TransactionFilterOptions) {
    return await transactionRepository.getTransactions(userId, filters);
  },

  async getTransactionById(userId: string, id: string) {
    return await transactionRepository.getTransactionById(userId, id);
  },

  async createTransaction(userId: string, input: CreateTransactionInput) {
    const parsed = createTransactionSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data transaksi tidak valid');
    }

    // PRD §10.5 & §13.1: verifikasi akun milik user, aktif, dan samakan mata uang transaksi dengan akun
    const account = await accountRepository.getAccountById(userId, parsed.data.accountId);
    if (!account.is_active) {
      throw new Error('Akun yang dipilih sudah nonaktif. Pilih akun aktif lain.');
    }

    // PRD §10.5: jika kategori dipilih, tipe kategori wajib sesuai tipe transaksi
    if (parsed.data.categoryId) {
      const category = await categoryRepository.getCategoryById(userId, parsed.data.categoryId);
      if (category.transaction_type !== parsed.data.transactionType) {
        throw new Error('Kategori tidak sesuai dengan jenis transaksi (pemasukan/pengeluaran).');
      }
    }

    return await transactionRepository.createTransaction(userId, {
      ...parsed.data,
      currencyCode: account.currency_code,
    });
  },

  async updateTransaction(userId: string, id: string, input: UpdateTransactionInput) {
    const parsed = updateTransactionSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data perubahan transaksi tidak valid');
    }

    let currencyCode = parsed.data.currencyCode;
    if (parsed.data.accountId) {
      const account = await accountRepository.getAccountById(userId, parsed.data.accountId);
      currencyCode = account.currency_code;
    }

    if (parsed.data.categoryId && parsed.data.transactionType) {
      const category = await categoryRepository.getCategoryById(userId, parsed.data.categoryId);
      if (category.transaction_type !== parsed.data.transactionType) {
        throw new Error('Kategori tidak sesuai dengan jenis transaksi.');
      }
    }

    return await transactionRepository.updateTransaction(userId, id, {
      ...parsed.data,
      currencyCode,
    });
  },

  async createTransfer(userId: string, input: CreateTransferInput) {
    const normalized = {
      ...input,
      goalAction: input.goalId ? input.goalAction || 'contribution' : null,
    };
    const parsed = createTransferSchema.safeParse(normalized);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data transfer tidak valid');
    }

    // PRD §10.6 & §13.4: kedua akun milik user, berbeda, aktif, dan mata uang sama
    const [fromAcc, toAcc] = await Promise.all([
      accountRepository.getAccountById(userId, parsed.data.fromAccountId),
      accountRepository.getAccountById(userId, parsed.data.toAccountId),
    ]);

    if (!fromAcc.is_active || !toAcc.is_active) {
      throw new Error('Akun asal dan akun tujuan harus berstatus aktif.');
    }

    if (fromAcc.currency_code !== toAcc.currency_code) {
      throw new Error(
        `Transfer lintas mata uang (${fromAcc.currency_code} → ${toAcc.currency_code}) belum didukung.`
      );
    }

    return await transactionRepository.createTransfer(userId, {
      ...parsed.data,
      currencyCode: fromAcc.currency_code,
    });
  },

  async deleteTransaction(userId: string, id: string) {
    return await transactionRepository.deleteTransaction(userId, id);
  },
};
