// src/services/storage.service.ts
import { supabase } from '@/lib/supabase';

class StorageService {
  private BUCKET_NAME = 'payment-proofs';

  // Method 1: General upload method
  async uploadFile(file: File, folderPath: string = ''): Promise<string> {
    try {
      console.log('Uploading file to storage...', {
        name: file.name,
        size: file.size,
        type: file.type,
        folderPath
      });

      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);

      const bucketExists = buckets?.some(bucket => bucket.name === this.BUCKET_NAME);

      if (!bucketExists) {
        console.warn(`Bucket '${this.BUCKET_NAME}' not found!`);
        console.log('Please create the bucket in Supabase:');
        console.log('1. Go to Storage section');
        console.log('2. Click "Create bucket"');
        console.log('3. Name it "payment-proofs"');

        // For development, return a placeholder
        return this.getPlaceholderUrl(file.name);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

      console.log('Uploading to path:', fullPath);

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        // Return placeholder for development
        return this.getPlaceholderUrl(file.name);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fullPath);

      console.log('File uploaded successfully:', publicUrl);
      return publicUrl;

    } catch (error) {
      console.error('Storage service error:', error);
      // Return placeholder for development
      return this.getPlaceholderUrl(file.name);
    }
  }

  // Method 2: Upload payment proof (specific for payment proofs)
  async uploadPaymentProof(
    file: File,
    userId: string,
    courseId: string
  ): Promise<string> {
    const folderPath = `${userId}/proofs/${courseId}`;
    return this.uploadFile(file, folderPath);
  }

  // Method 3: Upload receipt (specific for receipts)
  async uploadReceipt(file: File, userId: string): Promise<string> {
    const folderPath = `${userId}/receipts`;
    return this.uploadFile(file, folderPath);
  }

  // Helper method to get placeholder URL
  // Add this to your storage.service.ts class
  getPlaceholderUrl(filename: string): string {
    const encodedName = encodeURIComponent(filename);
    return `https://placehold.co/600x400/3b82f6/ffffff/png?text=${encodedName}`;
  }

  // Get file URL
  async getFileUrl(filePath: string): Promise<string> {
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  // Delete file
  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  }
}

export const storageService = new StorageService();