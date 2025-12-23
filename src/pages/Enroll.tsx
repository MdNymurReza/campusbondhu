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
    name: "বিকাশ",
    number: "০১৭০০-০০০০০০",
    color: "bg-pink-500",
    instructions: "উপরের নম্বরে বিকাশ অ্যাপ ব্যবহার করে সেন্ড মানি করুন",
  },
  {
    id: "nagad",
    name: "নগদ",
    number: "০১৮০০-০০০০০০",
    color: "bg-orange-500",
    instructions: "উপরের নম্বরে নগদ অ্যাপ ব্যবহার করে সেন্ড মানি করুন",
  },
  {
    id: "rocket",
    name: "রকেট",
    number: "০১৯০০-০০০০০০",
    color: "bg-purple-500",
    instructions: "উপরের নম্বরে রকেট অ্যাপ ব্যবহার করে সেন্ড মানি করুন",
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
    title: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প",
    price: 1999,
    instructor: "রহিম আহমেদ",
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
        title: "ট্রান্সেকশন আইডি প্রয়োজন",
        description: "অনুগ্রহ করে আপনার ট্রান্সেকশন আইডি লিখুন",
        variant: "destructive",
      });
      return;
    }

    if (!screenshot) {
      toast({
        title: "স্ক্রিনশট প্রয়োজন",
        description: "অনুগ্রহ করে আপনার পেমেন্ট স্ক্রিনশট আপলোড করুন",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual payment submission
    setTimeout(() => {
      toast({
        title: "পেমেন্ট জমা দেওয়া হয়েছে!",
        description: "আপনার পেমেন্ট যাচাই করা হচ্ছে। অনুমোদন হলে আপনি ইমেইল পাবেন।",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const selectedPayment = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <>
      <Helmet>
        <title>এনরোল - {course.title} - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content={`${course.title} কোর্সে আপনার এনরোলমেন্ট সম্পন্ন করুন`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to={`/courses/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              কোর্সে ফিরে যান
            </Link>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-3 space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">আপনার এনরোলমেন্ট সম্পন্ন করুন</h1>
                  <p className="text-muted-foreground">
                    এই কোর্সে এনরোল করতে নিচের পেমেন্ট নির্দেশনা অনুসরণ করুন।
                  </p>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">পেমেন্ট পদ্ধতি নির্বাচন করুন</h2>
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
                        <h3 className="font-semibold text-foreground">পেমেন্ট নির্দেশনা</h3>
                        <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                          <li>১. আপনার {selectedPayment.name} অ্যাপ খুলুন</li>
                          <li>২. "সেন্ড মানি" তে যান</li>
                          <li>৩. এই নম্বর লিখুন: <span className="font-mono font-semibold text-foreground">{selectedPayment.number}</span></li>
                          <li>৪. পরিমাণ: <span className="font-semibold text-foreground">৳{course.price}</span></li>
                          <li>৫. লেনদেন সম্পন্ন করুন</li>
                          <li>৬. কনফার্মেশনের স্ক্রিনশট নিন</li>
                          <li>৭. নিচে আপনার ট্রান্সেকশন তথ্য দিন</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Details Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">ট্রান্সেকশন আইডি</Label>
                    <Input
                      id="transactionId"
                      placeholder="যেমন, TXN123456789"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      আপনার পেমেন্ট কনফার্মেশন মেসেজে এটি পাবেন
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot">পেমেন্ট স্ক্রিনশট</Label>
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
                              আপনার পেমেন্ট স্ক্রিনশট আপলোড করতে ক্লিক করুন
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG সর্বোচ্চ 5MB
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
                    {isSubmitting ? "জমা দেওয়া হচ্ছে..." : "পেমেন্ট জমা দিন"}
                  </Button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">অর্ডার সারসংক্ষেপ</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">প্রশিক্ষক: {course.instructor}</p>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold text-foreground">মোট</span>
                        <span className="font-bold text-foreground">৳{course.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">এরপর কী হবে?</p>
                        <p className="text-muted-foreground">
                          জমা দেওয়ার পর, আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার পেমেন্ট যাচাই করবে। অনুমোদন হলে আপনি ইমেইল পাবেন।
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
