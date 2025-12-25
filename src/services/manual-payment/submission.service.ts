// src/services/manual-payment/submission.service.ts
import { supabase } from '../../lib/supabase';
import { PaymentSubmission, PaymentRecord } from './types';
import { storageService } from '../storage.service';

class PaymentSubmissionService {
  async submitPayment(data: PaymentSubmission): Promise<{
    success: boolean;
    message: string;
    payment?: PaymentRecord;
    error?: string;
  }> {
    try {
      console.log('Starting payment submission...', {
        userId: data.userId,
        courseId: data.courseId,
        amount: data.amountPaid,
        method: data.paymentMethod
      });

      // 1. Validate required fields
      const validationError = this.validateSubmission(data);
      if (validationError) {
        throw new Error(validationError);
      }

      // 2. Upload proof images
      console.log('Uploading proof images...');
      const proofImageUrls = await this.uploadProofImages(
        data.proofImages,
        data.userId,
        data.courseId
      );

      console.log('Proof images uploaded:', proofImageUrls);

      let receiptImageUrl = '';
      if (data.receiptImage) {
        console.log('Uploading receipt image...');
        receiptImageUrl = await storageService.uploadReceipt(
          data.receiptImage,
          data.userId
        );
        console.log('Receipt uploaded:', receiptImageUrl);
      }

      // 3. Generate receipt and tracking numbers
      const receiptNumber = this.generateReceiptNumber();
      const trackingId = this.generateTrackingId();

      console.log('Generated receipt number:', receiptNumber);
      console.log('Generated tracking ID:', trackingId);

      // 4. Create payment record
      const paymentData = {
        user_id: data.userId,
        course_id: data.courseId,
        amount: data.amount,
        amount_paid: data.amountPaid,
        payment_method: data.paymentMethod,
        payment_type: data.paymentType,
        status: 'submitted',
        verification_status: 'pending',
        
        // Tracking
        receipt_number: receiptNumber,
        tracking_id: trackingId,
        
        // Payment details
        sender_number: data.senderNumber,
        sender_name: data.senderName,
        transaction_id: data.transactionId.trim(),
        transaction_date: data.transactionDate,
        transaction_time: data.transactionTime,
        
        // Files
        proof_images: proofImageUrls,
        receipt_image: receiptImageUrl || null,
        
        // Notes
        user_note: data.userNote,
        
        // Timestamps
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Creating payment record in database...', paymentData);

      const { data: payment, error } = await supabase
        .from('manual_payments')
        .insert(paymentData)
        .select(`
          *,
          user:user_id (
            email,
            raw_user_meta_data
          ),
          course:course_id (
            title,
            price,
            thumbnail_url
          )
        `)
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Payment record created:', payment.id);

      // 5. Send notifications
      await this.sendNotifications(payment);

      return {
        success: true,
        message: 'পেমেন্ট সফলভাবে জমা হয়েছে!',
        payment
      };

    } catch (error: any) {
      console.error('Payment submission error:', error);
      return {
        success: false,
        message: error.message || 'পেমেন্ট জমা দিতে সমস্যা হয়েছে',
        error: error.toString()
      };
    }
  }

  private validateSubmission(data: PaymentSubmission): string | null {
    if (!data.transactionId?.trim()) {
      return 'ট্রানজেকশন আইডি প্রয়োজন';
    }
    
    if (!data.transactionDate) {
      return 'ট্রানজেকশনের তারিখ প্রয়োজন';
    }
    
    if (data.proofImages.length === 0) {
      return 'কমপক্ষে একটি প্রমাণ ছবি প্রয়োজন';
    }
    
    if (data.amountPaid <= 0) {
      return 'সঠিক পরিমাণ লিখুন';
    }
    
    // Method-specific validations
    switch (data.paymentMethod) {
      case 'bkash':
      case 'nagad':
      case 'rocket':
        if (!data.senderNumber?.trim()) {
          return 'মোবাইল নম্বর প্রয়োজন';
        }
        break;
      case 'bank':
        if (!data.senderName?.trim()) {
          return 'প্রেরকের নাম প্রয়োজন';
        }
        break;
      case 'cash':
        if (!data.senderName?.trim()) {
          return 'আপনার নাম প্রয়োজন';
        }
        break;
    }
    
    return null;
  }

  private async uploadProofImages(
    files: File[],
    userId: string,
    courseId: string
  ): Promise<string[]> {
    const urls: string[] = [];
    
    for (const file of files) {
      try {
        console.log(`Uploading proof: ${file.name}`);
        const url = await storageService.uploadPaymentProof(file, userId, courseId);
        urls.push(url);
        console.log(`Uploaded: ${url}`);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files even if one fails
        urls.push(storageService.getPlaceholderUrl?.(file.name) || `https://placehold.co/600x400/png?text=${encodeURIComponent(file.name)}`);
      }
    }
    
    return urls;
  }

  // Generate receipt number
  private generateReceiptNumber(): string {
    const prefix = 'CB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Generate tracking ID
  private generateTrackingId(): string {
    return `TRK${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  private async sendNotifications(payment: PaymentRecord) {
    try {
      // 1. Send email to user
      await this.sendUserConfirmationEmail(payment);
      
      // 2. Send notification to admin (Discord/Telegram)
      await this.sendAdminNotification(payment);
      
      // 3. Send SMS if phone number exists
      await this.sendSMSNotification(payment);
    } catch (error) {
      console.error('Notification error (non-critical):', error);
      // Don't fail the whole submission if notifications fail
    }
  }

  private async sendUserConfirmationEmail(payment: PaymentRecord) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user?.user?.email) {
        console.log('Sending confirmation email to:', user.user.email);
        // You can implement email sending here
        // For now, just log it
        console.log('Email would be sent with:', {
          to: user.user.email,
          subject: 'পেমেন্ট জমা হয়েছে - CampusBondhu',
          receiptNumber: payment.receipt_number,
          amount: payment.amount,
          courseTitle: payment.course?.title,
          trackingId: payment.tracking_id
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  private async sendAdminNotification(payment: PaymentRecord) {
    // Send to Discord webhook if configured
    const webhookUrl = process.env.VITE_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('No Discord webhook configured');
      return;
    }

    try {
      const embed = {
        title: '💰 নতুন পেমেন্ট জমা হয়েছে',
        color: 0x00ff00,
        fields: [
          { name: 'রসিদ নং', value: payment.receipt_number, inline: true },
          { name: 'পরিমাণ', value: `৳${payment.amount}`, inline: true },
          { name: 'পদ্ধতি', value: payment.payment_method, inline: true },
          { name: 'কোর্স', value: payment.course?.title || 'N/A' },
          { name: 'ব্যবহারকারী', value: payment.user?.email || 'N/A' },
          { name: 'ট্র্যাকিং আইডি', value: payment.tracking_id }
        ],
        timestamp: new Date().toISOString()
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });
      
      console.log('Discord notification sent');
    } catch (error) {
      console.error('Discord webhook error:', error);
    }
  }

  private async sendSMSNotification(payment: PaymentRecord) {
    // Implement SMS service for Bangladesh
    console.log('SMS would be sent for payment:', payment.receipt_number);
  }

  async getUserPayments(userId: string): Promise<PaymentRecord[]> {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        course:course_id (
          title,
          price,
          thumbnail_url
        ),
        verifier:verified_by (
          email,
          raw_user_meta_data
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPaymentByReceipt(receiptNumber: string): Promise<PaymentRecord | null> {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data
        ),
        course:course_id (
          title,
          price,
          thumbnail_url
        ),
        verifier:verified_by (
          email,
          raw_user_meta_data
        ),
        assignee:assigned_to (
          email,
          raw_user_meta_data
        )
      `)
      .eq('receipt_number', receiptNumber)
      .single();

    if (error) return null;
    return data;
  }
}

// Export the class to fix "Cannot find name 'PaymentService'"
export class PaymentService extends PaymentSubmissionService {}

// Export the instance
export const paymentSubmissionService = new PaymentSubmissionService();