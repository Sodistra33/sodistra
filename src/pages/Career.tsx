import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import JobOffers from "@/components/JobOffers";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Career = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "(+225) 27 22 47 39 96",
      link: "tel:+22527224739396",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@sodistra-ci.net",
      link: "mailto:contact@sodistra-ci.net",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Cocody Riviera Palmeraie, Abidjan, Côte d'Ivoire",
      link: "#",
    },
  ];

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
        </div>
      </section>

      <section id="spontaneous-application" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Candidature</span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
              Candidature <span className="text-accent">spontanée</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Aucune offre ne correspond à votre profil ? Envoyez-nous votre CV, nous étudierons votre candidature avec attention
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <CareerApplicationForm />
            </div>

            <div className="space-y-8 animate-slide-up animate-delay-200">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="text-primary-foreground" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
                        {info.link !== "#" ? (
                          <a href={info.link} className="text-muted-foreground hover:text-accent transition-colors">
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-64 bg-muted">
                    <iframe
                      title="SODISTRA Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!3d3972.2989419728395!2d-3.9795835!3d5.372195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjInMTkuOSJOIDPCsDU4JzQ2LjUiVw!5e0!3m2!1sen!2sci!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Career;
