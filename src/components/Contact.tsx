import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      titleKey: 'contact.phone_title',
      content: "(+225) 27 22 47 99 96 / (+225) 07 09 59 65 02",
      links: [
        { label: "(+225) 27 22 47 99 96", href: "tel:+2252722479996" },
        { label: "(+225) 07 09 59 65 02", href: "tel:+2250709596502" }
      ]
    },
    {
      icon: Clock,
      titleKey: 'contact.hours_title',
      contentKey: 'contact.hours_content',
      link: "#"
    },
    {
      icon: MapPin,
      titleKey: 'contact.address_title',
      content: "Cocody Riviera Palmeraie Akouedo ILOT 25, 23 BP 2793 Abj 23",
      link: "https://maps.app.goo.gl/zV47fqa8wFUnnQsRA"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message
        });
      if (dbError) throw dbError;

      // Send email
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });
      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - message is saved, email might fail
      }
      toast({
        title: t('contact.success_title'),
        description: t('contact.success_desc')
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
        title: t('contact.error_title'),
        description: t('contact.error_desc'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            {t('contact.title')} - <span className="text-accent">{t('contact.title_accent')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-border animate-slide-up">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-6">{t('contact.send_message')}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.your_name')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.your_email')}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contact.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('contact.your_phone')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('contact.subject')} *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t('contact.subject_placeholder')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.message_placeholder')}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('contact.send')}
                    </>
                  )}
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
                    <h4 className="font-semibold text-primary mb-1">{t(info.titleKey)}</h4>
                    {'links' in info && info.links ? (
                      <div className="space-y-1">
                        {info.links.map((phoneLink, i) => (
                          <a key={i} href={phoneLink.href} className="block text-muted-foreground hover:text-accent transition-colors text-sm">
                            {phoneLink.label}
                          </a>
                        ))}
                      </div>
                    ) : info.link !== "#" ? (
                      <a href={info.link} className="text-muted-foreground hover:text-accent transition-colors text-sm">
                        {info.contentKey ? t(info.contentKey) : info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {info.contentKey ? t(info.contentKey) : info.content}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-border overflow-hidden animate-slide-up animate-delay-200">
              <CardContent className="p-0">
                <div className="h-64 bg-muted">
                  <iframe
                    title="SODISTRA Location"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8275.602998905551!2d-3.9295123!3d5.3727582!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ed8ede67545d%3A0x64cb1ed1af5f377!2sSODISTRA!5e1!3m2!1sfr!2sci!4v1774352175793!5m2!1sfr!2sci"
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
