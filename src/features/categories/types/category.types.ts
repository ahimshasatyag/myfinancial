import { Category, TransactionType } from '../../../types/database.types';

export interface CreateCategoryInput {
  name: string;
  transactionType: TransactionType;
  parentId?: string | null;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export type CategoryRecord = Category;
