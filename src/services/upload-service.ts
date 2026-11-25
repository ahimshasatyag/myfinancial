import { supabaseStorage } from '../lib/supabase/storage';

export const uploadService = {
  async uploadTransactionAttachment(userId: string, transactionId: string, file: { uri: string; name: string; type: string }) {
    return await supabaseStorage.uploadReceipt(userId, transactionId, file);
  },
};
