import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CoursesPreview from "@/components/home/CoursesPreview";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CampusBondhu - Bangladesh's Own Online Learning Platform</title>
        <meta
          name="description"
          content="Join thousands of Bangladeshi students learning new skills on CampusBondhu. Access quality courses, expert instructors, and flexible learning at affordable prices."
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <CoursesPreview />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
