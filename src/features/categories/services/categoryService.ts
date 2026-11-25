import { TransactionType } from '../../../types/database.types';
import { categoryRepository } from '../repositories/category-repository';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';

function mapCategoryError(err: any): Error {
  if (err?.code === '23505') {
    return new Error('Nama kategori sudah ada pada tipe tersebut.');
  }
  if (err?.code === '23503') {
    return new Error(
      'Kategori sudah digunakan pada transaksi atau anggaran. Nonaktifkan kategori alih-alih menghapusnya.'
    );
  }
  return err instanceof Error ? err : new Error(err?.message || 'Gagal memproses kategori');
}

export const categoryService = {
  async getCategories(
    userId: string,
    options?: { type?: TransactionType; onlyActive?: boolean }
  ) {
    return await categoryRepository.getCategories(userId, options);
  },

  async getCategoryById(userId: string, id: string) {
    return await categoryRepository.getCategoryById(userId, id);
  },

  async createCategory(userId: string, input: CreateCategoryInput) {
    const parsed = createCategorySchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data kategori tidak valid');
    }

    if (parsed.data.parentId) {
      const parent = await categoryRepository.getCategoryById(userId, parsed.data.parentId);
      if (parent.transaction_type !== parsed.data.transactionType) {
        throw new Error('Kategori induk harus memiliki tipe yang sama (pemasukan/pengeluaran).');
      }
    }

    try {
      return await categoryRepository.createCategory(userId, parsed.data);
    } catch (err) {
      throw mapCategoryError(err);
    }
  },

  async updateCategory(userId: string, id: string, input: UpdateCategoryInput) {
    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Data perubahan kategori tidak valid');
    }

    if (parsed.data.parentId && parsed.data.parentId === id) {
      throw new Error('Kategori tidak boleh menjadi induk dirinya sendiri.');
    }

    try {
      return await categoryRepository.updateCategory(userId, id, parsed.data);
    } catch (err) {
      throw mapCategoryError(err);
    }
  },

  async toggleCategoryActive(userId: string, id: string, isActive: boolean) {
    try {
      return await categoryRepository.updateCategory(userId, id, { isActive });
    } catch (err) {
      throw mapCategoryError(err);
    }
  },

  async deleteCategory(userId: string, id: string) {
    try {
      await categoryRepository.deleteCategory(userId, id);
    } catch (err) {
      throw mapCategoryError(err);
    }
  },
};
