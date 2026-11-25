import { supabase } from './client';

const BUCKET_NAME = 'transaction-receipts';

export const supabaseStorage = {
  async uploadReceipt(userId: string, transactionId: string, file: { uri: string; name: string; type: string }) {
    const filePath = `${userId}/${transactionId}/${Date.now()}_${file.name}`;
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, blob, {
      contentType: file.type,
      upsert: false,
    });

    if (error) throw error;
    return { path: data.path };
  },

  getReceiptPublicUrl(path: string) {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  },
};
