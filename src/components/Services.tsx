import { Building2, HardHat, Wrench, FileText, Briefcase, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Building2,
      title: "Construction de bâtiments",
      description: "Conception et réalisation de bâtiments résidentiels, commerciaux et industriels de haute qualité.",
    },
    {
      icon: HardHat,
      title: "Génie civil",
      description: "Infrastructures routières, ponts, ouvrages d'art et travaux de terrassement de grande envergure.",
    },
    {
      icon: Wrench,
      title: "Rénovation et maintenance",
      description: "Services complets de réhabilitation et d'entretien pour prolonger la vie de vos structures.",
    },
    {
      icon: FileText,
      title: "Études techniques",
      description: "Bureau d'études intégré pour l'analyse, la conception et le conseil sur vos projets.",
    },
    {
      icon: Briefcase,
      title: "Projets clé en main",
      description: "Gestion complète de A à Z de vos projets de construction avec une garantie de résultat.",
    },
    {
      icon: Package,
      title: "Fourniture de matériaux",
      description: "Approvisionnement en matériaux de construction de qualité supérieure pour tous vos besoins.",
    },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-slide-up border-border bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="text-primary-foreground" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
