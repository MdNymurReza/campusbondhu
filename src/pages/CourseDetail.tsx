// src/pages/CourseDetail.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  Star, 
  PlayCircle, 
  CheckCircle2, 
  Award,
  BookOpen,
  ArrowLeft,
  Lock,
  CreditCard,
  Smartphone,
  Banknote,
  Loader2,
  AlertCircle,
  FileText,
  Video,
  Download,
  Globe,
  Bookmark,
  Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ManualPaymentModal } from "@/components/manual-payment/ManualPaymentModal";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      if (user) {
        checkEnrollment();
      }
    }
  }, [id, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching course with ID:', id);
      
      // Try to fetch course by ID or slug
      const { data, error: supabaseError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructor_id (
            name,
            bio,
            avatar_url
          )
        `)
        .or(`id.eq.${id},slug.eq.${id}`)
        .eq('is_published', true)
        .single();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        
        // If not found in database, try to use fallback for ID 1
        if (id === '1' || id === 'web-development-bootcamp') {
          console.log('Using fallback course data for ID:', id);
          setCourse(getFallbackCourse());
          return;
        }
        
        throw new Error('কোর্সটি পাওয়া যায়নি');
      }

      if (!data) {
        throw new Error('কোর্সটি পাওয়া যায়নি');
      }

      console.log('Course found:', data);
      setCourse(data);
    } catch (error: any) {
      console.error('Error fetching course:', error);
      setError(error.message || 'কোর্স লোড করতে সমস্যা হয়েছে');
      
      // Try fallback for common cases
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
      name: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
      instructor_name: "রহিম আহমেদ",
      instructor_bio: "শীর্ষ টেক কোম্পানিতে ১০+ বছরের অভিজ্ঞতাসম্পন্ন সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার।",
      instructor: {
        name: "রহিম আহমেদ",
        bio: "শীর্ষ টেক কোম্পানিতে ১০+ বছরের অভিজ্ঞতাসম্পন্ন সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার।"
      },
      price: 1999,
      original_price: 4999,
      image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
      thumbnail_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
      category: "ওয়েব ডেভেলপমেন্ট",
      duration: "৪০ ঘণ্টা",
      total_hours: 40,
      students_count: 1250,
      enrollment_count: 1250,
      rating: 4.8,
      reviews_count: 342,
      description: "শুরু থেকে HTML, CSS, JavaScript, React, Node.js এবং আরও অনেক কিছু শিখুন। এই সম্পূর্ণ বুটক্যাম্প আপনাকে সম্পূর্ণ নতুন থেকে চাকরি-প্রস্তুত ওয়েব ডেভেলপারে রূপান্তরিত করবে।",
      long_description: "এই কোর্সটি পেশাদার ওয়েব ডেভেলপার হতে আপনার যা দরকার সবকিছু শেখানোর জন্য ডিজাইন করা হয়েছে। আপনি HTML এবং CSS এর মূল বিষয়গুলো দিয়ে শুরু করবেন, তারপর JavaScript, React এবং Node.js দিয়ে ব্যাকএন্ড ডেভেলপমেন্টে যাবেন। এই কোর্সের শেষে, আপনি শুরু থেকে ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন তৈরি করতে সক্ষম হবেন।",
      what_youll_learn: [
        "HTML5 এবং CSS3 ব্যবহার করে রেসপন্সিভ ওয়েবসাইট তৈরি করুন",
        "JavaScript ES6+ এবং আধুনিক বেস্ট প্র্যাক্টিস আয়ত্ত করুন",
        "হুকস সহ ডায়নামিক React অ্যাপ্লিকেশন তৈরি করুন",
        "Node.js এবং Express দিয়ে RESTful API তৈরি করুন",
        "MongoDB এবং PostgreSQL এর মতো ডাটাবেসে কাজ করুন",
        "ক্লাউড প্ল্যাটফর্মে অ্যাপ্লিকেশন ডিপ্লয় করুন",
      ],
      curriculum: [
        { title: "ওয়েব ডেভেলপমেন্টের পরিচিতি", lessons: 5, duration: "২ ঘণ্টা" },
        { title: "HTML5 ফান্ডামেন্টালস", lessons: 8, duration: "৪ ঘণ্টা" },
        { title: "CSS3 এবং রেসপন্সিভ ডিজাইন", lessons: 10, duration: "৬ ঘণ্টা" },
        { title: "JavaScript এসেনশিয়ালস", lessons: 15, duration: "১০ ঘণ্টা" },
        { title: "React.js মাস্টারক্লাস", lessons: 12, duration: "৮ ঘণ্টা" },
        { title: "Node.js ব্যাকএন্ড ডেভেলপমেন্ট", lessons: 10, duration: "৬ ঘণ্টা" },
        { title: "ফাইনাল প্রজেক্ট", lessons: 5, duration: "৪ ঘণ্টা" },
      ],
      modules: [
        { title: "ওয়েব ডেভেলপমেন্টের পরিচিতি", lesson_count: 5 },
        { title: "HTML5 ফান্ডামেন্টালস", lesson_count: 8 },
        { title: "CSS3 এবং রেসপন্সিভ ডিজাইন", lesson_count: 10 },
        { title: "JavaScript এসেনশিয়ালস", lesson_count: 15 },
        { title: "React.js মাস্টারক্লাস", lesson_count: 12 },
        { title: "Node.js ব্যাকএন্ড ডেভেলপমেন্ট", lesson_count: 10 },
        { title: "ফাইনাল প্রজেক্ট", lesson_count: 5 },
      ],
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setIsEnrolled(false);
    }
  };

  const handleManualPaymentSuccess = (receiptNumber: string) => {
    alert(`পেমেন্ট জমা হয়েছে! আপনার রসিদ নং: ${receiptNumber}`);
    navigate(`/payment/status/${receiptNumber}`);
  };

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (isEnrolled) {
      navigate(`/courses/${id}/learn`);
    } else {
      navigate(`/enroll/${id}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course?.title,
        text: course?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('লিঙ্ক কপি করা হয়েছে!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">কোর্স লোড হচ্ছে...</p>
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
              <Button onClick={fetchCourseDetails}>
                আবার চেষ্টা করুন
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const courseTitle = course.title || course.name;
  const courseDescription = course.description || '';
  const courseImage = course.image_url || course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop';
  const instructorName = course.instructor?.name || course.instructor_name || 'প্রশিক্ষক';
  const instructorBio = course.instructor?.bio || course.instructor_bio || '';
  const price = course.price || 0;
  const originalPrice = course.original_price || course.price || 0;
  const category = course.category || 'অন্যান্য';
  const duration = course.duration || course.total_hours ? `${course.total_hours} ঘণ্টা` : '১০ ঘণ্টা';
  const students = course.students_count || course.enrollment_count || 0;
  const rating = course.rating || 4.5;
  const reviews = course.reviews_count || 0;
  const longDescription = course.long_description || course.description || '';
  const whatYouWillLearn = course.what_youll_learn || [];
  const curriculum = course.curriculum || course.modules || [];
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>{courseTitle} - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content={courseDescription} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-primary/10 to-background py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <Link to="/courses" className="inline-flex items-center text-foreground/70 hover:text-foreground transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  কোর্সে ফিরে যান
                </Link>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    শেয়ার করুন
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    সেভ করুন
                  </Button>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {category}
                    </span>
                    {discount > 0 && (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-sm font-bold">
                        {discount}% ছাড়
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm">
                      <Globe className="h-3 w-3" />
                      অনলাইন
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{courseTitle}</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">{courseDescription}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-foreground/80">
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({reviews} রিভিউ)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5" />
                      <span className="text-muted-foreground">{students.toLocaleString()} শিক্ষার্থী</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-5 w-5" />
                      <span className="text-muted-foreground">{duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-5 w-5" />
                      <span className="text-muted-foreground">ভিডিও লেসন</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {instructorName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">প্রশিক্ষক</p>
                      <p className="font-medium text-foreground">{instructorName}</p>
                    </div>
                  </div>
                </div>

                {/* Enrollment Card */}
                <div className="lg:row-span-2">
                  <div className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-xl sticky top-24 border border-border">
                    <div className="relative">
                      <img
                        src={courseImage}
                        alt={courseTitle}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop';
                        }}
                      />
                      {discount > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded bg-red-500 text-white text-sm font-bold shadow-lg">
                            {discount}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-foreground">৳{price.toLocaleString()}</span>
                        {originalPrice > price && (
                          <>
                            <span className="text-lg text-muted-foreground line-through">৳{originalPrice.toLocaleString()}</span>
                            <span className="px-2 py-1 rounded bg-success/10 text-success text-sm font-medium">
                              আপনি সেভ করছেন ৳{(originalPrice - price).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {loading ? (
                          <Button disabled variant="hero" size="lg" className="w-full">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            লোড হচ্ছে...
                          </Button>
                        ) : isEnrolled ? (
                          <Link to={`/courses/${course.id}/learn`}>
                            <Button variant="hero" size="lg" className="w-full">
                              <PlayCircle className="h-5 w-5 mr-2" />
                              কোর্স শুরু করুন
                            </Button>
                          </Link>
                        ) : (
                          <div className="space-y-3">
                            <Button 
                              variant="hero" 
                              size="lg" 
                              className="w-full"
                              onClick={handleEnrollClick}
                            >
                              এখনই এনরোল করুন
                            </Button>
                            
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t"></div>
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">বা</span>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full"
                              onClick={() => setShowManualPayment(true)}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              ম্যানুয়াল পেমেন্ট
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <PlayCircle className="h-5 w-5" />
                          {duration} ভিডিও কন্টেন্ট
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BookOpen className="h-5 w-5" />
                          আজীবন এক্সেস
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <FileText className="h-5 w-5" />
                          ডাউনলোডযোগ্য রিসোর্স
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Award className="h-5 w-5" />
                          সম্পন্ন করলেই সার্টিফিকেট
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Download className="h-5 w-5" />
                          অফলাইন এক্সেস
                        </div>
                      </div>

                      {/* Manual Payment Info */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">ম্যানুয়াল পেমেন্ট অপশন</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <span>bKash/Nagad/Rocket</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            <span>ব্যাংক ট্রান্সফার</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>ক্যাশ পেমেন্ট</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          পেমেন্ট সাবমিট করার পর ২৪ ঘণ্টার মধ্যে ভেরিফাই করা হবে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-12">
                  {/* What You'll Learn */}
                  {whatYouWillLearn.length > 0 && (
                    <div className="bg-card rounded-2xl border border-border p-6">
                      <h2 className="text-2xl font-bold text-foreground mb-6">আপনি যা শিখবেন</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {whatYouWillLearn.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* About */}
                  {longDescription && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">এই কোর্স সম্পর্কে</h2>
                      <div className="prose prose-lg max-w-none text-muted-foreground">
                        <p className="leading-relaxed whitespace-pre-line">{longDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* Curriculum */}
                  {curriculum.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-6">কোর্স কারিকুলাম</h2>
                      <div className="space-y-3">
                        {curriculum.map((section: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium text-foreground">{section.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {section.lesson_count || section.lessons || 0}টি লেসন • {section.duration || '১ ঘণ্টা'}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              প্রিভিউ
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructor */}
                  {(instructorName || instructorBio) && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-6">প্রশিক্ষক সম্পর্কে</h2>
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-2xl font-bold text-primary">
                            {instructorName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{instructorName}</h3>
                          <p className="text-muted-foreground mt-2">{instructorBio}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
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

export default CourseDetail;