// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, User, Eye, EyeOff, GraduationCap, Github, Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "নাম প্রয়োজন";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "ইমেইল প্রয়োজন";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "বৈধ ইমেইল ঠিকানা লিখুন";
    }
    
    if (!formData.password) {
      newErrors.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (formData.password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড মিলছে না";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.name);
    
    if (!error) {
      // Success - form will reset automatically via redirect
      console.log('✅ Registration successful');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    await signInWithGithub();
    setIsLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>রেজিস্টার - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="বিনামূল্যে ক্যাম্পাসবন্ধু অ্যাকাউন্ট খুলুন এবং আজই শেখা শুরু করুন।" />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Panel - Image */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center text-white space-y-6">
              <GraduationCap className="h-16 w-16 mx-auto" />
              <h2 className="text-4xl font-bold">ক্যাম্পাসবন্ধুতে যোগ দিন</h2>
              <p className="text-lg text-white/80">
                হাজার হাজার বাংলাদেশি শিক্ষার্থীর সাথে আপনার শেখার যাত্রা শুরু করুন।
              </p>
              
              <div className="space-y-4 pt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
                  <h3 className="font-semibold mb-2">কেন রেজিস্টার করবেন?</h3>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs">✓</span>
                      </div>
                      <span>বিনামূল্যে কোর্স অ্যাক্সেস</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs">✓</span>
                      </div>
                      <span>অগ্রগতি ট্র্যাক করুন</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs">✓</span>
                      </div>
                      <span>সার্টিফিকেট পান</span>
                    </li>
                  </ul>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">
                ক্যাম্পাস<span className="text-blue-600">বন্ধু</span>
              </span>
            </Link>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">অ্যাকাউন্ট তৈরি করুন</h1>
              <p className="mt-2 text-gray-600">
                শিক্ষার্থী হিসেবে যোগ দিন এবং আজই শেখা শুরু করুন
              </p>
            </div>

            {/* Social Registration Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full hover:bg-gray-50"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-5 w-5" />
                Google দিয়ে রেজিস্টার করুন
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full hover:bg-gray-50"
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub দিয়ে রেজিস্টার করুন
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  অথবা ইমেইল দিয়ে রেজিস্টার করুন
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">পূর্ণ নাম</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="আপনার পূর্ণ নাম"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-10 h-12 ${errors.name ? 'border-red-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল ঠিকানা</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 h-12 ${errors.email ? 'border-red-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    কমপক্ষে ৬ অক্ষরের হতে হবে
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  রেজিস্টার করার পর ইমেইল যাচাই করার জন্য একটি লিংক পাবেন।
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    অ্যাকাউন্ট তৈরি হচ্ছে...
                  </>
                ) : (
                  "অ্যাকাউন্ট তৈরি করুন"
                )}
              </Button>
            </form>

            <p className="text-center text-gray-600">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                এখানে লগইন করুন
              </Link>
            </p>

            <div className="text-xs text-gray-500 text-center pt-4 border-t">
              <p>
                রেজিস্টার করে আপনি আমাদের{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">সেবার শর্তাবলী</Link> এবং{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">গোপনীয়তা নীতি</Link> মেনে নিচ্ছেন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;