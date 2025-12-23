import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Star } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
    instructor: "রহিম আহমেদ",
    price: 1999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    category: "ওয়েব ডেভেলপমেন্ট",
    duration: "৪০ ঘণ্টা",
    students: 1250,
    rating: 4.8,
  },
  {
    id: 2,
    title: "পাইথনে ডাটা সায়েন্স",
    instructor: "ফাতিমা খান",
    price: 2499,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    category: "ডাটা সায়েন্স",
    duration: "৩৫ ঘণ্টা",
    students: 890,
    rating: 4.9,
  },
  {
    id: 3,
    title: "ডিজিটাল মার্কেটিং মাস্টারক্লাস",
    instructor: "করিম হাসান",
    price: 1499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    category: "মার্কেটিং",
    duration: "২৫ ঘণ্টা",
    students: 2100,
    rating: 4.7,
  },
];

const CoursesPreview = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              জনপ্রিয় কোর্স
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              আজই শেখা শুরু করুন
            </h2>
          </div>
          <Link to="/courses">
            <Button variant="outline" className="group">
              সব কোর্স দেখুন
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
                <p className="text-sm text-muted-foreground mb-4">
                  প্রশিক্ষক: {course.instructor}
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
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% ছাড়
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
