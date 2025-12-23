import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Users, Star, Filter } from "lucide-react";

const allCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Rahim Ahmed",
    price: 1999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    category: "Web Development",
    duration: "40 hours",
    students: 1250,
    rating: 4.8,
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more from scratch.",
  },
  {
    id: 2,
    title: "Data Science with Python",
    instructor: "Fatima Khan",
    price: 2499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    category: "Data Science",
    duration: "35 hours",
    students: 890,
    rating: 4.9,
    description: "Master data analysis, visualization, and machine learning with Python.",
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    instructor: "Karim Hassan",
    price: 1499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    category: "Marketing",
    duration: "25 hours",
    students: 2100,
    rating: 4.7,
    description: "Complete guide to SEO, social media, content marketing, and PPC.",
  },
  {
    id: 4,
    title: "English for Professionals",
    instructor: "Sarah Begum",
    price: 999,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
    category: "Language",
    duration: "20 hours",
    students: 3200,
    rating: 4.6,
    description: "Improve your business English communication skills for the workplace.",
  },
  {
    id: 5,
    title: "BCS Preparation Complete Guide",
    instructor: "Dr. Abdul Karim",
    price: 1799,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
    category: "Exam Prep",
    duration: "60 hours",
    students: 5600,
    rating: 4.9,
    description: "Complete preparation for BCS preliminary, written, and viva exams.",
  },
  {
    id: 6,
    title: "Graphic Design Fundamentals",
    instructor: "Tahmina Akter",
    price: 1299,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop",
    category: "Design",
    duration: "30 hours",
    students: 1800,
    rating: 4.7,
    description: "Learn Adobe Photoshop, Illustrator, and UI/UX design principles.",
  },
];

const categories = ["All", "Web Development", "Data Science", "Marketing", "Language", "Exam Prep", "Design"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>All Courses - CampusBondhu</title>
        <meta name="description" content="Browse all courses available on CampusBondhu. Find the perfect course to boost your skills and career." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Explore Our Courses
              </h1>
              <p className="text-muted-foreground text-lg">
                Find the perfect course to advance your skills and career
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses or instructors..."
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
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
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
                      src={course.image}
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
                      by {course.instructor}
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
                        {course.students}
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
                        <span className="text-sm text-muted-foreground line-through">
                          ৳{course.originalPrice}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded bg-success/10 text-success text-xs font-medium">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                  Clear Filters
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
