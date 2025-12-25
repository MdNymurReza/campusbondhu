// src/components/manual-payment/ManualPaymentModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Loader2, CheckCircle, Upload, Smartphone, Building2, Radio, Banknote, Wallet } from 'lucide-react';
import { format } from 'date-fns';

interface ManualPaymentModalProps {
  courseId: string;
  courseTitle: string;
  amount: number;
  onClose: () => void;
  onSuccess: (receiptNumber: string) => void;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
  courseId,
  courseTitle,
  amount,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'method' | 'form' | 'success'>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    paymentMethod: '',
    senderNumber: '',
    senderName: '',
    transactionId: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd'),
    amountPaid: amount,
    note: '',
  });

  const [proofFile, setProofFile] = useState<File | null>(null);

  const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: Smartphone, color: 'text-pink-600' },
    { id: 'nagad', name: 'Nagad', icon: Building2, color: 'text-purple-600' },
    { id: 'rocket', name: 'Rocket', icon: Radio, color: 'text-green-600' },
    { id: 'bank', name: 'ব্যাংক ট্রান্সফার', icon: Banknote, color: 'text-blue-600' },
    { id: 'cash', name: 'নগদ', icon: Wallet, color: 'text-yellow-600' },
  ];

  const handleMethodSelect = (methodId: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: methodId }));
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('লগইন করুন');
      return;
    }

    if (!formData.transactionId.trim()) {
      setError('ট্রানজেকশন আইডি প্রয়োজন');
      return;
    }

    if (!proofFile) {
      setError('পেমেন্ট প্রুফ (ছবি) প্রয়োজন');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload proof image
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `${user.id}_${courseId}_${Date.now()}.${fileExt}`;
      const filePath = `payment-proofs/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payments')
        .upload(filePath, proofFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payments')
        .getPublicUrl(filePath);

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('manual_payments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          amount: amount,
          amount_paid: formData.amountPaid,
          payment_method: formData.paymentMethod,
          status: 'submitted',
          sender_number: formData.senderNumber,
          sender_name: formData.senderName,
          transaction_id: formData.transactionId.trim(),
          transaction_date: formData.transactionDate,
          proof_images: [publicUrl],
          user_note: formData.note,
        })
        .select('receipt_number, id')
        .single();

      if (paymentError) throw paymentError;

      setSuccessData(payment);
      setStep('success');
      onSuccess(payment.receipt_number);

    } catch (err: any) {
      setError(err.message || 'একটি ত্রুটি হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // Add this function inside CourseDetail.tsx or create a separate file
const SimpleManualPaymentModal = ({ courseId, courseTitle, amount, onClose, onSuccess }) => {
    // Simplified modal implementation
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Manual Payment</h3>
          <p>Manual payment modal will be implemented here.</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  };
  
  // Then use SimpleManualPaymentModal instead of ManualPaymentModal

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">পেমেন্ট মাধ্যম নির্বাচন করুন</h3>
            <div className="grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="w-full p-4 border rounded-lg text-left flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${method.color} bg-opacity-10`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">{method.name}</h5>
                    </div>
                    <div>→</div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'form':
        const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
        const Icon = selectedMethod?.icon || Wallet;

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${selectedMethod?.color} bg-opacity-10`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedMethod?.name} এর মাধ্যমে পেমেন্ট</h3>
                <p className="text-sm text-gray-600">পেমেন্টের তথ্য দিন</p>
              </div>
            </div>

            <div className="space-y-4">
              {['bkash', 'nagad', 'rocket'].includes(formData.paymentMethod) && (
                <div>
                  <Label htmlFor="senderNumber">আপনার মোবাইল নম্বর *</Label>
                  <Input
                    id="senderNumber"
                    placeholder="017XXXXXXXX"
                    value={formData.senderNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, senderNumber: e.target.value }))}
                    required
                  />
                </div>
              )}

              {['bank', 'cash'].includes(formData.paymentMethod) && (
                <div>
                  <Label htmlFor="senderName">আপনার নাম *</Label>
                  <Input
                    id="senderName"
                    placeholder="আপনার নাম লিখুন"
                    value={formData.senderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="transactionId">ট্রানজেকশন আইডি *</Label>
                <Input
                  id="transactionId"
                  placeholder="TRX123456789"
                  value={formData.transactionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="transactionDate">পেমেন্টের তারিখ *</Label>
                <Input
                  id="transactionDate"
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="amountPaid">পরিমাণ (টাকা) *</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountPaid: parseFloat(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="note">নোট (ঐচ্ছিক)</Label>
                <Textarea
                  id="note"
                  placeholder="যেকোনো অতিরিক্ত তথ্য..."
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>পেমেন্ট প্রুফ (ছবি) *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {proofFile ? (
                    <div className="space-y-2">
                      <p className="font-medium">{proofFile.name}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProofFile(null)}
                      >
                        পরিবর্তন করুন
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="mb-2">স্ক্রিনশট বা রিসিপ্টের ছবি আপলোড করুন</p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('proof-upload')?.click()}
                      >
                        ফাইল সিলেক্ট করুন
                      </Button>
                      <input
                        id="proof-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                className="flex-1"
              >
                পিছনে
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading || !formData.transactionId || !proofFile}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    জমা হচ্ছে...
                  </>
                ) : (
                  'পেমেন্ট জমা দিন'
                )}
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">সফলভাবে জমা হয়েছে!</h3>
            <p className="text-gray-600 mb-6">
              আপনার পেমেন্ট ভেরিফিকেশনের জন্য জমা হয়েছে।
              ভেরিফাই হলে আপনাকে নোটিফিকেশন পাঠানো হবে।
            </p>
            
            {successData && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-mono font-bold text-lg">রসিদ: {successData.receipt_number}</p>
                <p className="text-sm text-gray-500 mt-1">এই রসিদ নম্বরটি সংরক্ষণ করুন</p>
              </div>
            )}

            <div className="space-y-3">
              {successData && (
                <Button
                  onClick={() => window.open(`/payment/status/${successData.id}`, '_blank')}
                  className="w-full"
                >
                  স্ট্যাটাস ট্র্যাক করুন
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                বন্ধ করুন
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <CardTitle className="text-center">
            {courseTitle} - ম্যানুয়াল পেমেন্ট
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">পরিমাণ:</span>
              <span className="text-2xl font-bold text-green-600">৳{amount}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};