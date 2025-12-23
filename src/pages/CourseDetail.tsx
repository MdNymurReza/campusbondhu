import { useParams, Link } from "react-router-dom";
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
  Lock
} from "lucide-react";

// Mock course data
const courseData = {
  1: {
    id: 1,
    title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
    instructor: "রহিম আহমেদ",
    instructorBio: "শীর্ষ টেক কোম্পানিতে ১০+ বছরের অভিজ্ঞতাসম্পন্ন সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার।",
    price: 1999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    category: "ওয়েব ডেভেলপমেন্ট",
    duration: "৪০ ঘণ্টা",
    students: 1250,
    rating: 4.8,
    reviews: 342,
    description: "শুরু থেকে HTML, CSS, JavaScript, React, Node.js এবং আরও অনেক কিছু শিখুন। এই সম্পূর্ণ বুটক্যাম্প আপনাকে সম্পূর্ণ নতুন থেকে চাকরি-প্রস্তুত ওয়েব ডেভেলপারে রূপান্তরিত করবে।",
    longDescription: "এই কোর্সটি পেশাদার ওয়েব ডেভেলপার হতে আপনার যা দরকার সবকিছু শেখানোর জন্য ডিজাইন করা হয়েছে। আপনি HTML এবং CSS এর মূল বিষয়গুলো দিয়ে শুরু করবেন, তারপর JavaScript, React এবং Node.js দিয়ে ব্যাকএন্ড ডেভেলপমেন্টে যাবেন। এই কোর্সের শেষে, আপনি শুরু থেকে ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন তৈরি করতে সক্ষম হবেন।",
    whatYouWillLearn: [
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
  },
};

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseData[Number(id) as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">কোর্স পাওয়া যায়নি</h1>
            <Link to="/courses">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                কোর্সে ফিরে যান
              </Button>
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
        <title>{course.title} - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-foreground text-background py-12">
            <div className="container mx-auto px-4">
              <Link to="/courses" className="inline-flex items-center text-background/70 hover:text-background mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                কোর্সে ফিরে যান
              </Link>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {course.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                  <p className="text-lg text-background/80">{course.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-background/80">
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-semibold text-background">{course.rating}</span>
                      <span>({course.reviews} রিভিউ)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5" />
                      {course.students} শিক্ষার্থী
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-5 w-5" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <p className="text-background/70">
                    প্রশিক্ষক: <span className="text-background font-medium">{course.instructor}</span>
                  </p>
                </div>

                {/* Enrollment Card */}
                <div className="lg:row-span-2">
                  <div className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-xl sticky top-24">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">৳{course.price}</span>
                        <span className="text-lg text-muted-foreground line-through">৳{course.originalPrice}</span>
                        <span className="px-2 py-1 rounded bg-success/10 text-success text-sm font-medium">
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% ছাড়
                        </span>
                      </div>
                      
                      <Link to={`/enroll/${course.id}`}>
                        <Button variant="hero" size="lg" className="w-full">
                          এখনই এনরোল করুন
                        </Button>
                      </Link>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <PlayCircle className="h-5 w-5" />
                          {course.duration} ভিডিও কন্টেন্ট
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BookOpen className="h-5 w-5" />
                          আজীবন এক্সেস
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Award className="h-5 w-5" />
                          সম্পন্ন করলেই সার্টিফিকেট
                        </div>
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
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="text-2xl font-bold text-foreground mb-6">আপনি যা শিখবেন</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* About */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">এই কোর্স সম্পর্কে</h2>
                    <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
                  </div>

                  {/* Curriculum */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">কোর্স কারিকুলাম</h2>
                    <div className="space-y-3">
                      {course.curriculum.map((section, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted rounded-xl"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{section.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {section.lessons}টি লেসন • {section.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">প্রশিক্ষক সম্পর্কে</h2>
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {course.instructor.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{course.instructor}</h3>
                        <p className="text-muted-foreground">{course.instructorBio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CourseDetail;
