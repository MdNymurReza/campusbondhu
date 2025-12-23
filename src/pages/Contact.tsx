import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({ title: "মেসেজ পাঠানো হয়েছে!", description: "আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করব।" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>যোগাযোগ - ক্যাম্পাসবন্ধু</title>
        <meta name="description" content="ক্যাম্পাসবন্ধু টিমের সাথে যোগাযোগ করুন। আমাদের কোর্স এবং প্ল্যাটফর্ম সম্পর্কে যেকোনো প্রশ্নে আমরা সাহায্য করতে এখানে আছি।" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">যোগাযোগ</span>
              <h1 className="text-4xl font-bold text-foreground mb-4">আমাদের সাথে যোগাযোগ করুন</h1>
              <p className="text-muted-foreground text-lg">প্রশ্ন আছে? আমরা আপনার কাছ থেকে শুনতে চাই। একটি মেসেজ পাঠান এবং আমরা যত দ্রুত সম্ভব উত্তর দেব।</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Mail className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-semibold text-foreground mb-2">ইমেইল করুন</h3>
                  <p className="text-muted-foreground text-sm mb-2">সাধারণ প্রশ্নের জন্য</p>
                  <a href="mailto:support@campusbondhu.com" className="text-primary hover:underline">support@campusbondhu.com</a>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4"><Phone className="h-6 w-6 text-accent" /></div>
                  <h3 className="font-semibold text-foreground mb-2">কল করুন</h3>
                  <p className="text-muted-foreground text-sm mb-2">শনি-বৃহস্পতি, সকাল ৯টা-সন্ধ্যা ৬টা</p>
                  <a href="tel:+8801700000000" className="text-primary hover:underline">+৮৮০ ১৭০০-০০০০০০</a>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center mb-4"><MapPin className="h-6 w-6 text-success" /></div>
                  <h3 className="font-semibold text-foreground mb-2">ঠিকানা</h3>
                  <p className="text-muted-foreground text-sm">ঢাকা, বাংলাদেশ</p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl border border-border p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-primary" /></div>
                    <h2 className="text-xl font-semibold text-foreground">আমাদের মেসেজ পাঠান</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2"><Label htmlFor="name">আপনার নাম</Label><Input id="name" name="name" placeholder="আপনার নাম" value={formData.name} onChange={handleChange} required /></div>
                      <div className="space-y-2"><Label htmlFor="email">ইমেইল ঠিকানা</Label><Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="subject">বিষয়</Label><Input id="subject" name="subject" placeholder="আমরা কীভাবে সাহায্য করতে পারি?" value={formData.subject} onChange={handleChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="message">মেসেজ</Label><Textarea id="message" name="message" placeholder="আপনার বিস্তারিত লিখুন..." rows={5} value={formData.message} onChange={handleChange} required /></div>
                    <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>{isSubmitting ? "পাঠানো হচ্ছে..." : (<>মেসেজ পাঠান<Send className="ml-2 h-5 w-5" /></>)}</Button>
                  </form>
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

export default Contact;
