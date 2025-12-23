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
  Settings,
  LogOut
} from "lucide-react";

// Mock data
const enrolledCourses = [
  {
    id: 1,
    title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
    instructor: "রহিম আহমেদ",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    progress: 45,
    status: "approved",
    lastAccessed: "২ দিন আগে",
  },
  {
    id: 2,
    title: "পাইথনে ডাটা সায়েন্স",
    instructor: "ফাতিমা খান",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    progress: 0,
    status: "pending",
    lastAccessed: null,
  },
  {
    id: 3,
    title: "ডিজিটাল মার্কেটিং মাস্টারক্লাস",
    instructor: "করিম হাসান",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    progress: 0,
    status: "rejected",
    lastAccessed: null,
  },
];

const Dashboard = () => {
  const user = {
    name: "আহমেদ রহমান",
    email: "ahmed@example.com",
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" />
            অনুমোদিত
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
            <Clock className="h-3 w-3" />
            অপেক্ষমাণ
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
            <AlertCircle className="h-3 w-3" />
            প্রত্যাখ্যাত
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>ড্যাশবোর্ড - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="আপনার এনরোল করা কোর্স দেখুন এবং ক্যাম্পাসবন্ধুতে আপনার শেখার অগ্রগতি ট্র্যাক করুন।" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  {/* User Info */}
                  <div className="text-center mb-6 pb-6 border-b border-border">
                    <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                    >
                      <BookOpen className="h-5 w-5" />
                      আমার কোর্স
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <User className="h-5 w-5" />
                      প্রোফাইল
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      সেটিংস
                    </Link>
                    <button
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
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
                    <h1 className="text-2xl font-bold text-foreground">আমার কোর্স</h1>
                    <p className="text-muted-foreground">আপনার এনরোল করা কোর্স এবং অগ্রগতি ট্র্যাক করুন</p>
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
                      className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 sm:h-auto relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          {course.status !== "approved" && (
                            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                              <span className="text-background font-medium">লক করা</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">প্রশিক্ষক: {course.instructor}</p>
                            </div>
                            {getStatusBadge(course.status)}
                          </div>

                          {course.status === "approved" ? (
                            <>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">অগ্রগতি</span>
                                  <span className="font-medium text-foreground">{course.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  সর্বশেষ এক্সেস: {course.lastAccessed}
                                </span>
                                <Link to={`/learn/${course.id}`}>
                                  <Button size="sm">
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    শেখা চালিয়ে যান
                                  </Button>
                                </Link>
                              </div>
                            </>
                          ) : course.status === "pending" ? (
                            <p className="text-sm text-muted-foreground">
                              আপনার পেমেন্ট যাচাই করা হচ্ছে। অনুমোদন হলে এক্সেস পাবেন।
                            </p>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                আপনার পেমেন্ট প্রত্যাখ্যাত হয়েছে। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন অথবা আবার চেষ্টা করুন।
                              </p>
                              <Link to={`/enroll/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  পুনরায় পেমেন্ট করুন
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
                  <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">কোনো কোর্স নেই</h3>
                    <p className="text-muted-foreground mb-4">
                      আপনি এখনও কোনো কোর্সে এনরোল করেননি। আজই আপনার শেখার যাত্রা শুরু করুন!
                    </p>
                    <Link to="/courses">
                      <Button variant="hero">কোর্স দেখুন</Button>
                    </Link>
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
