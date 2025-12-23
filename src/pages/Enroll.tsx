import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  {
    id: "bkash",
    name: "bKash",
    number: "01700-000000",
    color: "bg-pink-500",
    instructions: "Send money to the number above using bKash app",
  },
  {
    id: "nagad",
    name: "Nagad",
    number: "01800-000000",
    color: "bg-orange-500",
    instructions: "Send money to the number above using Nagad app",
  },
  {
    id: "rocket",
    name: "Rocket",
    number: "01900-000000",
    color: "bg-purple-500",
    instructions: "Send money to the number above using Rocket app",
  },
];

const Enroll = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock course data
  const course = {
    id: Number(id),
    title: "Complete Web Development Bootcamp",
    price: 1999,
    instructor: "Rahim Ahmed",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID required",
        description: "Please enter your transaction ID",
        variant: "destructive",
      });
      return;
    }

    if (!screenshot) {
      toast({
        title: "Screenshot required",
        description: "Please upload your payment screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual payment submission
    setTimeout(() => {
      toast({
        title: "Payment submitted!",
        description: "Your payment is being verified. You'll receive a confirmation email soon.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const selectedPayment = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <>
      <Helmet>
        <title>Enroll - {course.title} - CampusBondhu</title>
        <meta name="description" content={`Complete your enrollment for ${course.title}`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={`/courses/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Link>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-3 space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Complete Your Enrollment</h1>
                  <p className="text-muted-foreground">
                    Follow the payment instructions below to enroll in this course.
                  </p>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Select Payment Method</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-lg ${method.color} mx-auto mb-2 flex items-center justify-center`}>
                          <Smartphone className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-medium text-foreground text-sm">{method.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Instructions */}
                {selectedPayment && (
                  <div className="bg-muted rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground">Payment Instructions</h3>
                        <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                          <li>1. Open your {selectedPayment.name} app</li>
                          <li>2. Go to "Send Money"</li>
                          <li>3. Enter the number: <span className="font-mono font-semibold text-foreground">{selectedPayment.number}</span></li>
                          <li>4. Amount: <span className="font-semibold text-foreground">৳{course.price}</span></li>
                          <li>5. Complete the transaction</li>
                          <li>6. Take a screenshot of the confirmation</li>
                          <li>7. Fill in the form below with your transaction details</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Details Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                      id="transactionId"
                      placeholder="e.g., TXN123456789"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll find this in your payment confirmation message
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Payment Screenshot</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="screenshot"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="screenshot" className="cursor-pointer">
                        {screenshot ? (
                          <div className="flex items-center justify-center gap-2 text-success">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">{screenshot.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">
                              Click to upload your payment screenshot
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Payment"}
                  </Button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-foreground">৳{course.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">What happens next?</p>
                        <p className="text-muted-foreground">
                          After submitting, our team will verify your payment within 24 hours. You'll receive an email confirmation once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Enroll;
