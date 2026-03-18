import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import chargeuseTruck from "@/assets/chargeuse-truck.png";
import logoSodistra from "@/assets/logo-sodistra-footer.png";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, language } = useLanguage();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hero = heroImages[0];
  const allImages = hero?.gallery_images && hero.gallery_images.length > 0 ? hero.gallery_images : hero?.image_path ? [hero.image_path] : [];

  useEffect(() => {
    fetchHeroImages();
    fetchBrochure();
  }, []);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % allImages.length);
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
            {t('hero.fallback_title')}
            <br />
            <span className="text-accent">{t('hero.in_construction')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('hero.fallback_subtitle')}
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
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${imagePath})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/60 to-primary-light/50" />
        </div>
      )}

      {/* Scrolling text with truck at the bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-20 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee-title">
          <img src={chargeuseTruck} alt="Chargeuse" className="h-14 w-auto flex-shrink-0" />
          <h1 className="text-4xl md:text-6xl font-bold text-white px-4">
            {language === 'en' ? 'Durable in construction' : (hero?.title || t('hero.fallback_title'))} {language === 'en' ? '' : t('hero.in_construction')}
          </h1>
          <img src={logoSodistra} alt="SODISTRA" className="h-10 md:h-12 w-auto flex-shrink-0 ml-4" />
        </div>
      </div>

      {/* Subtitle in center */}
      {hero?.subtitle && (
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
            {hero.subtitle}
          </p>
        </div>
      )}
    </section>
  );
};

export default Hero;
