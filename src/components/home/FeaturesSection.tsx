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
    title: "Expert Instructors",
    description: "Learn from industry professionals and university faculty with years of experience.",
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    description: "Quality education at prices designed for Bangladeshi students. Pay via bKash, Nagad, or Rocket.",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "Study on your schedule. Access courses anytime, anywhere with lifetime access.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a community of learners. Get help from peers and instructors.",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description: "Earn certificates upon completion to showcase your skills to employers.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Learn on any device. Our platform works seamlessly on mobile and desktop.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why CampusBondhu?
          </h2>
          <p className="text-muted-foreground text-lg">
            We're built specifically for Bangladeshi students, understanding your needs and challenges.
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
