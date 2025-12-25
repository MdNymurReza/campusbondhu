import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  LayoutDashboard,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  LogOut,
  Eye,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PaymentVerificationDashboard } from '@/components/manual-payment/admin/PaymentVerificationDashboard';
import { paymentVerificationService } from '@/services/manual-payment/verification.service';

// Mock data
const stats = [
  { label: "Total Students", value: "5,234", icon: Users, change: "+12%" },
  { label: "Active Courses", value: "52", icon: BookOpen, change: "+3" },
  { label: "Pending Payments", value: "18", icon: Clock, change: "-5" },
  { label: "Total Revenue", value: "৳2.5M", icon: CreditCard, change: "+8%" },
];

type TabType = "dashboard" | "courses" | "students" | "payments";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    totalCount: 0,
    pendingCount: 0,
    verifiedCount: 0,
    rejectedCount: 0
  });

  useEffect(() => {
    if (activeTab === "dashboard") {
      loadPaymentStats();
    }
  }, [activeTab]);

  const loadPaymentStats = async () => {
    try {
      const stats = await PaymentService.getPaymentStats();
      if (stats) {
        setPaymentStats(stats);
        
        // Update the stats array with real data
        stats[2].value = stats.pendingCount.toString(); // Pending Payments
        stats[3].value = `৳${(stats.verified / 1000000).toFixed(1)}M`; // Total Revenue
      }
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };

  const sidebarItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "courses" as const, label: "Courses", icon: BookOpen },
    { id: "students" as const, label: "Students", icon: Users },
    { id: "payments" as const, label: "Payments", icon: CreditCard },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CampusBondhu</title>
        <meta name="description" content="CampusBondhu admin dashboard for managing courses, students, and payments." />
      </Helmet>

      <div className="min-h-screen flex bg-muted/30">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden lg:block">
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Campus<span className="text-primary">Bondhu</span>
              </span>
            </Link>
          </div>
          
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "courses" && "Manage Courses"}
                {activeTab === "students" && "Students"}
                {activeTab === "payments" && "Payment Verification"}
              </h1>
              <p className="text-muted-foreground">
                Welcome back, Admin
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              {activeTab === "courses" && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              )}
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-success">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Payment Statistics */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payment Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Payments</p>
                    <p className="text-2xl font-bold">{paymentStats.totalCount}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">Pending</p>
                    <p className="text-2xl font-bold text-yellow-700">{paymentStats.pendingCount}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Verified</p>
                    <p className="text-2xl font-bold text-green-700">{paymentStats.verifiedCount}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">Rejected</p>
                    <p className="text-2xl font-bold text-red-700">{paymentStats.rejectedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div>
              <PaymentVerification />
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === "courses" && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">
                Course management coming soon with backend integration.
              </p>
            </div>
          )}

          {activeTab === "students" && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">
                Student management coming soon with backend integration.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;