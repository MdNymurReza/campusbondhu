import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                ক্যাম্পাস<span className="text-primary">বন্ধু</span>
              </span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              বাংলাদেশি বিশ্ববিদ্যালয় শিক্ষার্থীদের জন্য মানসম্মত অনলাইন শিক্ষা। নিজের গতিতে শিখুন, দক্ষতা বাড়ান।
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-background/10 hover:bg-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              {[
                { name: "হোম", path: "/" },
                { name: "কোর্সসমূহ", path: "/courses" },
                { name: "আমাদের সম্পর্কে", path: "/about" },
                { name: "যোগাযোগ", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">জনপ্রিয় ক্যাটাগরি</h4>
            <ul className="space-y-2">
              {["ওয়েব ডেভেলপমেন্ট", "ডাটা সায়েন্স", "ডিজিটাল মার্কেটিং", "ইংরেজি ভাষা", "বিসিএস প্রস্তুতি"].map((item) => (
                <li key={item}>
                  <Link
                    to="/courses"
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">যোগাযোগ করুন</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-sm text-background/70">
                  ঢাকা, বাংলাদেশ
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-background/70">
                  +৮৮০ ১৭০০-০০০০০০
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-background/70">
                  support@campusbondhu.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} ক্যাম্পাসবন্ধু। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-background/50 hover:text-primary transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <Link to="/terms" className="text-sm text-background/50 hover:text-primary transition-colors">
              সেবার শর্তাবলী
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
