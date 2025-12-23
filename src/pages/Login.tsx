import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual authentication
    setTimeout(() => {
      toast({
        title: "Login feature coming soon!",
        description: "Backend authentication will be enabled shortly.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Login - CampusBondhu</title>
        <meta name="description" content="Login to your CampusBondhu account to access your courses and continue learning." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 justify-center group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-md group-hover:shadow-glow transition-shadow">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Campus<span className="text-primary">Bondhu</span>
              </span>
            </Link>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
              <p className="mt-2 text-muted-foreground">
                Login to continue your learning journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
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

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>

            {/* Admin Login Link */}
            <div className="pt-4 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Are you an admin?{" "}
                <Link to="/admin/login" className="text-primary font-medium hover:underline">
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="hidden lg:flex flex-1 relative gradient-primary">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center text-primary-foreground space-y-6">
              <h2 className="text-4xl font-bold">Continue Learning</h2>
              <p className="text-lg text-primary-foreground/80">
                Pick up where you left off. Your courses and progress are waiting for you.
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">50+ Courses</p>
                    <p className="text-sm text-primary-foreground/70">Available to explore</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-lg font-bold">৳</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Easy Payment</p>
                    <p className="text-sm text-primary-foreground/70">bKash, Nagad, Rocket</p>
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
