import { CheckCircle2 } from "lucide-react";
import teamImage from "@/assets/team-photo.jpg";

const About = () => {
  const values = [
    "Excellence et qualité garanties",
    "Plus de 15 ans d'expérience",
    "Équipe de professionnels qualifiés",
    "Respect des délais et budgets",
  ];

  return (
    <section id="apropos" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              À propos de nous
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-6">
              La meilleure construction avec une cohérence de{" "}
              <span className="text-accent">conception</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              SODISTRA est une entreprise générale de bâtiment & travaux publics spécialisée dans les travaux 
              de construction/réhabilitation, les travaux routiers et de voirie, l'assainissement, 
              la construction de zones industrielles et d'ouvrages divers.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Depuis 2006, nous avons mis en place des procédures rigoureuses pour assurer la qualité 
              de nos prestations, notamment avec l'investissement dans un laboratoire mobile pour le 
              contrôle qualité sur site.
            </p>
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
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={teamImage}
                alt="Équipe SODISTRA"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-8 shadow-lg">
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="font-semibold">Années d'expérience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
