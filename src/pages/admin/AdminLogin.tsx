import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual admin authentication
    setTimeout(() => {
      toast({
        title: "Admin login coming soon!",
        description: "Backend authentication will be enabled shortly.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - CampusBondhu</title>
        <meta name="description" content="Admin login for CampusBondhu LMS platform." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border shadow-xl p-8 space-y-8">
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
              <div className="h-14 w-14 rounded-xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
              <p className="mt-2 text-muted-foreground">
                Access the admin dashboard
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
                    placeholder="admin@campusbondhu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                    Login to Admin Panel
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary font-medium hover:underline">
                ← Back to Student Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
