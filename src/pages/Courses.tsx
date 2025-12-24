// src/pages/Courses.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Users, Star, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const categories = ["সব", "ওয়েব ডেভেলপমেন্ট", "ডাটা সায়েন্স", "মার্কেটিং", "ভাষা", "পরীক্ষা প্রস্তুতি", "ডিজাইন"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to mock data
      setCourses([
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
        },
        // ... other courses
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "সব" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={12} />
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
            <p className="text-muted-foreground mb-6">
              {filteredCourses.length}টি কোর্স দেখানো হচ্ছে
            </p>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {course.category}
                      </span>
                    </div>
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
                        {course.students_count}
                      </div>
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="h-4 w-4 fill-current" />
                        {course.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">
                          ৳{course.price}
                        </span>
                        {course.original_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ৳{course.original_price}
                          </span>
                        )}
                      </div>
                      {course.original_price && (
                        <span className="px-2 py-1 rounded bg-success/10 text-success text-xs font-medium">
                          {Math.round((1 - course.price / course.original_price) * 100)}% ছাড়
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো কোর্স পাওয়া যায়নি।</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("সব"); }}>
                  ফিল্টার মুছুন
                </Button>
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