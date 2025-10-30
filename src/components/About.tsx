import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface AboutContent {
  id: string;
  title: string;
  description: string;
  image_path: string;
  images: string[];
}

const About = () => {
  const [contents, setContents] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);

  const values = [
    "Excellence et qualité garanties",
    "20 ans d'expérience",
    "Équipe de professionnels qualifiés",
    "Respect des délais et budgets",
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

  if (loading) {
    return (
      <section className="py-20 bg-secondary flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </section>
    );
  }

  const mainContent = contents[0] || {
    title: "La meilleure construction avec une cohérence de conception",
    description:
      "SODISTRA est une entreprise générale de bâtiment & travaux publics spécialisée dans les travaux de construction/réhabilitation, les travaux routiers et de voirie, l'assainissement, la construction de zones industrielles et d'ouvrages divers.",
  };

  return (
    <section id="apropos" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">À propos de nous</span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-6">{mainContent.title}</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{mainContent.description}</p>
            {contents[1] && (
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{contents[1].description}</p>
            )}
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
                      .map((imageUrl, idx) => (
                        <CarouselItem key={`${content.id}-${idx}`}>
                          <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            <img src={imageUrl} alt={content.title} className="w-full h-[500px] object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                          </div>
                        </CarouselItem>
                      )),
                  )}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary/10 h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Aucune image disponible</p>
              </div>
            )}
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-8 shadow-lg z-10">
              <div className="text-5xl font-bold mb-2">20 ans</div>
              <div className="font-semibold">d'expérience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
