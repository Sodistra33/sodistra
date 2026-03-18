import { Shield, Award, Leaf, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import logoWatermark from "@/assets/logo-sodistra-watermark.png";
import { useLanguage } from "@/contexts/LanguageContext";
const Advantages = () => {
  const {
    t
  } = useLanguage();
  const advantages = [{
    icon: Shield,
    titleKey: 'advantages.reliability_title',
    descKey: 'advantages.reliability_desc'
  }, {
    icon: Award,
    titleKey: 'advantages.expertise_title',
    descKey: 'advantages.expertise_desc'
  }, {
    icon: Leaf,
    titleKey: 'advantages.deadlines_title',
    descKey: 'advantages.deadlines_desc'
  }, {
    icon: Lightbulb,
    titleKey: 'advantages.innovation_title',
    descKey: 'advantages.innovation_desc'
  }];
  return <section id="atouts" className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
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
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('advantages.section_title')}</span>
          
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            {t('advantages.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 animate-slide-up" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <advantage.icon className="text-accent-foreground" size={52} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{t(advantage.titleKey)}</h3>
                <p className="text-primary-foreground/70 leading-relaxed">{t(advantage.descKey)}</p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default Advantages;