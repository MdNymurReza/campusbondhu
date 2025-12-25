// src/services/manual-payment/types.ts
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash' | 'others';
export type PaymentStatus = 'submitted' | 'under_review' | 'verified' | 'rejected' | 'cancelled';
export type VerificationStatus = 'pending' | 'in_progress' | 'completed';

export interface PaymentSubmission {
  courseId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: 'personal' | 'agent' | 'bank_transfer';
  
  // Payment details
  senderNumber?: string;
  senderName?: string;
  transactionId: string;
  transactionDate: string;
  transactionTime?: string;
  amountPaid: number;
  
  // Files
  proofImages: File[];
  receiptImage?: File;
  
  // Notes
  userNote?: string;
}

export interface PaymentRecord {
  id: string;
  receipt_number: string;
  tracking_id: string;
  status: PaymentStatus;
  verification_status: VerificationStatus;
  amount: number;
  amount_paid: number;
  payment_method: PaymentMethod;
  payment_type: string;
  
  // Relation IDs
  user_id: string; // ADDED: Fix for property 'user_id' error
  course_id: string; // ADDED: For consistency
  
  // User details
  sender_number?: string;
  sender_name?: string;
  transaction_id: string;
  transaction_date: string;
  transaction_time?: string;
  proof_images: string[];
  receipt_image?: string;
  user_note?: string;
  
  // Admin details
  verified_by?: string;
  verified_at?: string;
  verification_note?: string;
  rejection_reason?: string;
  assigned_to?: string;
  assigned_at?: string;
  
  // Relations
  user: {
    email: string;
    full_name?: string;
    phone?: string;
  };
  course: {
    title: string;
    price: number;
    thumbnail_url?: string;
  };
  verifier?: {
    email: string;
    full_name?: string;
  };
  assignee?: {
    email: string;
    full_name?: string;
  };
  
  // Timestamps
  created_at: string;
  updated_at: string;
  submitted_at: string;
}

export interface VerificationAction {
  paymentId: string;
  action: 'verify' | 'reject' | 'request_info' | 'assign' | 'unassign';
  note?: string;
  adminId: string;
  rejectionReason?: string;
  assignedTo?: string;
}