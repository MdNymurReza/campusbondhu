// src/services/manual-payment/submission.service.ts
import { supabase } from '../../lib/supabase';
import { PaymentSubmission, PaymentRecord, PaymentMethod, PaymentStatus, VerificationStatus } from './types';

class PaymentSubmissionService {
  async submitPayment(data: PaymentSubmission): Promise<{
    success: boolean;
    message: string;
    payment?: PaymentRecord;
    error?: string;
  }> {
    try {
      console.log('🚀 Starting payment submission (NO BUCKET - Base64 only)...', {
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

      // 2. Convert proof images to Base64 DIRECTLY (NO BUCKET)
      console.log('🖼️ Converting proof images to Base64...');
      const proofImageBase64 = await Promise.all(
        data.proofImages.map(file => this.fileToBase64(file))
      );
      console.log('✅ Proof images converted to Base64:', proofImageBase64.length);

      // 3. Convert receipt image to Base64 if exists (NO BUCKET)
      let receiptImageBase64: string | null = null;
      if (data.receiptImage) {
        console.log('🧾 Converting receipt image to Base64...');
        receiptImageBase64 = await this.fileToBase64(data.receiptImage);
        console.log('✅ Receipt converted to Base64');
      }

      // 4. Generate receipt and tracking numbers
      const receiptNumber = this.generateReceiptNumber();
      const trackingId = this.generateTrackingId();
      console.log('📄 Generated receipt number:', receiptNumber);
      console.log('🔖 Generated tracking ID:', trackingId);

      // 5. Prepare payment data WITH BASE64
      const paymentData = {
        user_id: data.userId,
        course_id: data.courseId,
        amount: data.amount,
        amount_paid: data.amountPaid,
        payment_method: data.paymentMethod,
        payment_type: data.paymentType,
        status: 'submitted' as PaymentStatus,
        verification_status: 'pending' as VerificationStatus,
        
        // Tracking
        receipt_number: receiptNumber,
        tracking_id: trackingId,
        
        // Payment details
        sender_number: data.senderNumber,
        sender_name: data.senderName,
        transaction_id: data.transactionId.trim(),
        transaction_date: data.transactionDate,
        transaction_time: data.transactionTime || '',
        
        // ✅ FILES AS BASE64 - STORED DIRECTLY IN DATABASE (NO BUCKET)
        proof_images: proofImageBase64,
        receipt_image: receiptImageBase64,
        
        // Notes
        user_note: data.userNote,
        
        // Timestamps
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('💾 Creating payment record in database (with Base64 data)...');

      // 6. Insert into database - SIMPLE INSERT
      const { data: insertedPayment, error: insertError } = await supabase
        .from('manual_payments')
        .insert(paymentData)
        .select('id')
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw insertError;
      }

      console.log('✅ Payment record created with ID:', insertedPayment.id);

      // 7. Fetch complete payment data
      const completePayment = await this.getPaymentById(insertedPayment.id);
      
      if (!completePayment) {
        throw new Error('Failed to fetch complete payment data after insertion');
      }

      // 8. Send notifications
      await this.sendNotifications(completePayment);

      return {
        success: true,
        message: 'পেমেন্ট সফলভাবে জমা হয়েছে!',
        payment: completePayment
      };

    } catch (error: any) {
      console.error('❌ Payment submission error:', error);
      return {
        success: false,
        message: error.message || 'পেমেন্ট জমা দিতে সমস্যা হয়েছে',
        error: error.toString()
      };
    }
  }

  // Helper: Convert file to Base64 (NO BUCKET NEEDED)
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Log size for debugging
        const sizeKB = Math.round((base64.length * 3) / 4 / 1024);
        console.log(`📊 Converted ${file.name} to Base64 (${sizeKB} KB)`);
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Fetch payment by ID with relations
  private async getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
    try {
      // Fetch payment data
      const { data: payment, error: paymentError } = await supabase
        .from('manual_payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (paymentError || !payment) {
        console.error('❌ Error fetching payment:', paymentError);
        return null;
      }

      // Fetch user data
      const { data: userData } = await supabase
        .from('profiles')
        .select('email, full_name, phone')
        .eq('id', payment.user_id)
        .single();

      // Fetch course data
      const { data: courseData } = await supabase
        .from('courses')
        .select('title, price, thumbnail_url')
        .eq('id', payment.course_id)
        .single();

      // Fetch verifier if exists
      let verifierData = null;
      if (payment.verified_by) {
        const { data: verifier } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', payment.verified_by)
          .single();
        verifierData = verifier;
      }

      // Fetch assignee if exists
      let assigneeData = null;
      if (payment.assigned_to) {
        const { data: assignee } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', payment.assigned_to)
          .single();
        assigneeData = assignee;
      }

      // Transform to PaymentRecord
      return {
        id: payment.id,
        receipt_number: payment.receipt_number,
        tracking_id: payment.tracking_id,
        status: payment.status as PaymentStatus,
        verification_status: payment.verification_status as VerificationStatus,
        amount: payment.amount,
        amount_paid: payment.amount_paid,
        payment_method: payment.payment_method as PaymentMethod,
        payment_type: payment.payment_type,
        user_id: payment.user_id,
        course_id: payment.course_id,
        sender_number: payment.sender_number,
        sender_name: payment.sender_name,
        transaction_id: payment.transaction_id,
        transaction_date: payment.transaction_date,
        transaction_time: payment.transaction_time,
        proof_images: payment.proof_images || [],
        receipt_image: payment.receipt_image,
        user_note: payment.user_note,
        verified_by: payment.verified_by,
        verified_at: payment.verified_at,
        verification_note: payment.verification_note,
        rejection_reason: payment.rejection_reason,
        assigned_to: payment.assigned_to,
        assigned_at: payment.assigned_at,
        user: {
          email: userData?.email || '',
          full_name: userData?.full_name,
          phone: userData?.phone
        },
        course: {
          title: courseData?.title || '',
          price: courseData?.price || 0,
          thumbnail_url: courseData?.thumbnail_url
        },
        verifier: verifierData ? {
          email: verifierData.email,
          full_name: verifierData.full_name
        } : undefined,
        assignee: assigneeData ? {
          email: assigneeData.email,
          full_name: assigneeData.full_name
        } : undefined,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
        submitted_at: payment.submitted_at
      };
    } catch (error) {
      console.error('❌ Error in getPaymentById:', error);
      return null;
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
      console.error('🔔 Notification error (non-critical):', error);
      // Don't fail the whole submission if notifications fail
    }
  }

  private async sendUserConfirmationEmail(payment: PaymentRecord) {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user?.user?.email) {
        console.log('📧 Sending confirmation email to:', user.user.email);
        console.log('📝 Email would be sent with:', {
          to: user.user.email,
          subject: 'পেমেন্ট জমা হয়েছে - CampusBondhu',
          receiptNumber: payment.receipt_number,
          amount: payment.amount,
          courseTitle: payment.course?.title || 'Course',
          trackingId: payment.tracking_id
        });
      }
    } catch (error) {
      console.error('📧 Email sending error:', error);
    }
  }

  private async sendAdminNotification(payment: PaymentRecord) {
    // Send to Discord webhook if configured
    const webhookUrl = process.env.VITE_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('🔕 No Discord webhook configured');
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
      
      console.log('✅ Discord notification sent');
    } catch (error) {
      console.error('❌ Discord webhook error:', error);
    }
  }

  private async sendSMSNotification(payment: PaymentRecord) {
    // Implement SMS service for Bangladesh
    console.log('📱 SMS would be sent for payment:', payment.receipt_number);
  }

  async getUserPayments(userId: string): Promise<PaymentRecord[]> {
    try {
      const { data: payments, error } = await supabase
        .from('manual_payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user payments:', error);
        throw error;
      }

      if (!payments) return [];

      // Fetch additional data for each payment
      const completePayments: PaymentRecord[] = [];
      
      for (const payment of payments) {
        // Fetch user data
        const { data: userData } = await supabase
          .from('profiles')
          .select('email, full_name, phone')
          .eq('id', payment.user_id)
          .single();

        // Fetch course data
        const { data: courseData } = await supabase
          .from('courses')
          .select('title, price, thumbnail_url')
          .eq('id', payment.course_id)
          .single();

        // Fetch verifier if exists
        let verifierData = null;
        if (payment.verified_by) {
          const { data: verifier } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', payment.verified_by)
            .single();
          verifierData = verifier;
        }

        const completePayment: PaymentRecord = {
          id: payment.id,
          receipt_number: payment.receipt_number,
          tracking_id: payment.tracking_id,
          status: payment.status as PaymentStatus,
          verification_status: payment.verification_status as VerificationStatus,
          amount: payment.amount,
          amount_paid: payment.amount_paid,
          payment_method: payment.payment_method as PaymentMethod,
          payment_type: payment.payment_type,
          user_id: payment.user_id,
          course_id: payment.course_id,
          sender_number: payment.sender_number,
          sender_name: payment.sender_name,
          transaction_id: payment.transaction_id,
          transaction_date: payment.transaction_date,
          transaction_time: payment.transaction_time,
          proof_images: payment.proof_images || [],
          receipt_image: payment.receipt_image,
          user_note: payment.user_note,
          verified_by: payment.verified_by,
          verified_at: payment.verified_at,
          verification_note: payment.verification_note,
          rejection_reason: payment.rejection_reason,
          assigned_to: payment.assigned_to,
          assigned_at: payment.assigned_at,
          user: {
            email: userData?.email || '',
            full_name: userData?.full_name,
            phone: userData?.phone
          },
          course: {
            title: courseData?.title || '',
            price: courseData?.price || 0,
            thumbnail_url: courseData?.thumbnail_url
          },
          verifier: verifierData ? {
            email: verifierData.email,
            full_name: verifierData.full_name
          } : undefined,
          created_at: payment.created_at,
          updated_at: payment.updated_at,
          submitted_at: payment.submitted_at
        };

        completePayments.push(completePayment);
      }

      return completePayments;
    } catch (error) {
      console.error('❌ Error in getUserPayments:', error);
      return [];
    }
  }

  async getPaymentByReceipt(receiptNumber: string): Promise<PaymentRecord | null> {
    try {
      const { data: payment, error } = await supabase
        .from('manual_payments')
        .select('*')
        .eq('receipt_number', receiptNumber)
        .single();

      if (error || !payment) {
        console.error('❌ Error fetching payment by receipt:', error);
        return null;
      }

      return this.getPaymentById(payment.id);
    } catch (error) {
      console.error('❌ Error in getPaymentByReceipt:', error);
      return null;
    }
  }
}

// Export the class
export class PaymentService extends PaymentSubmissionService {}

// Export the instance
export const paymentSubmissionService = new PaymentSubmissionService();