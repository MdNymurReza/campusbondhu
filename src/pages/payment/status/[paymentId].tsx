// src/pages/manual-payment/status/[paymentId].tsx
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PaymentStatus = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  const fetchPayment = async () => {
    try {
      const { data } = await supabase
        .from('manual_payments')
        .select(`
          *,
          course:course_id (
            title,
            thumbnail_url
          )
        `)
        .eq('id', paymentId)
        .single();

      setPayment(data);
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'submitted':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      default:
        return <AlertCircle className="h-16 w-16 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'ভেরিফাইড';
      case 'rejected':
        return 'রিজেক্টেড';
      case 'submitted':
        return 'ভেরিফিকেশন পেন্ডিং';
      default:
        return 'প্রক্রিয়াধীন';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">পেমেন্ট খুঁজে পাওয়া যায়নি</h1>
            <Link to="/">
              <Button>হোমে ফিরে যান</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>পেমেন্ট স্ট্যাটাস - ক্যাম্পাসবন্ধু</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ড্যাশবোর্ডে ফিরে যান
              </Link>
            </Button>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="pt-12 pb-8">
                  <div className="text-center">
                    {getStatusIcon(payment.status)}
                    
                    <h1 className="text-2xl font-bold mt-6 mb-2">
                      {getStatusText(payment.status)}
                    </h1>
                    
                    <p className="text-gray-600 mb-8">
                      {payment.status === 'verified' 
                        ? 'আপনার পেমেন্ট ভেরিফাই হয়েছে! এখন আপনি কোর্সে এক্সেস পাবেন।'
                        : payment.status === 'rejected'
                        ? 'আপনার পেমেন্ট ভেরিফাই হয়নি। দয়া করে আবার চেষ্টা করুন।'
                        : 'আপনার পেমেন্ট ভেরিফিকেশনের জন্য জমা হয়েছে। ২৪ ঘণ্টার মধ্যে ভেরিফাই করা হবে।'
                      }
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">রসিদ নং:</span>
                          <span className="font-bold">{payment.receipt_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">কোর্স:</span>
                          <span className="font-semibold">{payment.course?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">পরিমাণ:</span>
                          <span className="font-bold text-green-600">৳{payment.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">পদ্ধতি:</span>
                          <span className="font-medium">{payment.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">জমার তারিখ:</span>
                          <span>{new Date(payment.created_at).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {payment.status === 'verified' && (
                        <Button asChild className="w-full" size="lg">
                          <Link to={`/courses/${payment.course_id}/learn`}>
                            কোর্স শুরু করুন
                          </Link>
                        </Button>
                      )}
                      
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/dashboard">
                          ড্যাশবোর্ডে যান
                        </Link>
                      </Button>
                      
                      <Button variant="ghost" asChild className="w-full">
                        <Link to={`/payment/receipt/${payment.receipt_number}`}>
                          রসিদ দেখুন
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PaymentStatus;