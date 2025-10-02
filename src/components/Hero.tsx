import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary-light/75" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Votre partenaire de confiance
          <br />
          <span className="text-accent">dans la construction</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in animate-delay-100">
          Excellence, innovation et fiabilité au service de vos projets de construction en Côte d'Ivoire
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-200">
          <Button
            size="lg"
            onClick={() => {
              // TODO: Connect to Supabase for PDF download
              console.log("Téléchargement de la brochure");
            }}
            className="bg-accent hover:bg-accent-light text-accent-foreground text-lg px-8 py-6"
          >
            Télécharger notre brochure
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("#realisations")}
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white text-lg px-8 py-6"
          >
            Voir nos réalisations
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
