// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff, Github, Chrome, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = "ইমেইল প্রয়োজন";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "বৈধ ইমেইল ঠিকানা লিখুন";
    }
    
    if (!password) {
      newErrors.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (!error) {
      // Success - navigation will happen via AuthContext
      console.log('✅ Login successful');
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
        <title>লগইন - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="আপনার ক্যাম্পাসবন্ধু অ্যাকাউন্টে লগইন করুন এবং শেখা চালিয়ে যান।" />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 justify-center group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-md group-hover:shadow-lg transition-shadow">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">
                ক্যাম্পাস<span className="text-blue-600">বন্ধু</span>
              </span>
            </Link>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">স্বাগতম!</h1>
              <p className="mt-2 text-gray-600">
                আপনার শেখার যাত্রা চালিয়ে যেতে লগইন করুন
              </p>
            </div>

            {/* Social Login Buttons */}
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
                Google দিয়ে লগইন করুন
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
                GitHub দিয়ে লগইন করুন
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  অথবা ইমেইল দিয়ে লগইন করুন
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল ঠিকানা</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
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
                <div className="flex justify-between">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={`pl-10 pr-10 h-12 ${errors.password ? 'border-red-500' : ''}`}
                    required
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
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    লগইন হচ্ছে...
                  </>
                ) : (
                  <>
                    লগইন
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Email confirmation notice */}
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>ইমেইল যাচাই করেননি?</strong> লগইন করতে সমস্যা হলে{' '}
                <Link to="/auth/confirm" className="text-blue-600 hover:underline font-medium">
                  এখানে ক্লিক করুন
                </Link>
              </AlertDescription>
            </Alert>

            <p className="text-center text-gray-600">
              অ্যাকাউন্ট নেই?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                এখানে রেজিস্টার করুন
              </Link>
            </p>

            {/* Admin Login Link */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                আপনি কি অ্যাডমিন?{" "}
                <Link to="/admin/login" className="text-blue-600 font-medium hover:underline">
                  অ্যাডমিন লগইন
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center text-white space-y-6">
              <h2 className="text-4xl font-bold">শেখা চালিয়ে যান</h2>
              <p className="text-lg text-white/80">
                যেখানে ছেড়েছিলেন সেখান থেকে শুরু করুন। আপনার কোর্স এবং অগ্রগতি আপনার জন্য অপেক্ষা করছে।
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">৫০+ কোর্স</p>
                    <p className="text-sm text-white/70">এক্সপ্লোর করার জন্য</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg font-bold">৳</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">সহজ পেমেন্ট</p>
                    <p className="text-sm text-white/70">বিকাশ, নগদ, রকেট</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;