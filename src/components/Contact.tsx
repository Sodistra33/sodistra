import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactInfo = [{
    icon: Phone,
    title: "Téléphone",
    content: "(+225) 27 22 47 99 96 / (+225) 07 09 59 65 02",
    link: "tel:+22527224799996"
  }, {
    icon: Clock,
    title: "Heures d'ouverture",
    content: "Lun-Ven: 8h-12h / 14h30-17h30 | Sam: 8h-12h",
    link: "#"
  }, {
    icon: Mail,
    title: "Email",
    content: "contact@sodistra-ci.net",
    link: "mailto:contact@sodistra-ci.net"
  }, {
    icon: MapPin,
    title: "Adresse",
    content: "Cocody Riviera Palmeraie Akouedo ILOT 25, 23 BP 2793 Abj 23",
    link: "https://maps.app.goo.gl/i5voQ4qgAwMRBFbSA"
  }];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Save to database
      const {
        error: dbError
      } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message
      });
      if (dbError) throw dbError;

      // Send email
      const {
        error: emailError
      } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - message is saved, email might fail
      }
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais."
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">Contactez - Nous<span className="text-accent">nous</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Besoin d'informations sur nos services ? N'hésitez pas à nous contacter
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-border animate-slide-up">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-6">Envoyez-nous un message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} placeholder="Votre nom" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} placeholder="votre@email.com" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({
                    ...formData,
                    phone: e.target.value
                  })} placeholder="+225 XX XX XX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input id="subject" value={formData.subject} onChange={e => setFormData({
                    ...formData,
                    subject: e.target.value
                  })} placeholder="Objet de votre message" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" value={formData.message} onChange={e => setFormData({
                  ...formData,
                  message: e.target.value
                })} placeholder="Votre message..." rows={5} required />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </> : <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Map */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-border hover:shadow-md transition-shadow animate-slide-up">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{info.title}</h4>
                    {info.link !== "#" ? (
                      <a href={info.link} className="text-muted-foreground hover:text-accent transition-colors text-sm">
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">{info.content}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-border overflow-hidden animate-slide-up animate-delay-200">
              <CardContent className="p-0">
                <div className="h-64 bg-muted">
                  <iframe title="SODISTRA Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!3d3972.298941972839!2d-3.9795835!3d5.372195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjInMTkuOSJOIDPCsDU4JzQ2LjUiVw!5e0!3m2!1sfr!2sci!4v1702900000000" width="100%" height="100%" style={{
                  border: 0
                }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default Contact;