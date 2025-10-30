import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  contract_type: string | null;
  is_active: boolean;
  created_at: string;
}

const JobOffersManager = () => {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    contract_type: "",
    is_active: true,
  });

  useEffect(() => {
    fetchJobOffers();
  }, []);

  const fetchJobOffers = async () => {
    try {
      const { data, error } = await supabase
        .from("job_offers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobOffers(data || []);
    } catch (error) {
      console.error("Error fetching job offers:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les offres d'emploi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job: JobOffer) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements || "",
      location: job.location || "",
      contract_type: job.contract_type || "",
      is_active: job.is_active,
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      contract_type: "",
      is_active: true,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      contract_type: "",
      is_active: true,
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("job_offers")
          .update({
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements || null,
            location: formData.location || null,
            contract_type: formData.contract_type || null,
            is_active: formData.is_active,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "L'offre d'emploi a été mise à jour",
        });
      } else {
        const { error } = await supabase.from("job_offers").insert([
          {
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements || null,
            location: formData.location || null,
            contract_type: formData.contract_type || null,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "L'offre d'emploi a été créée",
        });
      }

      handleCancel();
      fetchJobOffers();
    } catch (error) {
      console.error("Error saving job offer:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'offre d'emploi",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      return;
    }

    try {
      const { error } = await supabase.from("job_offers").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'offre d'emploi a été supprimée",
      });
      fetchJobOffers();
    } catch (error) {
      console.error("Error deleting job offer:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'offre d'emploi",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des offres d'emploi</h2>
        <Button onClick={handleAdd} disabled={isAdding || editingId !== null}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle offre
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle>{editingId ? "Modifier l'offre" : "Nouvelle offre"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre du poste</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Ingénieur Civil"
              />
            </div>
            <div>
              <Label htmlFor="contract_type">Type de contrat</Label>
              <Input
                id="contract_type"
                value={formData.contract_type}
                onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                placeholder="Ex: CDI, CDD, Stage..."
              />
            </div>
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Abidjan, Côte d'Ivoire"
              />
            </div>
            <div>
              <Label htmlFor="description">Description du poste</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                placeholder="Décrivez les missions et responsabilités..."
              />
            </div>
            <div>
              <Label htmlFor="requirements">Profil recherché</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={5}
                placeholder="Compétences et qualifications requises..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Offre active</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!formData.title || !formData.description}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {jobOffers.map((job) => (
          <Card key={job.id} className={!job.is_active ? "opacity-60" : ""}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    {!job.is_active && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>
                    )}
                  </div>
                  {job.contract_type && (
                    <p className="text-sm text-muted-foreground mb-1">Type: {job.contract_type}</p>
                  )}
                  {job.location && (
                    <p className="text-sm text-muted-foreground mb-2">Lieu: {job.location}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{job.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Créée le {new Date(job.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(job)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(job.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobOffers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Aucune offre d'emploi. Cliquez sur "Nouvelle offre" pour en créer une.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobOffersManager;
