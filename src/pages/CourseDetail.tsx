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
    title: "Complete Web Development Bootcamp",
    instructor: "Rahim Ahmed",
    instructorBio: "Senior Software Engineer with 10+ years of experience at top tech companies.",
    price: 1999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    category: "Web Development",
    duration: "40 hours",
    students: 1250,
    rating: 4.8,
    reviews: 342,
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more from scratch. This comprehensive bootcamp will take you from complete beginner to a job-ready web developer.",
    longDescription: "This course is designed to teach you everything you need to become a professional web developer. You'll start with the basics of HTML and CSS, then move on to JavaScript, React, and backend development with Node.js. By the end of this course, you'll be able to build full-stack web applications from scratch.",
    whatYouWillLearn: [
      "Build responsive websites using HTML5 and CSS3",
      "Master JavaScript ES6+ and modern best practices",
      "Create dynamic React applications with hooks",
      "Build RESTful APIs with Node.js and Express",
      "Work with databases like MongoDB and PostgreSQL",
      "Deploy applications to cloud platforms",
    ],
    curriculum: [
      { title: "Introduction to Web Development", lessons: 5, duration: "2 hours" },
      { title: "HTML5 Fundamentals", lessons: 8, duration: "4 hours" },
      { title: "CSS3 and Responsive Design", lessons: 10, duration: "6 hours" },
      { title: "JavaScript Essentials", lessons: 15, duration: "10 hours" },
      { title: "React.js Masterclass", lessons: 12, duration: "8 hours" },
      { title: "Node.js Backend Development", lessons: 10, duration: "6 hours" },
      { title: "Final Project", lessons: 5, duration: "4 hours" },
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
            <h1 className="text-2xl font-bold text-foreground mb-4">Course not found</h1>
            <Link to="/courses">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
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
        <title>{course.title} - CampusBondhu</title>
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
                Back to Courses
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
                      <span>({course.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5" />
                      {course.students} students
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-5 w-5" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <p className="text-background/70">
                    Instructor: <span className="text-background font-medium">{course.instructor}</span>
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
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                      
                      <Link to={`/enroll/${course.id}`}>
                        <Button variant="hero" size="lg" className="w-full">
                          Enroll Now
                        </Button>
                      </Link>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <PlayCircle className="h-5 w-5" />
                          {course.duration} of video content
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BookOpen className="h-5 w-5" />
                          Lifetime access
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Award className="h-5 w-5" />
                          Certificate on completion
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
                    <h2 className="text-2xl font-bold text-foreground mb-6">What You'll Learn</h2>
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
                    <h2 className="text-2xl font-bold text-foreground mb-4">About This Course</h2>
                    <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
                  </div>

                  {/* Curriculum */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Course Curriculum</h2>
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
                                {section.lessons} lessons • {section.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">About the Instructor</h2>
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
