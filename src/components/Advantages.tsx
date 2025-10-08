import { Shield, Award, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import logoWatermark from "@/assets/logo-sodistra-watermark.png";

const Advantages = () => {
  const advantages = [
    {
      icon: Shield,
      title: "Fiabilité garantie",
      description: "Engagement total sur la qualité et la durabilité de nos constructions avec garanties complètes.",
    },
    {
      icon: Award,
      title: "Expertise locale",
      description: "Près de 20 ans d'expérience en Côte d'Ivoire avec une connaissance approfondie du terrain.",
    },
    {
      icon: Clock,
      title: "Délais respectés",
      description: "Gestion rigoureuse des projets pour livrer dans les temps convenus sans compromis sur la qualité.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Utilisation des dernières technologies et méthodes de construction pour des résultats optimaux.",
    },
  ];

  return (
    <section id="atouts" className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-light rounded-full blur-3xl" />
      </div>

      {/* Logo en filigrane */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <img src={logoWatermark} alt="" className="w-[1200px] h-auto" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Nos atouts</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            Pourquoi nous <span className="text-accent">choisir ?</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Des valeurs fortes et un engagement total envers la satisfaction de nos clients
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <advantage.icon className="text-accent-foreground" size={52} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{advantage.title}</h3>
                <p className="text-primary-foreground/70 leading-relaxed">{advantage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
