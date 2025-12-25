// src/pages/Courses.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Changed from Link to useNavigate
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Users, Star, Filter, BookOpen, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const categories = ["সব", "ওয়েব ডেভেলপমেন্ট", "ডাটা সায়েন্স", "মার্কেটিং", "ভাষা", "পরীক্ষা প্রস্তুতি", "ডিজাইন"];

const Courses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true) // Only fetch published courses
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      
      console.log('Fetched courses:', data); // Debug log
      
      if (!data || data.length === 0) {
        // No courses in database, use fallback
        setError('ডাটাবেসে কোনো কোর্স পাওয়া যায়নি। ডেমো ডেটা দেখানো হচ্ছে।');
        setCourses(getFallbackCourses());
      } else {
        // Transform database data to match expected format
        const transformedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.title || 'কোর্সের শিরোনাম নেই',
          instructor_name: course.instructor_name || course.instructor || 'প্রশিক্ষক',
          price: course.price || 0,
          original_price: course.original_price || course.price || 0,
          image_url: course.image_url || course.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
          category: course.category || 'অন্যান্য',
          duration: course.duration || course.total_hours ? `${course.total_hours} ঘণ্টা` : '১০ ঘণ্টা',
          students_count: course.students_count || course.enrollment_count || 0,
          rating: course.rating || 4.5,
          description: course.description || course.short_description || 'কোর্সের বিস্তারিত বিবরণ পাওয়া যায়নি।',
          slug: course.slug || course.id.toString(),
          is_published: course.is_published || true
        }));
        
        setCourses(transformedCourses);
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(`কোর্স লোড করতে সমস্যা: ${error.message}`);
      setCourses(getFallbackCourses());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCourses = () => {
    return [
      {
        id: 1,
        title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
        instructor_name: "রহিম আহমেদ",
        price: 1999,
        original_price: 4999,
        image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
        category: "ওয়েব ডেভেলপমেন্ট",
        duration: "৪০ ঘণ্টা",
        students_count: 1250,
        rating: 4.8,
        description: "শুরু থেকে HTML, CSS, JavaScript, React, Node.js এবং আরও অনেক কিছু শিখুন।",
        slug: "web-development-bootcamp"
      },
      {
        id: 2,
        title: "পাইথন দিয়ে ডাটা সায়েন্স",
        instructor_name: "সাজেদা খাতুন",
        price: 1499,
        original_price: 2999,
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        category: "ডাটা সায়েন্স",
        duration: "৩৫ ঘণ্টা",
        students_count: 890,
        rating: 4.7,
        description: "পাইথন ব্যবহার করে ডাটা এনালাইসিস, মেশিন লার্নিং এবং ডাটা ভিজুয়ালাইজেশন শিখুন।",
        slug: "python-data-science"
      },
      {
        id: 3,
        title: "ডিজিটাল মার্কেটিং মাস্টারক্লাস",
        instructor_name: "আরিফুল ইসলাম",
        price: 999,
        original_price: 1999,
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
        category: "মার্কেটিং",
        duration: "৩০ ঘণ্টা",
        students_count: 1560,
        rating: 4.6,
        description: "সোশ্যাল মিডিয়া মার্কেটিং, SEO, কন্টেন্ট মার্কেটিং এবং ইমেইল মার্কেটিং শিখুন।",
        slug: "digital-marketing-masterclass"
      },
      {
        id: 4,
        title: "ইংরেজি ভাষা দক্ষতা উন্নয়ন",
        instructor_name: "ফারহানা ইয়াসমিন",
        price: 799,
        original_price: 1499,
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
        category: "ভাষা",
        duration: "২৫ ঘণ্টা",
        students_count: 2100,
        rating: 4.9,
        description: "ইংরেজি ভাষায় দক্ষতা বৃদ্ধি করুন: স্পিকিং, রাইটিং, লিসেনিং এবং রিডিং।",
        slug: "english-language-skills"
      },
      {
        id: 5,
        title: "গ্রাফিক ডিজাইন ফান্ডামেন্টালস",
        instructor_name: "তানভির হাসান",
        price: 1299,
        original_price: 2499,
        image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
        category: "ডিজাইন",
        duration: "২৮ ঘণ্টা",
        students_count: 740,
        rating: 4.5,
        description: "Adobe Photoshop, Illustrator এবং Figma ব্যবহার করে গ্রাফিক ডিজাইন শিখুন।",
        slug: "graphic-design-fundamentals"
      },
      {
        id: 6,
        title: "বিসিএস প্রস্তুতি: বাংলা ভাষা ও সাহিত্য",
        instructor_name: "ড. মোঃ শহীদুল্লাহ",
        price: 599,
        original_price: 999,
        image_url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop",
        category: "পরীক্ষা প্রস্তুতি",
        duration: "২০ ঘণ্টা",
        students_count: 3200,
        rating: 4.8,
        description: "বিসিএস পরীক্ষার জন্য বাংলা ভাষা ও সাহিত্যের সম্পূর্ণ প্রস্তুতি গাইড।",
        slug: "bcs-bangla-preparation"
      }
    ];
  };

  const handleCourseClick = (course: any) => {
    console.log('Navigating to course:', {
      id: course.id,
      slug: course.slug,
      title: course.title
    });
    
    // Try slug first, fallback to ID
    const courseIdentifier = course.slug || course.id;
    navigate(`/courses/${courseIdentifier}`);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "সব" || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={12} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>সব কোর্স - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="ক্যাম্পাসবন্ধুতে উপলব্ধ সব কোর্স দেখুন। আপনার দক্ষতা এবং ক্যারিয়ার উন্নত করতে সঠিক কোর্সটি খুঁজুন।" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                আমাদের কোর্সসমূহ দেখুন
              </h1>
              <p className="text-muted-foreground text-lg">
                আপনার দক্ষতা এবং ক্যারিয়ার উন্নত করতে সঠিক কোর্সটি খুঁজুন
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 text-sm">{error}</p>
                  <Button 
                    variant="link" 
                    className="text-yellow-700 p-0 h-auto mt-1" 
                    onClick={fetchCourses}
                  >
                    আবার চেষ্টা করুন
                  </Button>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="কোর্স বা প্রশিক্ষক খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <BookOpen className="h-4 w-4 inline mr-2" />
                {filteredCourses.length}টি কোর্স দেখানো হচ্ছে
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("সব");
                }}
                disabled={!searchQuery && selectedCategory === "সব"}
              >
                ফিল্টার মুছুন
              </Button>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {course.category}
                      </span>
                    </div>
                    {course.original_price > course.price && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded bg-red-500 text-white text-xs font-bold">
                          {Math.round((1 - course.price / course.original_price) * 100)}% ছাড়
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      প্রশিক্ষক: {course.instructor_name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students_count.toLocaleString()} জন
                      </div>
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="h-4 w-4 fill-current" />
                        {course.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">
                          ৳{course.price.toLocaleString()}
                        </span>
                        {course.original_price > course.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ৳{course.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="transition-all group-hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course);
                        }}
                      >
                        বিস্তারিত দেখুন
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg mb-4">
                  ❌ আপনার অনুসন্ধানের সাথে মিলে এমন কোনো কোর্স পাওয়া যায়নি।
                </div>
                <div className="space-x-3">
                  <Button variant="default" onClick={() => { setSearchQuery(""); setSelectedCategory("সব"); }}>
                    সব কোর্স দেখুন
                  </Button>
                  <Button variant="outline" onClick={fetchCourses}>
                    রিফ্রেশ করুন
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Courses;