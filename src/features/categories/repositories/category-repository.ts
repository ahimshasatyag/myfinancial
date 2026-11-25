import { supabase } from '../../../lib/supabase/client';
import { TransactionType } from '../../../types/database.types';
import {
  CategoryRecord,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../types/category.types';

export const categoryRepository = {
  async getCategories(
    userId: string,
    options?: { type?: TransactionType; onlyActive?: boolean }
  ): Promise<CategoryRecord[]> {
    let query = (supabase as any)
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('is_active', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (options?.type) {
      query = query.eq('transaction_type', options.type);
    }
    if (options?.onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as CategoryRecord[];
  },

  async getCategoryById(userId: string, id: string): Promise<CategoryRecord> {
    const { data, error } = await (supabase as any)
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as CategoryRecord;
  },

  async createCategory(userId: string, input: CreateCategoryInput): Promise<CategoryRecord> {
    const { data, error } = await (supabase as any)
      .from('categories')
      .insert({
        user_id: userId,
        parent_id: input.parentId || null,
        name: input.name.trim(),
        transaction_type: input.transactionType,
        icon: input.icon || 'tag',
        color: input.color || null,
        description: input.description?.trim() || null,
        sort_order: input.sortOrder ?? 0,
        is_active: input.isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return data as CategoryRecord;
  },

  async updateCategory(
    userId: string,
    id: string,
    input: UpdateCategoryInput
  ): Promise<CategoryRecord> {
    const payload: Record<string, any> = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.transactionType !== undefined) payload.transaction_type = input.transactionType;
    if (input.parentId !== undefined) payload.parent_id = input.parentId || null;
    if (input.icon !== undefined) payload.icon = input.icon || 'tag';
    if (input.color !== undefined) payload.color = input.color || null;
    if (input.description !== undefined) payload.description = input.description?.trim() || null;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.isActive !== undefined) payload.is_active = input.isActive;

    const { data, error } = await (supabase as any)
      .from('categories')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as CategoryRecord;
  },

  async deleteCategory(userId: string, id: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  },
};
