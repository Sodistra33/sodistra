import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import chargeuseTruck from "@/assets/chargeuse-truck.png";
import bulldozer from "@/assets/bulldozer.png";

interface HeroImage {
  id: string;
  title: string;
  subtitle: string | null;
  image_path: string;
  button_text: string | null;
  button_link: string | null;
  gallery_images: string[];
}

const Hero = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hero = heroImages[0];
  const allImages = hero?.gallery_images && hero.gallery_images.length > 0 
    ? hero.gallery_images 
    : hero?.image_path ? [hero.image_path] : [];

  useEffect(() => {
    fetchHeroImages();
    fetchBrochure();
  }, []);

  useEffect(() => {
    if (allImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [allImages.length]);

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const heroData = data as unknown as HeroImage;
        setHeroImages([heroData]);
      }
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
      {/* Background images - cycling through gallery */}
      {allImages.length > 0 && (
        <div className="absolute inset-0 z-0">
          {allImages.map((imagePath, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${imagePath})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/60 to-primary-light/50" />
        </div>
      )}

      {/* Static text content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="overflow-hidden mb-6 w-full">
          <h1 className="text-5xl md:text-7xl font-bold text-white animate-fade-in">
            <div className="inline-flex whitespace-nowrap animate-marquee-title">
              <span className="px-16">{hero?.title || "Votre partenaire de confiance"} dans la construction</span>
              <span className="px-16">{hero?.title || "Votre partenaire de confiance"} dans la construction</span>
            </div>
          </h1>
        </div>
        {hero?.subtitle && (
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
              {hero?.button_text || "Télécharger notre brochure"}
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

      <div className="absolute bottom-8 left-0 right-0 z-20 overflow-hidden">
        <img 
          src={chargeuseTruck} 
          alt="Chargeuse" 
          className="h-16 w-auto animate-roll-truck"
        />
        <img 
          src={bulldozer} 
          alt="Bulldozer" 
          className="h-14 w-auto animate-roll-truck-reverse absolute bottom-0"
        />
      </div>
    </section>
  );
};

export default Hero;
