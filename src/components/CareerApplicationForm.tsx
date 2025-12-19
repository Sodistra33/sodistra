import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CareerApplicationFormProps {
  jobTitle?: string;
}

const departmentPositions = [
  {
    department: "Direction Générale",
    positions: [
      "Assistanat de direction",
      "Secrétariat"
    ]
  },
  {
    department: "Département de la comptabilité et des finances",
    positions: [
      "Service comptable et trésorerie",
      "Service du contrôle (Contrôleur interne)",
      "Service des achats et achats mécaniques"
    ]
  },
  {
    department: "Département administratif et des Ressources Humaines",
    positions: [
      "Service des ressources humaines",
      "Service HSES (Hygiène, Santé, Environnement et Sûreté)"
    ]
  },
  {
    department: "Département technique",
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
    department: "Département parc matériel",
    positions: [
      "Service mécanique",
      "Service logistique",
      "Service production (les centrales)",
      "Service planification GM"
    ]
  },
  {
    department: "Autres",
    positions: [
      "Service informatique"
    ]
  }
];

const CareerApplicationForm = ({ jobTitle }: CareerApplicationFormProps) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non autorisé",
          description: "Veuillez uploader un fichier PDF ou une image (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }
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
    
    if (!selectedPosition) {
      toast({
        title: "Poste requis",
        description: "Veuillez sélectionner un poste",
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

      // Envoyer l'email de notification
      await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Candidature spontanée - ${selectedPosition}`,
          message: formData.message,
          type: "candidature"
        }
      });

      toast({
        title: "Candidature envoyée !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedPosition(jobTitle || "");
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

  return (
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
            <Select
              value={selectedPosition}
              onValueChange={setSelectedPosition}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sélectionnez un poste" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-[300px]">
                {departmentPositions.map((dept) => (
                  <SelectGroup key={dept.department}>
                    <SelectLabel className="font-semibold text-primary">{dept.department}</SelectLabel>
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
  );
};

export default CareerApplicationForm;
