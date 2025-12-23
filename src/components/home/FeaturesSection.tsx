import { 
  GraduationCap, 
  Wallet, 
  Clock, 
  Users, 
  Shield, 
  Smartphone 
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "বিশেষজ্ঞ প্রশিক্ষক",
    description: "বছরের পর বছর অভিজ্ঞতাসম্পন্ন ইন্ডাস্ট্রি প্রফেশনাল এবং বিশ্ববিদ্যালয়ের শিক্ষকদের কাছ থেকে শিখুন।",
  },
  {
    icon: Wallet,
    title: "সাশ্রয়ী মূল্য",
    description: "বাংলাদেশি শিক্ষার্থীদের জন্য ডিজাইন করা দামে মানসম্মত শিক্ষা। বিকাশ, নগদ বা রকেটে পেমেন্ট করুন।",
  },
  {
    icon: Clock,
    title: "নমনীয় শিক্ষা",
    description: "নিজের সময়সূচী অনুযায়ী পড়ুন। যেকোনো সময়, যেকোনো জায়গা থেকে আজীবন এক্সেস করুন।",
  },
  {
    icon: Users,
    title: "কমিউনিটি সাপোর্ট",
    description: "শিক্ষার্থীদের একটি কমিউনিটিতে যোগ দিন। সহপাঠী এবং প্রশিক্ষকদের কাছ থেকে সাহায্য নিন।",
  },
  {
    icon: Shield,
    title: "যাচাইকৃত সার্টিফিকেট",
    description: "কোর্স সম্পন্ন করে সার্টিফিকেট অর্জন করুন এবং নিয়োগকর্তাদের কাছে দক্ষতা প্রদর্শন করুন।",
  },
  {
    icon: Smartphone,
    title: "মোবাইল ফ্রেন্ডলি",
    description: "যেকোনো ডিভাইসে শিখুন। আমাদের প্ল্যাটফর্ম মোবাইল এবং ডেস্কটপে সমানভাবে কাজ করে।",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            কেন আমাদের বেছে নেবেন
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            কেন ক্যাম্পাসবন্ধু?
          </h2>
          <p className="text-muted-foreground text-lg">
            আমরা বাংলাদেশি শিক্ষার্থীদের জন্য বিশেষভাবে তৈরি, আপনাদের প্রয়োজন এবং চ্যালেঞ্জ বুঝে।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:shadow-glow transition-all duration-300 mb-5">
                <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
