import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface HeroImage {
  id: string;
  title: string;
  subtitle: string | null;
  image_path: string;
  button_text: string | null;
  button_link: string | null;
}

const Hero = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroImages();
    fetchBrochure();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroImages(data || []);
    } catch (error) {
      console.error('Error fetching hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrochure = async () => {
    try {
      const { data, error } = await supabase
        .from('brochures')
        .select('file_path')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) throw error;
      setBrochureUrl(data?.file_path || null);
    } catch (error) {
      console.error('Error fetching brochure:', error);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadBrochure = () => {
    if (brochureUrl) {
      window.open(brochureUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-primary">
        <Loader2 className="animate-spin text-accent" size={48} />
      </section>
    );
  }

  if (heroImages.length === 0) {
    return (
      <section id="accueil" className="relative min-h-screen flex items-center justify-center bg-primary">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Votre partenaire de confiance
            <br />
            <span className="text-accent">dans la construction</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Excellence, innovation et fiabilité au service de vos projets de construction en Côte d'Ivoire
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Carousel
        plugins={[Autoplay({ delay: 5000 })]}
        className="w-full h-screen"
      >
        <CarouselContent>
          {heroImages.map((hero) => (
            <CarouselItem key={hero.id}>
              <div className="relative min-h-screen flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${hero.image_path})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary-light/75" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                    {hero.title}
                  </h1>
                  {hero.subtitle && (
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in animate-delay-100">
                      {hero.subtitle}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-200">
                    {brochureUrl && (
                      <Button
                        size="lg"
                        onClick={handleDownloadBrochure}
                        className="bg-accent hover:bg-accent-light text-accent-foreground text-lg px-8 py-6"
                      >
                        {hero.button_text || "Télécharger notre brochure"}
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    )}
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
