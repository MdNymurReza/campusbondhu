import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, BookOpen, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              বাংলাদেশের নিজস্ব শিক্ষা প্ল্যাটফর্ম
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              দক্ষতা শিখুন যা
              <span className="block text-gradient">ভবিষ্যৎ গড়বে</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              হাজার হাজার বাংলাদেশি শিক্ষার্থীর সাথে নতুন দক্ষতা অর্জন করুন। মানসম্মত কোর্স, বিশেষজ্ঞ প্রশিক্ষক এবং নমনীয় শিক্ষা - সবকিছু সাশ্রয়ী মূল্যে।
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  শিক্ষার্থী হিসেবে যোগ দিন
                  <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  <Play className="mr-1 h-5 w-5" />
                  কোর্স দেখুন
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">৫,০০০+</p>
                  <p className="text-sm text-muted-foreground">সক্রিয় শিক্ষার্থী</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">৫০+</p>
                  <p className="text-sm text-muted-foreground">মানসম্মত কোর্স</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">৯৫%</p>
                  <p className="text-sm text-muted-foreground">সাফল্যের হার</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="শিক্ষার্থীরা একসাথে শিখছে"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border animate-slide-in">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">সার্টিফিকেট প্রস্তুত</p>
                    <p className="text-xs text-muted-foreground">সম্পন্ন করলেই সার্টিফিকেট</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border animate-slide-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">আজীবন এক্সেস</p>
                    <p className="text-xs text-muted-foreground">নিজের গতিতে শিখুন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
