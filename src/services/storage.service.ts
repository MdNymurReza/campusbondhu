// src/services/storage.service.ts
import { supabase } from '@/lib/supabase';

class StorageService {
  // Convert file to Base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Store files directly in database (no bucket needed)
  async storePaymentFiles(
    proofImages: File[],
    receiptImage: File | null,
    userId: string,
    courseId: string
  ): Promise<{
    proofUrls: string[];
    receiptUrl: string | null;
  }> {
    try {
      console.log('📁 Storing payment files in database...');

      // 1. Convert proof images to Base64
      const proofBase64Array: string[] = [];
      for (const file of proofImages) {
        const base64 = await this.fileToBase64(file);
        
        // Optional: Compress if image is too large
        const compressedBase64 = await this.compressImageIfNeeded(base64, file.type);
        proofBase64Array.push(compressedBase64);
      }

      // 2. Convert receipt image to Base64 if exists
      let receiptBase64: string | null = null;
      if (receiptImage) {
        receiptBase64 = await this.fileToBase64(receiptImage);
        receiptBase64 = await this.compressImageIfNeeded(receiptBase64, receiptImage.type);
      }

      // 3. Store in a separate table (optional, for better organization)
      const fileMetadata = {
        user_id: userId,
        course_id: courseId,
        proof_count: proofImages.length,
        total_size: proofImages.reduce((sum, file) => sum + file.size, 0) + (receiptImage?.size || 0),
        stored_at: new Date().toISOString()
      };

      // 4. Insert into a files table or return Base64 data
      const { data, error } = await supabase
        .from('payment_files')
        .insert({
          user_id: userId,
          course_id: courseId,
          proof_images: proofBase64Array,
          receipt_image: receiptBase64,
          metadata: fileMetadata
        })
        .select('id')
        .single();

      if (error) {
        console.warn('Could not store in separate table, using Base64 directly:', error);
        // If table doesn't exist, we'll just return the Base64 strings
      }

      // Return Base64 strings directly
      return {
        proofUrls: proofBase64Array,
        receiptUrl: receiptBase64
      };

    } catch (error) {
      console.error('Error storing files:', error);
      // Return empty arrays as fallback
      return {
        proofUrls: proofImages.map(() => this.getPlaceholderUrl('proof')),
        receiptUrl: receiptImage ? this.getPlaceholderUrl('receipt') : null
      };
    }
  }

  // Optional: Compress Base64 image to reduce size
  private async compressImageIfNeeded(base64: string, mimeType: string): Promise<string> {
    // Only compress images larger than 1MB
    const base64Size = (base64.length * 3) / 4; // Approximate byte size
    
    if (base64Size < 1024 * 1024 || !mimeType.startsWith('image/')) {
      return base64;
    }

    console.log('Compressing image from', Math.round(base64Size / 1024), 'KB');
    
    try {
      return await this.compressBase64Image(base64, 0.7); // 70% quality
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      return base64;
    }
  }

  private async compressBase64Image(base64: string, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (max 1200px width)
        let width = img.width;
        let height = img.height;
        
        if (width > 1200) {
          const ratio = height / width;
          width = 1200;
          height = width * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      
      img.onerror = reject;
    });
  }

  // For compatibility with existing code
  async uploadPaymentProof(
    file: File,
    userId: string,
    courseId: string
  ): Promise<string> {
    const base64 = await this.fileToBase64(file);
    return base64; // Return Base64 directly
  }

  async uploadReceipt(file: File, userId: string): Promise<string> {
    const base64 = await this.fileToBase64(file);
    return base64; // Return Base64 directly
  }

  // Get file as Base64
  async getFileAsBase64(fileIdOrBase64: string): Promise<string> {
    // If it's already a Base64 string (starts with data:), return it
    if (fileIdOrBase64.startsWith('data:')) {
      return fileIdOrBase64;
    }
    
    // Otherwise, try to fetch from database
    try {
      const { data, error } = await supabase
        .from('payment_files')
        .select('proof_images, receipt_image')
        .eq('id', fileIdOrBase64)
        .single();

      if (error) {
        console.error('Error fetching file:', error);
        return this.getPlaceholderUrl('file');
      }

      // Return first proof image or receipt
      return data.proof_images?.[0] || data.receipt_image || this.getPlaceholderUrl('file');
    } catch (error) {
      console.error('Get file error:', error);
      return this.getPlaceholderUrl('file');
    }
  }

  // Placeholder for compatibility
  getPlaceholderUrl(filename: string): string {
    const encodedName = encodeURIComponent(filename.substring(0, 20));
    return `https://placehold.co/600x400/3b82f6/ffffff/png?text=${encodedName}`;
  }

  // Check if we can store files (always true for Base64)
  async canStoreFiles(): Promise<boolean> {
    return true; // Base64 always works
  }

  // Get storage method info
  getStorageMethod(): string {
    return 'database-base64';
  }
}

export const storageService = new StorageService();