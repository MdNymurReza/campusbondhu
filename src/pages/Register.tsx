import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, User, ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "পাসওয়ার্ড মিলছে না",
        description: "অনুগ্রহ করে নিশ্চিত করুন দুটি পাসওয়ার্ড একই।",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual registration
    setTimeout(() => {
      toast({
        title: "রেজিস্ট্রেশন ফিচার শীঘ্রই আসছে!",
        description: "ব্যাকএন্ড অথেন্টিকেশন শীঘ্রই সক্রিয় করা হবে।",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>রেজিস্টার - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="বিনামূল্যে ক্যাম্পাসবন্ধু অ্যাকাউন্ট খুলুন এবং আজই শেখা শুরু করুন।" />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Panel - Image */}
        <div className="hidden lg:flex flex-1 relative gradient-primary">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center text-primary-foreground space-y-6">
              <GraduationCap className="h-16 w-16 mx-auto" />
              <h2 className="text-4xl font-bold">ক্যাম্পাসবন্ধুতে যোগ দিন</h2>
              <p className="text-lg text-primary-foreground/80">
                হাজার হাজার বাংলাদেশি শিক্ষার্থীর সাথে আপনার শেখার যাত্রা শুরু করুন। সাশ্রয়ী মূল্যে মানসম্মত কোর্সে এক্সেস পান।
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">৫K+</p>
                  <p className="text-sm text-primary-foreground/70">শিক্ষার্থী</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">৫০+</p>
                  <p className="text-sm text-primary-foreground/70">কোর্স</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">২০+</p>
                  <p className="text-sm text-primary-foreground/70">প্রশিক্ষক</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">৯৫%</p>
                  <p className="text-sm text-primary-foreground/70">সাফল্য</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 justify-center group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-md group-hover:shadow-glow transition-shadow">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                ক্যাম্পাস<span className="text-primary">বন্ধু</span>
              </span>
            </Link>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">অ্যাকাউন্ট তৈরি করুন</h1>
              <p className="mt-2 text-muted-foreground">
                শিক্ষার্থী হিসেবে যোগ দিন এবং আজই শেখা শুরু করুন
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">পূর্ণ নাম</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="আপনার পূর্ণ নাম"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল ঠিকানা</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-12"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "অ্যাকাউন্ট তৈরি হচ্ছে..."
                ) : (
                  <>
                    অ্যাকাউন্ট তৈরি করুন
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-muted-foreground">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                এখানে লগইন করুন
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              অ্যাকাউন্ট তৈরি করে আপনি আমাদের{" "}
              <Link to="/terms" className="text-primary hover:underline">
                সেবার শর্তাবলী
              </Link>{" "}
              এবং{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                গোপনীয়তা নীতিতে
              </Link>{" "}
              সম্মত হচ্ছেন
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
