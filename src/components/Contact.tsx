import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "(+225) 27 22 47 99 96 / (+225) 07 09 59 65 02",
      link: "tel:+22527224799996",
    },
    {
      icon: Clock,
      title: "Heures d'ouverture",
      content: "Lun-Ven: 8h-12h / 14h30-17h30 | Sam: 8h-12h",
      link: "#",
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
      content: "Cocody Riviera Palmeraie Akouedo ILOT 25, 23 BP 2793 Abj 23",
      link: "https://maps.app.goo.gl/i5voQ4qgAwMRBFbSA",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Contactez-nous</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            Nos <span className="text-accent">coordonnées</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Besoin d'informations sur nos services ? N'hésitez pas à nous contacter
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {contactInfo.map((info, index) => (
            <Card key={index} className="border-border hover:shadow-md transition-shadow animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-primary-foreground" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
                    {info.link !== "#" ? (
                      <a 
                        href={info.link} 
                        className="text-muted-foreground hover:text-accent transition-colors"
                        target={info.link.startsWith("http") ? "_blank" : undefined}
                        rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
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

          <Card className="border-border overflow-hidden animate-slide-up animate-delay-200">
            <CardContent className="p-0">
              <div className="h-96 bg-muted">
                <iframe
                  title="SODISTRA Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!3d3972.298941972839!2d-3.9795835!3d5.372195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjInMTkuOSJOIDPCsDU4JzQ2LjUiVw!5e0!3m2!1sfr!2sci!4v1702900000000"
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
    </section>
  );
};

export default Contact;
