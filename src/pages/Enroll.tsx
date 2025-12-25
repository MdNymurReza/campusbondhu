// src/pages/Enroll.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Smartphone,
  Banknote,
  Wallet,
  Shield,
  Clock,
  Loader2,
  AlertCircle,
  BookOpen,
  Users,
  Star,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ManualPaymentModal } from "@/components/manual-payment/ManualPaymentModal";

const Enroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManualPayment, setShowManualPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/enroll/${id}` } });
      return;
    }

    fetchCourse();
    checkEnrollment();
  }, [id, user, navigate]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch course by ID or slug
      const { data, error: supabaseError } = await supabase
        .from('courses')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        console.error('Error fetching course:', supabaseError);
        
        // Fallback for common IDs
        if (id === '1' || id === 'web-development-bootcamp') {
          setCourse(getFallbackCourse());
          return;
        }
        
        throw new Error('কোর্সটি পাওয়া যায়নি');
      }

      if (!data) {
        throw new Error('কোর্সটি পাওয়া যায়নি');
      }

      console.log('Course found for enrollment:', data);
      setCourse(data);
    } catch (error: any) {
      console.error('Error in fetchCourse:', error);
      setError(error.message);
      
      if (id === '1' || id === 'web-development-bootcamp') {
        setCourse(getFallbackCourse());
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCourse = () => {
    return {
      id: 1,
      title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
      price: 1999,
      original_price: 4999,
      image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
      duration: "৪০ ঘণ্টা",
      students_count: 1250,
      rating: 4.8,
      description: "শুরু থেকে HTML, CSS, JavaScript, React, Node.js এবং আরও অনেক কিছু শিখুন।",
      category: "ওয়েব ডেভেলপমেন্ট"
    };
  };

  const checkEnrollment = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', id)
        .single();

      setIsEnrolled(!!data);
      if (!!data) {
        navigate(`/courses/${id}/learn`);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setIsEnrolled(false);
    }
  };

  const handleManualPaymentSuccess = (receiptNumber: string) => {
    navigate(`/payment/status/${receiptNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">লোড হচ্ছে...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">কোর্স পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-6">{error || "এই কোর্সটি খুঁজে পাওয়া যায়নি"}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/courses">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  কোর্সে ফিরে যান
                </Button>
              </Link>
              <Button onClick={fetchCourse}>
                আবার চেষ্টা করুন
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const courseTitle = course.title || 'কোর্স';
  const price = course.price || 0;
  const originalPrice = course.original_price || course.price || 0;
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;
  const courseImage = course.image_url || course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop';

  return (
    <>
      <Helmet>
        <title>এনরোল করুন - {courseTitle} - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content={`${courseTitle} কোর্সে এনরোল করুন`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/courses/${id}`)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              কোর্সে ফিরে যান
            </Button>

            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-8">
                {courseTitle} - এনরোল করুন
              </h1>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Course Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      কোর্স সারাংশ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={courseImage}
                          alt={courseTitle}
                          className="h-20 w-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold">{courseTitle}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.duration || '১০ ঘণ্টা'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.students_count || 0} জন
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {course.rating || 4.5}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>কোর্স ফি</span>
                          <span className="font-semibold">৳{originalPrice.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>ছাড়</span>
                            <span className="font-semibold">{discount}%</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>সর্বমোট</span>
                        <span className="text-primary">৳{price.toLocaleString()}</span>
                      </div>
                      
                      {discount > 0 && (
                        <p className="text-sm text-green-600 text-center">
                          আপনি সেভ করছেন ৳{(originalPrice - price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      পেমেন্ট অপশন
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Manual Payment Info */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                          <h3 className="font-semibold text-blue-800">ম্যানুয়াল পেমেন্ট</h3>
                        </div>
                        <p className="text-sm text-blue-700 mb-4">
                          bKash, Nagad, Rocket, ব্যাংক ট্রান্সফার বা ক্যাশের মাধ্যমে পেমেন্ট করুন।
                          পেমেন্টের প্রুফ জমা দিন, আমরা ২৪ ঘণ্টার মধ্যে ভেরিফাই করব।
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <Smartphone className="h-4 w-4 text-green-600" />
                            <span>bKash/Nagad</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <Banknote className="h-4 w-4 text-blue-600" />
                            <span>ব্যাংক ট্রান্সফার</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <Wallet className="h-4 w-4 text-purple-600" />
                            <span>ক্যাশ পেমেন্ট</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <Globe className="h-4 w-4 text-orange-600" />
                            <span>অন্যান্য</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="space-y-3">
                        <Button
                          onClick={() => setShowManualPayment(true)}
                          className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                          variant="default"
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          ম্যানুয়াল পেমেন্ট করুন
                        </Button>

                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-2">
                            অটোমেটিক পেমেন্ট গেটওয়ে শীঘ্রই আসছে
                          </p>
                          <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                            <Shield className="h-3 w-3" />
                            সিকিউর পেমেন্ট গেটওয়ে
                          </div>
                        </div>
                      </div>

                      {/* Payment Guarantee */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          আমাদের গ্যারান্টি
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>১০০% সুরক্ষিত পেমেন্ট</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>৭ দিনের রিফান্ড পলিসি</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>পেমেন্ট ভেরিফাই হতে ২৪ ঘণ্টা সময় লাগে</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>ভেরিফিকেশনের পর স্বয়ংক্রিয় এনরোলমেন্ট</span>
                          </div>
                        </div>
                      </div>

                      {/* Help */}
                      <div className="text-center text-sm text-gray-600 border-t pt-4">
                        <p className="mb-1">পেমেন্টে সমস্যা?</p>
                        <p className="font-semibold text-primary">০১৭৭০-৬১৮৫৭৫</p>
                        <p className="text-xs text-gray-500 mt-1">সকাল ৯টা - রাত ১০টা</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Important Notes */}
              <Card className="mt-8">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 text-foreground">গুরুত্বপূর্ণ নির্দেশনা</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      পেমেন্টের স্ক্রিনশট বা স্লিপের ছবি সংরক্ষণ করুন
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      ট্রানজেকশন আইডি নোট করুন
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      পেমেন্ট সাবমিট করার পর রসিদ নম্বরটি সংরক্ষণ করুন
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      পেমেন্ট ভেরিফাই হলে আপনাকে ইমেইল নোটিফিকেশন পাঠানো হবে
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      ভেরিফিকেশনের পর স্বয়ংক্রিয়ভাবে কোর্সে এনরোল্ড হয়ে যাবেন
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      যেকোনো সমস্যায় আমাদের হেল্পলাইনে যোগাযোগ করুন
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />

        {/* Manual Payment Modal */}
        {showManualPayment && (
          <ManualPaymentModal
            courseId={course.id.toString()}
            courseTitle={courseTitle}
            amount={price}
            onClose={() => setShowManualPayment(false)}
            onSuccess={handleManualPaymentSuccess}
          />
        )}
      </div>
    </>
  );
};

export default Enroll;