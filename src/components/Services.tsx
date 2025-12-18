import { Building2, HardHat, Wrench, FileText, Briefcase, Package, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const handleServiceClick = (serviceTitle: string) => {
    navigate(`/projets?category=${encodeURIComponent(serviceTitle)}`);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback static data
        setServices([
          {
            id: '1',
            title: "Construction de bâtiments",
            description: "Conception et réalisation de bâtiments résidentiels, commerciaux et industriels de haute qualité.",
            icon_name: "Building2",
            display_order: 0,
            is_active: true
          },
          {
            id: '2',
            title: "Génie civil",
            description: "Infrastructures routières, ponts, ouvrages d'art et travaux de terrassement de grande envergure.",
            icon_name: "HardHat",
            display_order: 1,
            is_active: true
          },
          {
            id: '3',
            title: "Rénovation et maintenance",
            description: "Services complets de réhabilitation et d'entretien pour prolonger la vie de vos structures.",
            icon_name: "Wrench",
            display_order: 2,
            is_active: true
          },
          {
            id: '4',
            title: "Études techniques",
            description: "Bureau d'études intégré pour l'analyse, la conception et le conseil sur vos projets.",
            icon_name: "FileText",
            display_order: 3,
            is_active: true
          },
          {
            id: '5',
            title: "Projets clé en main",
            description: "Gestion complète de A à Z de vos projets de construction avec une garantie de résultat.",
            icon_name: "Briefcase",
            display_order: 4,
            is_active: true
          },
          {
            id: '6',
            title: "Fourniture de matériaux",
            description: "Approvisionnement en matériaux de construction de qualité supérieure pour tous vos besoins.",
            icon_name: "Package",
            display_order: 5,
            is_active: true
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Building2,
      HardHat,
      Wrench,
      FileText,
      Briefcase,
      Package
    };
    return icons[iconName] || Building2;
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Nos services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
              Quels services <span className="text-accent">offrons-nous ?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une gamme complète de services pour répondre à tous vos besoins en construction
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Nos services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            Quels services <span className="text-accent">offrons-nous ?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une gamme complète de services pour répondre à tous vos besoins en construction
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const isYellow = index % 2 === 0;
            const IconComponent = getIcon(service.icon_name);
            return (
              <Card
                key={service.id}
                onClick={() => handleServiceClick(service.title)}
                className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-border cursor-pointer ${
                  isYellow
                    ? "hover:bg-accent hover:border-accent"
                    : "hover:bg-primary hover:border-primary"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 ${
                      isYellow
                        ? "bg-gradient-to-br from-primary to-primary-light group-hover:bg-primary-foreground"
                        : "bg-gradient-to-br from-accent to-accent-light group-hover:bg-accent-foreground"
                    }`}
                  >
                    <IconComponent
                      className={`transition-colors duration-300 ${
                        isYellow
                          ? "text-primary-foreground group-hover:text-accent"
                          : "text-accent-foreground group-hover:text-primary"
                      }`}
                      size={24}
                    />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      isYellow
                        ? "text-primary group-hover:text-accent-foreground"
                        : "text-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isYellow
                        ? "text-muted-foreground group-hover:text-accent-foreground"
                        : "text-muted-foreground group-hover:text-primary-foreground"
                    }`}
                  >
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
