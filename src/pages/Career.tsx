import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import JobOffers from "@/components/JobOffers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Career = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('career.hero_title')} <span className="text-accent">{t('career.hero_title_accent')}</span>
            </h1>
            <p className="text-lg opacity-90">
              {t('career.hero_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="offers" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t('career.tab_offers')}
              </TabsTrigger>
              <TabsTrigger value="spontaneous" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('career.tab_spontaneous')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="offers">
              <div className="text-center mb-16 animate-slide-up">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('career.opportunities')}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
                  {t('career.offers_title')} <span className="text-accent">{t('career.offers_title_accent')}</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {t('career.offers_subtitle')}
                </p>
              </div>
              <JobOffers />
            </TabsContent>

            <TabsContent value="spontaneous">
              <div className="text-center mb-16 animate-slide-up">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t('career.application')}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
                  {t('career.spontaneous_title')} <span className="text-accent">{t('career.spontaneous_title_accent')}</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {t('career.spontaneous_subtitle')}
                </p>
              </div>

              <div className="max-w-2xl mx-auto animate-slide-up">
                <CareerApplicationForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Career;
