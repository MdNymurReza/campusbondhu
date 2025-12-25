// src/components/manual-payment/admin/VerificationPanel.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { paymentVerificationService } from '../../../services/manual-payment/verification.service';
import { ImagePreviewModal } from '../../ui/ImagePreviewModal';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, MessageSquare, 
  User, Download, Eye, Mail, Phone, Calendar, Receipt
} from 'lucide-react';
import { format } from 'date-fns';

export const VerificationPanel: React.FC = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'verify' | 'reject' | 'request_info'>('verify');

  useEffect(() => {
    if (paymentId) {
      loadPayment();
    }
  }, [paymentId]);

  const loadPayment = async () => {
    setLoading(true);
    try {
      const data = await paymentVerificationService.getPaymentDetails(paymentId!);
      setPayment(data);
    } catch (error) {
      console.error('Failed to load payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!user || !payment) return;
    
    setVerifying(true);
    try {
      const result = await paymentVerificationService.performVerification({
        paymentId: payment.id,
        action,
        adminId: user.id,
        note: verificationNote,
        rejectionReason: action === 'reject' ? rejectionReason : undefined
      });

      if (result.success) {
        navigate('/admin/payments');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const assignToSelf = async () => {
    if (!user || !payment) return;
    
    try {
      await paymentVerificationService.performVerification({
        paymentId: payment.id,
        action: 'assign',
        adminId: user.id,
        assignedTo: user.id
      });
      loadPayment();
    } catch (error) {
      console.error('Assignment failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Payment not found</h2>
        <Button onClick={() => navigate('/admin/payments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/payments')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Queue
        </Button>
        
        <div className="flex items-center gap-2">
          <Badge variant={payment.status === 'verified' ? 'default' : 'secondary'}>
            {payment.status}
          </Badge>
          {payment.assigned_to ? (
            <Badge variant="outline">
              <User className="h-3 w-3 mr-1" />
              Assigned
            </Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={assignToSelf}>
              <User className="h-4 w-4 mr-2" />
              Assign to me
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Payment Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">বিস্তারিত</TabsTrigger>
                  <TabsTrigger value="proofs">প্রমাণ</TabsTrigger>
                  <TabsTrigger value="user">ব্যবহারকারী</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>রসিদ নং</Label>
                        <div className="font-bold text-lg">{payment.receipt_number}</div>
                      </div>
                      <div>
                        <Label>ট্র্যাকিং আইডি</Label>
                        <div className="font-mono">{payment.tracking_id}</div>
                      </div>
                      <div>
                        <Label>পেমেন্ট পদ্ধতি</Label>
                        <div className="font-semibold">{payment.payment_method}</div>
                      </div>
                      <div>
                        <Label>পরিমাণ</Label>
                        <div className="font-bold text-green-600">৳{payment.amount}</div>
                      </div>
                      <div>
                        <Label>ট্রানজেকশন আইডি</Label>
                        <div className="font-mono">{payment.transaction_id}</div>
                      </div>
                      <div>
                        <Label>তারিখ</Label>
                        <div>{format(new Date(payment.transaction_date), 'dd/MM/yyyy')}</div>
                      </div>
                    </div>

                    {payment.sender_number && (
                      <div>
                        <Label>মোবাইল নম্বর</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {payment.sender_number}
                        </div>
                      </div>
                    )}

                    {payment.sender_name && (
                      <div>
                        <Label>প্রেরকের নাম</Label>
                        <div>{payment.sender_name}</div>
                      </div>
                    )}

                    {payment.user_note && (
                      <div>
                        <Label>ব্যবহারকারীর নোট</Label>
                        <div className="p-3 bg-gray-50 rounded">{payment.user_note}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="proofs">
                  <div className="space-y-4">
                    <Label>প্রমাণ ছবি</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {payment.proof_images?.map((url: string, index: number) => (
                        <div
                          key={index}
                          className="border rounded overflow-hidden cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedImage(url)}
                        >
                          <img
                            src={url}
                            alt={`Proof ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2 text-center text-sm">
                            Proof {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {payment.receipt_image && (
                      <div>
                        <Label>রিসিপ্ট</Label>
                        <div
                          className="border rounded overflow-hidden max-w-xs cursor-pointer"
                          onClick={() => setSelectedImage(payment.receipt_image)}
                        >
                          <img
                            src={payment.receipt_image}
                            alt="Receipt"
                            className="w-full h-32 object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="user">
                  <div className="space-y-4">
                    <div>
                      <Label>ইমেইল</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {payment.user.email}
                      </div>
                    </div>
                    {payment.user.full_name && (
                      <div>
                        <Label>নাম</Label>
                        <div>{payment.user.full_name}</div>
                      </div>
                    )}
                    {payment.user.phone && (
                      <div>
                        <Label>ফোন</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {payment.user.phone}
                        </div>
                      </div>
                    )}
                    <div>
                      <Label>কোর্স</Label>
                      <div className="font-semibold">{payment.course.title}</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Verification History */}
          {payment.verification_note && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">ভেরিফিকেশন নোট</h3>
                <div className="p-3 bg-gray-50 rounded">{payment.verification_note}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Verification Actions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">ভেরিফিকেশন</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>অ্যাকশন</Label>
                  <Select value={action} onValueChange={(value: any) => setAction(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verify">
                        <CheckCircle className="h-4 w-4 mr-2 inline" />
                        ভেরিফাই
                      </SelectItem>
                      <SelectItem value="reject">
                        <XCircle className="h-4 w-4 mr-2 inline" />
                        রিজেক্ট
                      </SelectItem>
                      <SelectItem value="request_info">
                        <MessageSquare className="h-4 w-4 mr-2 inline" />
                        তথ্য চাই
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {action === 'reject' && (
                  <div>
                    <Label>রিজেকশন কারণ</Label>
                    <Select
                      value={rejectionReason}
                      onValueChange={setRejectionReason}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="কারণ সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invalid_proof">ভুল প্রমাণ</SelectItem>
                        <SelectItem value="wrong_amount">ভুল পরিমাণ</SelectItem>
                        <SelectItem value="invalid_transaction">ভুল ট্রানজেকশন আইডি</SelectItem>
                        <SelectItem value="duplicate">ডুপ্লিকেট পেমেন্ট</SelectItem>
                        <SelectItem value="other">অন্যান্য</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>নোট (ঐচ্ছিক)</Label>
                  <Textarea
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    placeholder="ভেরিফিকেশন নোট..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleVerification}
                  disabled={verifying || (action === 'reject' && !rejectionReason)}
                  className="w-full"
                  variant={
                    action === 'verify' ? 'default' :
                    action === 'reject' ? 'destructive' : 'secondary'
                  }
                >
                  {verifying ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : action === 'verify' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      ভেরিফাই করুন
                    </>
                  ) : action === 'reject' ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      রিজেক্ট করুন
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      তথ্য রিকোয়েস্ট করুন
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">দ্রুত অ্যাকশন</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  ইমেইল পাঠান
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  ডাউনলোড প্রুফ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  রিসিপ্ট প্রিন্ট করুন
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">টাইমলাইন</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">জমা হয়েছে</div>
                  <div className="text-gray-500">
                    {format(new Date(payment.created_at), 'dd MMM yyyy, hh:mm a')}
                  </div>
                </div>
                {payment.assigned_at && (
                  <div className="text-sm">
                    <div className="font-medium">Assign করা হয়েছে</div>
                    <div className="text-gray-500">
                      {format(new Date(payment.assigned_at), 'dd MMM yyyy, hh:mm a')}
                    </div>
                  </div>
                )}
                {payment.verified_at && (
                  <div className="text-sm">
                    <div className="font-medium">ভেরিফাই হয়েছে</div>
                    <div className="text-gray-500">
                      {format(new Date(payment.verified_at), 'dd MMM yyyy, hh:mm a')}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};