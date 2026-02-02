import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "@/contexts/LanguageContext";

interface AboutContent {
  id: string;
  title: string;
  description: string;
  image_path: string;
  images: string[];
}

const About = () => {
  const { t, language } = useLanguage();
  const [contents, setContents] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);

  const values = [
    t('about.excellence'),
    t('about.experience'),
    t('about.team'),
    t('about.deadlines'),
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error("Error fetching about content:", error);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  if (loading) {
    return (
      <section className="py-20 bg-secondary flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </section>
    );
  }

  const mainContent = contents[0] || {
    title: t('about.default_title'),
    description: t('about.default_description'),
  };

  // Get translated content based on language
  const displayTitle = language === 'en' ? t('about.main_title') : mainContent.title;
  const displayDescription = language === 'en' 
    ? `${t('about.paragraph1')}\n\n${t('about.paragraph2')}\n\n${t('about.paragraph3')}`
    : mainContent.description;

  return (
    <section id="apropos" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('about.section_title')}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-6">{displayTitle}</h2>
            <div className="text-muted-foreground text-lg mb-8 leading-relaxed space-y-4">
              {displayDescription.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent flex-shrink-0" size={24} />
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-up animate-delay-200">
            {contents.length > 0 ? (
              <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full">
                <CarouselContent>
                  {contents.flatMap((content) =>
                    (content.images && content.images.length > 0 ? content.images : [content.image_path])
                      .filter(Boolean)
                      .map((mediaUrl, idx) => (
                        <CarouselItem key={`${content.id}-${idx}`}>
                          <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            {isVideo(mediaUrl) ? (
                              <video 
                                src={mediaUrl} 
                                className="w-full h-[500px] object-cover" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                              />
                            ) : (
                              <img src={mediaUrl} alt={content.title} className="w-full h-[500px] object-cover" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none" />
                          </div>
                        </CarouselItem>
                      )),
                  )}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary/10 h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">{t('about.no_image')}</p>
              </div>
            )}
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-8 shadow-lg z-10">
              <div className="text-5xl font-bold mb-2">{t('about.years')}</div>
              <div className="font-semibold">{t('about.years_expertise')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
