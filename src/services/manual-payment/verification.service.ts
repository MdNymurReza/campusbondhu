// src/services/manual-payment/verification.service.ts
import { supabase } from '../../lib/supabase';
import { VerificationAction, PaymentRecord } from './types';

class PaymentVerificationService {
  async getVerificationQueue(limit = 50): Promise<PaymentRecord[]> {
    const { data, error } = await supabase
      .from('payment_verification_queue')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentRecord | null> {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data->full_name as full_name,
          raw_user_meta_data->phone as phone
        ),
        course:course_id (
          title,
          price,
          thumbnail_url
        ),
        verifier:verified_by (
          email,
          raw_user_meta_data->full_name as full_name
        ),
        assignee:assigned_to (
          email,
          raw_user_meta_data->full_name as full_name
        )
      `)
      .eq('id', paymentId)
      .single();

    if (error) {
      console.error('Error fetching payment details:', error);
      return null;
    }
    
    // FIXED: Properly transform the data to match PaymentRecord type
    if (data) {
      return this.transformPaymentData(data);
    }
    
    return null;
  }

  // ADDED: Helper method to transform Supabase response to PaymentRecord
  private transformPaymentData(data: any): PaymentRecord {
    return {
      id: data.id,
      receipt_number: data.receipt_number,
      tracking_id: data.tracking_id,
      status: data.status,
      verification_status: data.verification_status,
      amount: data.amount,
      amount_paid: data.amount_paid,
      payment_method: data.payment_method,
      payment_type: data.payment_type,
      user_id: data.user_id,
      course_id: data.course_id,
      sender_number: data.sender_number,
      sender_name: data.sender_name,
      transaction_id: data.transaction_id,
      transaction_date: data.transaction_date,
      transaction_time: data.transaction_time,
      proof_images: data.proof_images || [],
      receipt_image: data.receipt_image,
      user_note: data.user_note,
      verified_by: data.verified_by,
      verified_at: data.verified_at,
      verification_note: data.verification_note,
      rejection_reason: data.rejection_reason,
      assigned_to: data.assigned_to,
      assigned_at: data.assigned_at,
      user: {
        email: data.user?.email || '',
        full_name: data.user?.full_name,
        phone: data.user?.phone
      },
      course: {
        title: data.course?.title || '',
        price: data.course?.price || 0,
        thumbnail_url: data.course?.thumbnail_url
      },
      verifier: data.verifier ? {
        email: data.verifier.email,
        full_name: data.verifier.full_name
      } : undefined,
      assignee: data.assignee ? {
        email: data.assignee.email,
        full_name: data.assignee.full_name
      } : undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
      submitted_at: data.submitted_at
    };
  }

  async performVerification(action: VerificationAction): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      switch (action.action) {
        case 'assign':
          if (!action.assignedTo) throw new Error('Assign to user required');
          
          updateData.assigned_to = action.assignedTo;
          updateData.assigned_at = new Date().toISOString();
          updateData.verification_status = 'in_progress';
          break;

        case 'unassign':
          updateData.assigned_to = null;
          updateData.assigned_at = null;
          updateData.verification_status = 'pending';
          break;

        case 'verify':
          updateData.status = 'verified';
          updateData.verification_status = 'completed';
          updateData.verified_by = action.adminId;
          updateData.verified_at = new Date().toISOString();
          updateData.verification_note = action.note;
          
          // Enroll user in course
          await this.enrollUserAfterVerification(action.paymentId);
          break;

        case 'reject':
          if (!action.rejectionReason) {
            throw new Error('Rejection reason required');
          }
          
          updateData.status = 'rejected';
          updateData.verification_status = 'completed';
          updateData.rejection_reason = action.rejectionReason;
          updateData.verification_note = action.note;
          break;

        case 'request_info':
          updateData.status = 'under_review';
          updateData.verification_note = action.note;
          break;
      }

      const { error } = await supabase
        .from('manual_payments')
        .update(updateData)
        .eq('id', action.paymentId);

      if (error) throw error;

      // Send notification to user
      await this.notifyUser(action.paymentId, action.action);

      return {
        success: true,
        message: `Payment ${action.action} successful`
      };

    } catch (error: any) {
      console.error('Verification error:', error);
      return {
        success: false,
        message: error.message || 'Verification failed',
        error: error.toString()
      };
    }
  }

  private async enrollUserAfterVerification(paymentId: string) {
    // Get payment details
    const { data: payment } = await supabase
      .from('manual_payments')
      .select('user_id, course_id')
      .eq('id', paymentId)
      .single();

    if (!payment) return;

    // Enroll user in course
    const { error } = await supabase
      .from('enrollments')
      .upsert({
        user_id: payment.user_id,
        course_id: payment.course_id,
        enrolled_at: new Date().toISOString(),
        payment_id: paymentId,
        status: 'active'
      });

    if (error) {
      console.error('Enrollment error:', error);
      throw error;
    }

    // Send enrollment email
    await this.sendEnrollmentEmail(payment.user_id, payment.course_id);
  }

  private async sendEnrollmentEmail(userId: string, courseId: string) {
    // Get user and course details
    const [{ data: user }, { data: course }] = await Promise.all([
      supabase.auth.admin.getUserById(userId),
      supabase.from('courses').select('title').eq('id', courseId).single()
    ]);

    if (user?.user?.email && course) {
      // FIXED: Changed user_meta_data to user_metadata
      await supabase.functions.invoke('send-enrollment-email', {
        body: {
          to: user.user.email,
          courseTitle: course.title,
          userName: user.user.user_metadata?.full_name || 'User'
        }
      });
    }
  }

  private async notifyUser(paymentId: string, action: string) {
    const payment = await this.getPaymentDetails(paymentId);
    if (!payment) return;

    // FIXED: PaymentRecord now has user_id property
    const { data: user } = await supabase.auth.admin.getUserById(payment.user_id);
    if (!user?.user?.email) return;

    let subject = '';
    let message = '';

    switch (action) {
      case 'verify':
        subject = 'পেমেন্ট ভেরিফাই হয়েছে!';
        message = `আপনার পেমেন্ট (${payment.receipt_number}) ভেরিফাই হয়েছে। এখন আপনি কোর্সে এক্সেস পাবেন।`;
        break;
      case 'reject':
        subject = 'পেমেন্ট ভেরিফাই হয়নি';
        message = `আপনার পেমেন্ট (${payment.receipt_number}) ভেরিফাই হয়নি। কারণ: ${payment.rejection_reason}`;
        break;
      case 'request_info':
        subject = 'অতিরিক্ত তথ্য প্রয়োজন';
        message = `আপনার পেমেন্ট ভেরিফিকেশনের জন্য অতিরিক্ত তথ্য প্রয়োজন। দয়া করে আপনার পেমেন্ট স্ট্যাটাস চেক করুন।`;
        break;
    }

    if (subject && message) {
      await supabase.functions.invoke('send-notification-email', {
        body: {
          to: user.user.email,
          subject,
          message,
          receiptNumber: payment.receipt_number
        }
      });
    }
  }

  async getPaymentStats() {
    const { data, error } = await supabase
      .from('payment_statistics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) {
      // Fallback calculation
      return this.calculateStats();
    }

    return data;
  }

  private async calculateStats() {
    const { data: payments } = await supabase
      .from('manual_payments')
      .select('*');

    const stats = {
      total: payments?.length || 0,
      pending: payments?.filter(p => p.status === 'submitted').length || 0,
      under_review: payments?.filter(p => p.status === 'under_review').length || 0,
      verified: payments?.filter(p => p.status === 'verified').length || 0,
      rejected: payments?.filter(p => p.status === 'rejected').length || 0,
      total_amount: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      today_pending: payments?.filter(p => {
        const today = new Date().toISOString().split('T')[0];
        return p.status === 'submitted' && p.created_at.startsWith(today);
      }).length || 0
    };

    return stats;
  }

  async getRecentVerifications(limit = 20) {
    const { data, error } = await supabase
      .from('manual_payments')
      .select(`
        *,
        user:user_id (
          email,
          raw_user_meta_data->full_name as full_name
        ),
        course:course_id (
          title
        ),
        verifier:verified_by (
          email,
          raw_user_meta_data->full_name as full_name
        )
      `)
      .in('status', ['verified', 'rejected'])
      .order('verified_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // FIXED: Transform the recent verifications data too
    return (data || []).map(item => this.transformPaymentData(item));
  }
}

// Export the class to fix "Cannot find name 'PaymentVerification'"
export class PaymentVerification extends PaymentVerificationService {}

// Export the instance
export const paymentVerificationService = new PaymentVerificationService();