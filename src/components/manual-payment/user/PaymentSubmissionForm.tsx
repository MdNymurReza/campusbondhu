// src/components/manual-payment/user/PaymentSubmissionForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { paymentSubmissionService } from '../../../services/manual-payment/submission.service';
import { PaymentMethod, PaymentSubmission } from '../../../services/manual-payment/types';
import { ProofUploader } from './ProofUploader';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentSubmissionFormProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  onSuccess: (receiptNumber: string) => void;
  onCancel: () => void;
}

export const PaymentSubmissionForm: React.FC<PaymentSubmissionFormProps> = ({
  courseId,
  courseTitle,
  coursePrice,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'method' | 'details' | 'review' | 'success'>('method');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | ''>('');
  
  // Form state
  const [formData, setFormData] = useState({
    paymentType: 'personal' as 'personal' | 'agent' | 'bank_transfer',
    senderNumber: '',
    senderName: '',
    transactionId: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd'),
    transactionTime: format(new Date(), 'HH:mm'),
    amountPaid: coursePrice,
    userNote: '',
  });

  const [proofImages, setProofImages] = useState<File[]>([]);
  const [receiptImage, setReceiptImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      setError('লগইন করুন');
      return;
    }

    if (!selectedPaymentMethod) {
      setError('দয়া করে একটি পেমেন্ট পদ্ধতি নির্বাচন করুন');
      return;
    }

    if (proofImages.length === 0) {
      setError('কমপক্ষে একটি প্রমাণ ছবি প্রয়োজন');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create submission data - NO BUCKET NEEDED
      const submission: PaymentSubmission = {
        courseId,
        userId: user.id,
        amount: coursePrice,
        paymentMethod: selectedPaymentMethod as PaymentMethod,
        paymentType: formData.paymentType,
        senderNumber: formData.senderNumber,
        senderName: formData.senderName,
        transactionId: formData.transactionId,
        transactionDate: formData.transactionDate,
        transactionTime: formData.transactionTime,
        amountPaid: parseFloat(formData.amountPaid.toString()),
        proofImages,
        receiptImage: receiptImage || undefined,
        userNote: formData.userNote
      };

      const result = await paymentSubmissionService.submitPayment(submission);

      if (result.success && result.payment) {
        setSuccessData(result.payment);
        setStep('success');
        onSuccess(result.payment.receipt_number);
      } else {
        setError(result.message || 'জমা দিতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'একটি ত্রুটি হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'bkash' as PaymentMethod, name: 'bKash' },
    { id: 'nagad' as PaymentMethod, name: 'Nagad' },
    { id: 'rocket' as PaymentMethod, name: 'Rocket' },
    { id: 'bank' as PaymentMethod, name: 'ব্যাংক ট্রান্সফার' },
    { id: 'cash' as PaymentMethod, name: 'নগদ' },
    { id: 'others' as PaymentMethod, name: 'অন্যান্য' },
  ];

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center">পেমেন্ট মাধ্যম নির্বাচন করুন</h3>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPaymentMethod(method.id);
                    setStep('details');
                  }}
                  className={`w-full p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <h5 className="font-semibold">{method.name}</h5>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={onCancel} className="w-full">
              বাতিল করুন
            </Button>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">পেমেন্ট তথ্য</h3>
              <Button variant="ghost" size="sm" onClick={() => setStep('method')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                পিছনে
              </Button>
            </div>

            {/* Show selected payment method */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">নির্বাচিত পদ্ধতি:</span> {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="paymentType">পেমেন্ট টাইপ</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value: 'personal' | 'agent' | 'bank_transfer') => 
                    setFormData(prev => ({ ...prev, paymentType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">নিজের থেকে</SelectItem>
                    <SelectItem value="agent">এজেন্টের মাধ্যমে</SelectItem>
                    <SelectItem value="bank_transfer">ব্যাংক ট্রান্সফার</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {['bkash', 'nagad', 'rocket'].includes(selectedPaymentMethod) && (
                <div>
                  <Label htmlFor="senderNumber">মোবাইল নম্বর *</Label>
                  <Input
                    id="senderNumber"
                    placeholder="017XXXXXXXX"
                    value={formData.senderNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, senderNumber: e.target.value }))}
                    required
                  />
                </div>
              )}

              {['bank', 'cash'].includes(selectedPaymentMethod) && (
                <div>
                  <Label htmlFor="senderName">প্রেরকের নাম *</Label>
                  <Input
                    id="senderName"
                    placeholder="আপনার নাম"
                    value={formData.senderName}
                    onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transactionDate">তারিখ *</Label>
                  <Input
                    id="transactionDate"
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="transactionTime">সময়</Label>
                  <Input
                    id="transactionTime"
                    type="time"
                    value={formData.transactionTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionTime: e.target.value }))}
                  />
                </div>
              </div>

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
                <Label htmlFor="amountPaid">পরিশোধিত পরিমাণ *</Label>
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
                <Label htmlFor="userNote">নোট (ঐচ্ছিক)</Label>
                <Textarea
                  id="userNote"
                  placeholder="যেকোনো অতিরিক্ত তথ্য..."
                  value={formData.userNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, userNote: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>প্রমাণ ছবি * (সর্বোচ্চ 5 টি)</Label>
                <ProofUploader
                  files={proofImages}
                  onFilesChange={setProofImages}
                  maxFiles={5}
                  accept="image/*,.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Payment Screenshot, Bank Slip, Receipt ইত্যাদির ছবি (প্রতিটি সর্বোচ্চ 5MB)
                </p>
              </div>

              {selectedPaymentMethod === 'cash' && (
                <div>
                  <Label>রিসিপ্ট ছবি (ঐচ্ছিক)</Label>
                  <ProofUploader
                    files={receiptImage ? [receiptImage] : []}
                    onFilesChange={(files) => setReceiptImage(files[0] || null)}
                    maxFiles={1}
                  />
                </div>
              )}
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
                onClick={() => setStep('review')}
                className="flex-1"
                disabled={
                  !selectedPaymentMethod ||
                  !formData.transactionId ||
                  !formData.transactionDate ||
                  proofImages.length === 0
                }
              >
                পরবর্তী
              </Button>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">রিভিউ এবং সাবমিট</h3>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">পদ্ধতি</p>
                      <p className="font-semibold">{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">পরিমাণ</p>
                      <p className="font-semibold">৳{formData.amountPaid}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ট্রানজেকশন আইডি</p>
                      <p className="font-semibold font-mono">{formData.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">তারিখ</p>
                      <p className="font-semibold">{formData.transactionDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">প্রমাণ ছবি</p>
                    <div className="flex gap-2 flex-wrap">
                      {proofImages.map((file, index) => (
                        <div key={index} className="border rounded p-2 text-xs max-w-[150px] truncate">
                          {file.name}
                          <div className="text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.userNote && (
                    <div>
                      <p className="text-sm text-gray-600">নোট</p>
                      <p className="text-sm">{formData.userNote}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">গুরুত্বপূর্ণ</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• সঠিক তথ্য দিন, ভুল তথ্যে পেমেন্ট ভেরিফাই হবে না</li>
                <li>• পেমেন্ট ভেরিফাই হতে ২৪-৪৮ ঘণ্টা সময় লাগতে পারে</li>
                <li>• রসিদ নম্বরটি সংরক্ষণ করুন</li>
                <li>• ভেরিফিকেশন স্ট্যাটাস আপনার প্রোফাইল থেকে চেক করতে পারবেন</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
                className="flex-1"
                disabled={loading}
              >
                সম্পাদনা
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    জমা হচ্ছে...
                  </>
                ) : (
                  'পেমেন্ট সাবমিট করুন'
                )}
              </Button>
            </div>
          </div>
        );

      case 'success':
        return successData && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">সফলভাবে জমা হয়েছে!</h3>
            <p className="text-gray-600 mb-6">
              আপনার পেমেন্ট ভেরিফিকেশনের জন্য জমা হয়েছে।
            </p>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>রসিদ নং:</span>
                    <span className="font-bold">{successData.receipt_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ট্র্যাকিং আইডি:</span>
                    <span className="font-mono">{successData.tracking_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>স্ট্যাটাস:</span>
                    <span className="font-semibold text-yellow-600">ভেরিফিকেশন পেন্ডিং</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => window.open(`/payment/status/${successData.id}`, '_blank')}
                className="w-full"
              >
                স্ট্যাটাস ট্র্যাক করুন
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
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
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {courseTitle} - পেমেন্ট জমা দিন
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}
        {renderStep()}
      </CardContent>
    </Card>
  );
};