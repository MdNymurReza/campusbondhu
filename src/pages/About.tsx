import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, Target, Heart, Users } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - CampusBondhu</title>
        <meta name="description" content="Learn about CampusBondhu, Bangladesh's own online learning platform dedicated to empowering university students." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="py-20 gradient-hero">
            <div className="container mx-auto px-4 text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Empowering Bangladeshi Students
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                CampusBondhu is Bangladesh's own online learning platform, built specifically for university students who want to learn new skills and advance their careers.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To make quality education accessible and affordable for every Bangladeshi student. We believe that financial constraints should never be a barrier to learning. Our platform offers courses at student-friendly prices with convenient payment options like bKash, Nagad, and Rocket.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become Bangladesh's leading online education platform, helping millions of students acquire the skills they need to succeed in the modern job market. We envision a future where every student has the opportunity to learn, grow, and achieve their dreams.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
                <p className="text-muted-foreground">
                  The principles that guide everything we do
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Heart,
                    title: "Student First",
                    description: "Every decision we make is centered around what's best for our students.",
                  },
                  {
                    icon: GraduationCap,
                    title: "Quality Education",
                    description: "We partner with expert instructors to deliver high-quality course content.",
                  },
                  {
                    icon: Users,
                    title: "Community",
                    description: "We foster a supportive learning community where students help each other.",
                  },
                  {
                    icon: Target,
                    title: "Accessibility",
                    description: "We strive to make education accessible to students from all backgrounds.",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { value: "5,000+", label: "Active Students" },
                  { value: "50+", label: "Quality Courses" },
                  { value: "20+", label: "Expert Instructors" },
                  { value: "95%", label: "Success Rate" },
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-4xl font-bold text-gradient mb-2">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
