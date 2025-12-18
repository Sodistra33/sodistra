import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Partners = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Duplicate partners for seamless loop
  const displayPartners = partners.length > 0 ? [...partners, ...partners] : [];

  return (
    <section className="py-20 bg-background border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Nos <span className="text-accent">partenaires</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ils nous font confiance pour leurs projets de construction
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Chargement des partenaires...</p>
        ) : partners.length === 0 ? (
          <p className="text-center text-muted-foreground">Aucun partenaire pour le moment.</p>
        ) : (
          <div className="relative">
            <div className="flex animate-marquee gap-12 items-center">
              {displayPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  {partner.logo_path ? (
                    <img 
                      src={partner.logo_path} 
                      alt={partner.name}
                      className="w-32 h-20 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-20 bg-secondary rounded-xl flex items-center justify-center border border-border">
                      <span className="text-2xl font-bold text-muted-foreground">{partner.name.substring(0, 2)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Partners;
