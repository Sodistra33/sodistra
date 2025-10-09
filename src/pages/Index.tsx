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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="projets"><Projects /></div>
      <div id="advantages"><Advantages /></div>
      <div id="actualites"><Blog /></div>
      <div id="partners"><Partners /></div>
      <div id="contact"><Contact /></div>
      <Footer />
    </div>
  );
};

export default Index;
