import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, Target, Heart, Users } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>আমাদের সম্পর্কে - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="ক্যাম্পাসবন্ধু সম্পর্কে জানুন, বাংলাদেশের নিজস্ব অনলাইন শিক্ষা প্ল্যাটফর্ম যা বিশ্ববিদ্যালয় শিক্ষার্থীদের ক্ষমতায়নে নিবেদিত।" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <section className="py-20 gradient-hero">
            <div className="container mx-auto px-4 text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">আমাদের সম্পর্কে</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">বাংলাদেশি শিক্ষার্থীদের ক্ষমতায়ন</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">ক্যাম্পাসবন্ধু বাংলাদেশের নিজস্ব অনলাইন শিক্ষা প্ল্যাটফর্ম, বিশেষভাবে বিশ্ববিদ্যালয় শিক্ষার্থীদের জন্য তৈরি যারা নতুন দক্ষতা শিখে তাদের ক্যারিয়ার এগিয়ে নিতে চান।</p>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center"><Target className="h-7 w-7 text-primary" /></div>
                  <h2 className="text-2xl font-bold text-foreground">আমাদের মিশন</h2>
                  <p className="text-muted-foreground leading-relaxed">প্রতিটি বাংলাদেশি শিক্ষার্থীর জন্য মানসম্মত শিক্ষা সহজলভ্য এবং সাশ্রয়ী করা। আমরা বিশ্বাস করি আর্থিক বাধা কখনো শেখার পথে বাধা হওয়া উচিত নয়। বিকাশ, নগদ এবং রকেটের মতো সুবিধাজনক পেমেন্ট অপশন সহ শিক্ষার্থী-বান্ধব দামে কোর্স অফার করি।</p>
                </div>
                <div className="space-y-6">
                  <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center"><GraduationCap className="h-7 w-7 text-accent" /></div>
                  <h2 className="text-2xl font-bold text-foreground">আমাদের ভিশন</h2>
                  <p className="text-muted-foreground leading-relaxed">বাংলাদেশের শীর্ষ অনলাইন শিক্ষা প্ল্যাটফর্ম হওয়া, লক্ষ লক্ষ শিক্ষার্থীকে আধুনিক চাকরির বাজারে সফল হতে প্রয়োজনীয় দক্ষতা অর্জনে সাহায্য করা। আমরা এমন একটি ভবিষ্যৎ কল্পনা করি যেখানে প্রতিটি শিক্ষার্থী শেখার, বেড়ে ওঠার এবং তাদের স্বপ্ন পূরণের সুযোগ পায়।</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">আমাদের মূল্যবোধ</h2>
                <p className="text-muted-foreground">যে নীতিগুলো আমাদের সব কাজকে পরিচালিত করে</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Heart, title: "শিক্ষার্থী প্রথম", description: "আমাদের প্রতিটি সিদ্ধান্ত শিক্ষার্থীদের জন্য সর্বোত্তম কী তার উপর কেন্দ্রীভূত।" },
                  { icon: GraduationCap, title: "মানসম্মত শিক্ষা", description: "উচ্চ-মানের কোর্স কন্টেন্ট সরবরাহ করতে বিশেষজ্ঞ প্রশিক্ষকদের সাথে কাজ করি।" },
                  { icon: Users, title: "কমিউনিটি", description: "একটি সহায়ক শিক্ষা কমিউনিটি গড়ে তুলি যেখানে শিক্ষার্থীরা একে অপরকে সাহায্য করে।" },
                  { icon: Target, title: "সহজলভ্যতা", description: "সব পটভূমির শিক্ষার্থীদের জন্য শিক্ষা সহজলভ্য করতে প্রচেষ্টা করি।" },
                ].map((value, index) => (
                  <div key={index} className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><value.icon className="h-7 w-7 text-primary" /></div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { value: "৫,০০০+", label: "সক্রিয় শিক্ষার্থী" },
                  { value: "৫০+", label: "মানসম্মত কোর্স" },
                  { value: "২০+", label: "বিশেষজ্ঞ প্রশিক্ষক" },
                  { value: "৯৫%", label: "সাফল্যের হার" },
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
