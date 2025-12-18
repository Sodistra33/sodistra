import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import JobOffers from "@/components/JobOffers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, FileText } from "lucide-react";

const Career = () => {
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
              Rejoignez notre <span className="text-accent">équipe</span>
            </h1>
            <p className="text-lg opacity-90">
              SODISTRA recherche des talents passionnés pour participer à la réalisation de projets d'envergure.
              Découvrez nos offres d'emploi ou envoyez-nous votre candidature spontanée.
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
                Offres d'emploi
              </TabsTrigger>
              <TabsTrigger value="spontaneous" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Candidature spontanée
              </TabsTrigger>
            </TabsList>

            <TabsContent value="offers">
              <div className="text-center mb-16 animate-slide-up">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Opportunités</span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
                  Offres d'emploi <span className="text-accent">disponibles</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Consultez nos postes à pourvoir et postulez directement en ligne
                </p>
              </div>
              <JobOffers />
            </TabsContent>

            <TabsContent value="spontaneous">
              <div className="text-center mb-16 animate-slide-up">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Candidature</span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
                  Candidature <span className="text-accent">spontanée</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Aucune offre ne correspond à votre profil ? Envoyez-nous votre CV, nous étudierons votre candidature avec attention
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
