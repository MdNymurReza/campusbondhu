// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle,
  User,
  LogOut,
  Home,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      fetchEnrolledCourses();
    }
  }, [user, authLoading]);

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    try {
      console.log("Fetching enrollments for user:", user.id);
      
      // Fetch user's enrollments with courses
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('user_id', user.id);

      if (enrollmentsError) {
        console.error("Enrollments fetch error:", enrollmentsError);
        throw enrollmentsError;
      }

      console.log("Enrollments data:", enrollments);

      // Transform data to match the component's structure
      const formattedCourses = (enrollments || []).map((enrollment: any) => ({
        id: enrollment.course_id || enrollment.id,
        title: enrollment.courses?.title || 'Unknown Course',
        instructor: enrollment.courses?.instructor_name || 'Unknown Instructor',
        image: enrollment.courses?.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
        progress: enrollment.progress || 0,
        status: enrollment.status || 'pending',
        lastAccessed: enrollment.last_accessed ? new Date(enrollment.last_accessed).toLocaleDateString('bn-BD') : 'কখনও না',
        enrolled_at: enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString('bn-BD') : 'তারিখ অজানা',
      }));

      setEnrolledCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      // Fallback to mock data if API fails
      setEnrolledCourses([
        {
          id: 1,
          title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
          instructor: "রহিম আহমেদ",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
          progress: 45,
          status: "approved",
          lastAccessed: "২ দিন আগে",
          enrolled_at: "২০২৪-১২-১৫",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" />
            অনুমোদিত
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            <Clock className="h-3 w-3" />
            অপেক্ষমাণ
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            <AlertCircle className="h-3 w-3" />
            প্রত্যাখ্যাত
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate stats
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;
  const averageProgress = totalCourses > 0 
    ? enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses 
    : 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={12} />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">লগইন প্রয়োজন</h1>
            <p className="text-gray-600 mb-6">এই পৃষ্ঠাটি দেখতে আপনাকে লগইন করতে হবে</p>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                লগইন করুন
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'ব্যবহারকারী';
  const userEmail = user.email || '';

  return (
    <>
      <Helmet>
        <title>ড্যাশবোর্ড - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="আপনার এনরোল করা কোর্স দেখুন এবং ক্যাম্পাসবন্ধুতে আপনার শেখার অগ্রগতি ট্র্যাক করুন।" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">স্বাগতম, {userName}!</h1>
              <p className="text-gray-600 mt-2">আপনার শেখার যাত্রা এখান থেকে শুরু করুন</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">মোট কোর্স</p>
                    <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">সম্পন্ন</p>
                    <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">চলমান</p>
                    <p className="text-2xl font-bold text-gray-900">{inProgressCourses}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">গড় অগ্রগতি</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(averageProgress)}%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-white rounded-2xl border p-6 sticky top-24">
                  {/* User Info */}
                  <div className="text-center mb-6 pb-6 border-b">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
                    >
                      <BookOpen className="h-5 w-5" />
                      আমার কোর্স
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      প্রোফাইল
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      হোমপেজ
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      লগআউট
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">আমার কোর্স</h1>
                    <p className="text-gray-600">আপনার এনরোল করা কোর্স এবং অগ্রগতি ট্র্যাক করুন</p>
                  </div>
                  <Link to="/courses">
                    <Button variant="outline">আরও কোর্স দেখুন</Button>
                  </Link>
                </div>

                {/* Course Cards */}
                <div className="grid gap-6">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 sm:h-auto relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          {course.status !== "approved" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-medium">লক করা</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                              <p className="text-sm text-gray-500">প্রশিক্ষক: {course.instructor}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  এনরোল: {course.enrolled_at}
                                </span>
                                <span className="text-xs text-gray-500">
                                  সর্বশেষ: {course.lastAccessed}
                                </span>
                              </div>
                            </div>
                            {getStatusBadge(course.status)}
                          </div>

                          {course.status === "approved" ? (
                            <>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-500">অগ্রগতি</span>
                                  <span className="font-medium text-gray-900">{course.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                  সম্পন্ন: {course.progress}%
                                </span>
                                <Link to={`/courses/${course.id}`}>
                                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    কোর্স দেখুন
                                  </Button>
                                </Link>
                              </div>
                            </>
                          ) : course.status === "pending" ? (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                আপনার পেমেন্ট যাচাই করা হচ্ছে। অনুমোদন হলে এক্সেস পাবেন।
                              </p>
                              <div className="flex items-center gap-2">
                                <Link to={`/courses/${course.id}`}>
                                  <Button variant="outline" size="sm">
                                    কোর্স বিস্তারিত
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">
                                আপনার পেমেন্ট প্রত্যাখ্যাত হয়েছে। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন অথবা আবার চেষ্টা করুন।
                              </p>
                              <Link to={`/courses/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  পুনরায় চেষ্টা করুন
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {enrolledCourses.length === 0 && (
                  <div className="bg-white rounded-2xl border p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">কোনো কোর্স নেই</h3>
                    <p className="text-gray-600 mb-6">
                      আপনি এখনও কোনো কোর্সে এনরোল করেননি। আজই আপনার শেখার যাত্রা শুরু করুন!
                    </p>
                    <div className="space-y-3">
                      <Link to="/courses">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          কোর্স ব্রাউজ করুন
                        </Button>
                      </Link>
                      <p className="text-sm text-gray-500">
                        বা ড্যাশবোর্ড আপডেটের জন্য রিফ্রেশ করুন
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={fetchEnrolledCourses}
                        className="mt-2"
                      >
                        রিফ্রেশ করুন
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;