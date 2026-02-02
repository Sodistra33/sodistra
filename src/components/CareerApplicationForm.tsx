import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface CareerApplicationFormProps {
  jobTitle?: string;
}

const CareerApplicationForm = ({ jobTitle }: CareerApplicationFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [selectedPosition, setSelectedPosition] = useState(jobTitle || "");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const departmentPositions = [
    {
      departmentKey: "dept.general_management",
      positions: [
        "Assistanat de direction",
        "Secrétariat"
      ]
    },
    {
      departmentKey: "dept.accounting_finance",
      positions: [
        "Service comptable et trésorerie",
        "Service du contrôle (Contrôleur interne)",
        "Service des achats et achats mécaniques"
      ]
    },
    {
      departmentKey: "dept.admin_hr",
      positions: [
        "Service des ressources humaines",
        "Service HSES (Hygiène, Santé, Environnement et Sûreté)"
      ]
    },
    {
      departmentKey: "dept.technical",
      positions: [
        "Service des marchés et contrats",
        "Service planning et budget",
        "Service qualité et laboratoire",
        "Bureau d'études",
        "Service topographique",
        "Service électricité",
        "Pôle route",
        "Pôle bâtiment",
        "Pôle aménagement hydro-agricole"
      ]
    },
    {
      departmentKey: "dept.equipment",
      positions: [
        "Service mécanique",
        "Service logistique",
        "Service production (les centrales)",
        "Service planification GM"
      ]
    },
    {
      departmentKey: "dept.other",
      positions: [
        "Service informatique"
      ]
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t('form.file_type_error'),
          description: t('form.file_type_desc'),
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('form.file_size_error'),
          description: t('form.file_size_desc'),
          variant: "destructive",
        });
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPosition) {
      toast({
        title: t('form.position_required'),
        description: t('form.position_required_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentUrl = null;

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
          subject: `Candidature spontanée - ${selectedPosition}`,
          message: formData.message,
          attachment_url: attachmentUrl,
        },
      ]);

      if (error) throw error;

      // Construire l'URL complète de la pièce jointe si elle existe
      let fullAttachmentUrl = null;
      if (attachmentUrl) {
        const { data: urlData } = supabase.storage.from("contact-attachments").getPublicUrl(attachmentUrl);
        fullAttachmentUrl = urlData.publicUrl;
      }

      // Envoyer l'email de notification avec la pièce jointe
      await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Candidature spontanée - ${selectedPosition}`,
          message: formData.message,
          type: "candidature",
          attachmentUrl: fullAttachmentUrl,
          attachmentName: attachment?.name
        }
      });

      toast({
        title: t('form.success_title'),
        description: t('form.success_desc'),
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedPosition(jobTitle || "");
      setAttachment(null);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: t('contact.error_title'),
        description: t('contact.error_desc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder={t('form.full_name')}
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
              placeholder={t('form.email_address')}
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
              placeholder={t('form.phone_number')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
              className="bg-background"
            />
          </div>
          <div>
            <Select
              value={selectedPosition}
              onValueChange={setSelectedPosition}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t('form.select_position')} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-[300px]">
                {departmentPositions.map((dept) => (
                  <SelectGroup key={dept.departmentKey}>
                    <SelectLabel className="font-semibold text-primary">{t(dept.departmentKey)}</SelectLabel>
                    {dept.positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Textarea
              placeholder={t('form.introduce_yourself')}
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
              {t('form.cv_label')}
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
                {t('form.submitting')}
              </>
            ) : (
              t('form.submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CareerApplicationForm;
