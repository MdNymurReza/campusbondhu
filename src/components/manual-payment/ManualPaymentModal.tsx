// src/components/manual-payment/ManualPaymentModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentSubmissionService } from '../../services/manual-payment/submission.service';
import { PaymentMethod } from '../../services/manual-payment/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Loader2, CheckCircle, Smartphone, Building2, Radio, Banknote, Wallet } from 'lucide-react';
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
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | ''>('');
  const [formData, setFormData] = useState({
    senderNumber: '',
    senderName: '',
    transactionId: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd'),
    amountPaid: amount,
    note: '',
  });

  const [proofFile, setProofFile] = useState<File | null>(null);

  const paymentMethods = [
    { id: 'bkash' as PaymentMethod, name: 'bKash', icon: Smartphone, color: 'text-pink-600' },
    { id: 'nagad' as PaymentMethod, name: 'Nagad', icon: Building2, color: 'text-purple-600' },
    { id: 'rocket' as PaymentMethod, name: 'Rocket', icon: Radio, color: 'text-green-600' },
    { id: 'bank' as PaymentMethod, name: 'ব্যাংক ট্রান্সফার', icon: Banknote, color: 'text-blue-600' },
    { id: 'cash' as PaymentMethod, name: 'নগদ', icon: Wallet, color: 'text-yellow-600' },
  ];

  const handleMethodSelect = (methodId: PaymentMethod) => {
    setSelectedMethod(methodId);
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('লগইন করুন');
      return;
    }

    if (!selectedMethod) {
      setError('পেমেন্ট পদ্ধতি নির্বাচন করুন');
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
      // Create payment submission data - NO BUCKET NEEDED
      const submissionData = {
        courseId,
        userId: user.id,
        amount: amount,
        paymentMethod: selectedMethod,
        paymentType: 'personal' as const,
        senderNumber: formData.senderNumber,
        senderName: formData.senderName,
        transactionId: formData.transactionId.trim(),
        transactionDate: formData.transactionDate,
        transactionTime: format(new Date(), 'HH:mm'),
        amountPaid: parseFloat(formData.amountPaid.toString()),
        proofImages: [proofFile],
        receiptImage: undefined,
        userNote: formData.note
      };

      const result = await paymentSubmissionService.submitPayment(submissionData);

      if (result.success && result.payment) {
        setSuccessData(result.payment);
        setStep('success');
        onSuccess(result.payment.receipt_number);
      } else {
        setError(result.message || 'জমা দিতে সমস্যা হয়েছে');
      }

    } catch (err: any) {
      setError(err.message || 'একটি ত্রুটি হয়েছে');
      console.error('Payment submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

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
        const selectedMethodInfo = paymentMethods.find(m => m.id === selectedMethod);
        const Icon = selectedMethodInfo?.icon || Wallet;

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${selectedMethodInfo?.color} bg-opacity-10`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedMethodInfo?.name} এর মাধ্যমে পেমেন্ট</h3>
                <p className="text-sm text-gray-600">পেমেন্টের তথ্য দিন</p>
              </div>
            </div>

            <div className="space-y-4">
              {['bkash', 'nagad', 'rocket'].includes(selectedMethod) && (
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

              {['bank', 'cash'].includes(selectedMethod) && (
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
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    amountPaid: parseFloat(e.target.value) || 0 
                  }))}
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
                      <p className="text-sm text-gray-500">
                        {(proofFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProofFile(null)}
                      >
                        পরিবর্তন করুন
                      </Button>
                    </div>
                  ) : (
                    <div>
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
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Check file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              alert('ফাইল সাইজ খুব বড়! সর্বোচ্চ 5MB পর্যন্ত ফাইল আপলোড করতে পারবেন।');
                              return;
                            }
                            setProofFile(file);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                className="flex-1"
                disabled={loading}
              >
                পিছনে
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading || !selectedMethod || !formData.transactionId || !proofFile}
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
                <p className="text-sm text-gray-500 mt-1">ট্র্যাকিং আইডি: {successData.tracking_id}</p>
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

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">পেমেন্ট করতে লগইন করুন</p>
        <Button onClick={() => window.location.href = '/login'}>
          লগইন করুন
        </Button>
      </div>
    );
  }

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