import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Partners = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchPartners();
  }, []);
  const fetchPartners = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('partners').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: t('error.generic'),
        description: t('error.loading_partners'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Duplicate partners for seamless loop
  const displayPartners = partners.length > 0 ? [...partners, ...partners] : [];
  // Dynamic duration: ~4s per partner for smooth scrolling
  const animationDuration = Math.max(20, partners.length * 4);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);
  return <section className="py-20 bg-background border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('partners.title')} <span className="text-accent">{t('partners.title_accent')}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('partners.subtitle')}
          </p>
        </div>

        {loading ? <p className="text-center text-muted-foreground">{t('partners.loading')}</p> : partners.length === 0 ? <p className="text-center text-muted-foreground">{t('partners.no_partners')}</p> : <div ref={scrollRef} className="relative overflow-x-auto scrollbar-hide touch-pan-x" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
            <div className="flex gap-12 items-center w-max" style={{
          animation: isPaused ? 'none' : `marquee ${animationDuration}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}>
              {displayPartners.map((partner, index) => <div key={`${partner.id}-${index}`} className="flex-shrink-0 flex items-center justify-center p-6">
                  {partner.logo_path ? <img src={partner.logo_path} alt={partner.name} className="w-32 h-20 object-contain" /> : <div className="w-24 h-20 bg-secondary rounded-xl flex items-center justify-center border border-border">
                      <span className="text-2xl font-bold text-muted-foreground">{partner.name.substring(0, 2)}</span>
                    </div>}
                </div>)}
            </div>
          </div>}
      </div>
    </section>;
};
export default Partners;