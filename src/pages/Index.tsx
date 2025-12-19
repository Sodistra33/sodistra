import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Advantages from "@/components/Advantages";
import Blog from "@/components/Blog";
import Partners from "@/components/Partners";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AnimatedSection>
        <div id="about"><About /></div>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <div id="services"><Services /></div>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <div id="projets"><Projects /></div>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <div id="advantages"><Advantages /></div>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <div id="actualites"><Blog /></div>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <div id="partners"><Partners /></div>
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <div id="contact"><Contact /></div>
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
