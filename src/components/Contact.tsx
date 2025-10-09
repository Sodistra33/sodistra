import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier (PDF ou images)
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non autorisé",
          description: "Veuillez uploader un fichier PDF ou une image (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 5 MB",
          variant: "destructive",
        });
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let attachmentUrl = null;

      // Upload du fichier si présent
      if (attachment) {
        const fileExt = attachment.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from("contact-attachments").upload(filePath, attachment);

        if (uploadError) throw uploadError;

        attachmentUrl = filePath;
      }

      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          attachment_url: attachmentUrl,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Candidature envoyée !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setAttachment(null);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Rejoignez-nous</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            Candidature <span className="text-accent">spontanée</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Envoyez-nous votre CV en remplissant le formulaire ou contactez-nous directement pour la réalisation de vos
            projets
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-slide-up">
            <Card className="border-border">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Votre nom complet"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Votre adresse email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Votre numéro de téléphone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isSubmitting}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Sujet de votre message"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Présentez-vous et décrivez vos compétences..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      disabled={isSubmitting}
                      rows={6}
                      className="bg-background resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      CV ou document (PDF, JPG, PNG - Max 5MB)
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        className="bg-background"
                      />
                      {attachment && (
                        <div className="mt-2 flex items-center justify-between bg-secondary p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-accent" />
                            <span className="text-sm text-primary">{attachment.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setAttachment(null)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent-light text-accent-foreground text-lg py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer ma candidature"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.2989419728395!2d-3.9795835!3d5.372195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjInMTkuOSJOIDPCsDU4JzQ2LjUiVw!5e0!3m2!1sen!2sci!4v1234567890"
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
  );
};

export default Contact;
