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
    title: "Complete Web Development Bootcamp",
    instructor: "Rahim Ahmed",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    progress: 45,
    status: "approved",
    lastAccessed: "2 days ago",
  },
  {
    id: 2,
    title: "Data Science with Python",
    instructor: "Fatima Khan",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    progress: 0,
    status: "pending",
    lastAccessed: null,
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    instructor: "Karim Hassan",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    progress: 0,
    status: "rejected",
    lastAccessed: null,
  },
];

const Dashboard = () => {
  const user = {
    name: "Ahmed Rahman",
    email: "ahmed@example.com",
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
            <AlertCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - CampusBondhu</title>
        <meta name="description" content="View your enrolled courses and track your learning progress on CampusBondhu." />
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
                      My Courses
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
                    <p className="text-muted-foreground">Track your enrolled courses and progress</p>
                  </div>
                  <Link to="/courses">
                    <Button variant="outline">Browse More Courses</Button>
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
                              <span className="text-background font-medium">Locked</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                            </div>
                            {getStatusBadge(course.status)}
                          </div>

                          {course.status === "approved" ? (
                            <>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Progress</span>
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
                                  Last accessed: {course.lastAccessed}
                                </span>
                                <Link to={`/learn/${course.id}`}>
                                  <Button size="sm">
                                    <PlayCircle className="mr-2 h-4 w-4" />
                                    Continue Learning
                                  </Button>
                                </Link>
                              </div>
                            </>
                          ) : course.status === "pending" ? (
                            <p className="text-sm text-muted-foreground">
                              Your payment is being verified. You'll receive access once approved.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Your payment was rejected. Please contact support or try again.
                              </p>
                              <Link to={`/enroll/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  Retry Payment
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
                    <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any courses yet. Start your learning journey today!
                    </p>
                    <Link to="/courses">
                      <Button variant="hero">Browse Courses</Button>
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
