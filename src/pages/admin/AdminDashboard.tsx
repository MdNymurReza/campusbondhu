import { useState } from "react";
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
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock data
const stats = [
  { label: "Total Students", value: "5,234", icon: Users, change: "+12%" },
  { label: "Active Courses", value: "52", icon: BookOpen, change: "+3" },
  { label: "Pending Payments", value: "18", icon: Clock, change: "-5" },
  { label: "Total Revenue", value: "৳2.5M", icon: CreditCard, change: "+8%" },
];

const recentPayments = [
  {
    id: 1,
    studentName: "Ahmed Rahman",
    studentEmail: "ahmed@example.com",
    course: "Complete Web Development Bootcamp",
    amount: 1999,
    transactionId: "TXN123456789",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: 2,
    studentName: "Fatima Begum",
    studentEmail: "fatima@example.com",
    course: "Data Science with Python",
    amount: 2499,
    transactionId: "TXN987654321",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: 3,
    studentName: "Karim Hassan",
    studentEmail: "karim@example.com",
    course: "Digital Marketing Masterclass",
    amount: 1499,
    transactionId: "TXN456789123",
    status: "approved",
    date: "2024-01-14",
  },
];

type TabType = "dashboard" | "courses" | "students" | "payments";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handlePaymentAction = (paymentId: number, action: "approve" | "reject") => {
    toast({
      title: action === "approve" ? "Payment Approved" : "Payment Rejected",
      description: `Payment #${paymentId} has been ${action === "approve" ? "approved" : "rejected"}.`,
    });
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
                {activeTab === "payments" && "Payment Submissions"}
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

              {/* Recent Payments */}
              <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Recent Payment Submissions</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Student</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Course</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{payment.studentName}</p>
                              <p className="text-sm text-muted-foreground">{payment.studentEmail}</p>
                            </div>
                          </td>
                          <td className="p-4 text-foreground">{payment.course}</td>
                          <td className="p-4 font-medium text-foreground">৳{payment.amount}</td>
                          <td className="p-4 font-mono text-sm text-muted-foreground">{payment.transactionId}</td>
                          <td className="p-4">
                            {payment.status === "pending" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                                <Clock className="h-3 w-3" />
                                Pending
                              </span>
                            ) : payment.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                <XCircle className="h-3 w-3" />
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {payment.status === "pending" ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handlePaymentAction(payment.id, "approve")}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handlePaymentAction(payment.id, "reject")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "dashboard" && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} management coming soon with backend integration.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
