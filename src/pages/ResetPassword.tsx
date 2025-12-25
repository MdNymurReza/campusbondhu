import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if we have a valid reset token
    const checkToken = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate('/login');
      } else {
        setIsValid(true);
      }
    };
    
    checkToken();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("পাসওয়ার্ড মিলছে না");
      return;
    }
    
    if (password.length < 6) {
      alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    
    setIsLoading(true);
    const { error } = await updatePassword(password);
    
    if (!error) {
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
    
    setIsLoading(false);
  };

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ভ্যালিডেশন চলছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">নতুন পাসওয়ার্ড সেট করুন</h1>
          <p className="mt-2 text-gray-600">
            আপনার নতুন পাসওয়ার্ড লিখুন
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">পাসওয়ার্ড আপডেট হয়েছে!</h2>
            <p className="text-gray-600">
              আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। লগইন পেজে রিডাইরেক্ট করা হচ্ছে...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">কমপক্ষে ৬ অক্ষরের হতে হবে</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;