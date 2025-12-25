import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setIsSent(true);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">পাসওয়ার্ড রিসেট</h1>
          <p className="mt-2 text-gray-600">
            আপনার ইমেইল ঠিকানা লিখুন, আমরা রিসেট লিংক পাঠাবো
          </p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">ইমেইল পাঠানো হয়েছে!</h2>
            <p className="text-gray-600">
              আমরা পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি {email} এ
            </p>
            <Link to="/login">
              <Button className="w-full">লগইন পেজে ফিরুন</Button>
            </Link>
          </div>
        ) : (
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? "লিংক পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            লগইন পেজে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;