import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Partner {
  id: string;
  name: string;
  logo_path: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
}

export const PartnersManager = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({ title: "Erreur", description: "Impossible de charger les partenaires", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const partnerData = {
      name: formData.get('name') as string,
      logo_path: formData.get('logo_path') as string,
      website_url: formData.get('website_url') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'true',
    };

    try {
      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(partnerData)
          .eq('id', editingPartner.id);

        if (error) throw error;
        toast({ title: "Succès", description: "Partenaire mis à jour" });
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([partnerData]);

        if (error) throw error;
        toast({ title: "Succès", description: "Partenaire créé" });
      }

      setIsDialogOpen(false);
      setEditingPartner(null);
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder le partenaire", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Succès", description: "Partenaire supprimé" });
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer le partenaire", variant: "destructive" });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partner-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(filePath);

      const urlInput = e.target.form?.elements.namedItem('logo_path') as HTMLInputElement;
      if (urlInput) urlInput.value = publicUrl;
      
      if (editingPartner) {
        setEditingPartner({ ...editingPartner, logo_path: publicUrl });
      }
      
      toast({ title: "Succès", description: "Logo uploadé" });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader le logo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Partenaires</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPartner(null)}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau Partenaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPartner ? 'Modifier' : 'Nouveau'} Partenaire</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" defaultValue={editingPartner?.name} required />
              </div>
              <div>
                <Label htmlFor="logo">Logo</Label>
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                {editingPartner?.logo_path && (
                  <img src={editingPartner.logo_path} alt="Preview" className="mt-2 h-20 object-contain rounded" />
                )}
                <Input id="logo_path" name="logo_path" type="hidden" defaultValue={editingPartner?.logo_path} />
              </div>
              <div>
                <Label htmlFor="website_url">Site web (optionnel)</Label>
                <Input id="website_url" name="website_url" type="url" defaultValue={editingPartner?.website_url || ''} placeholder="https://..." />
              </div>
              <div>
                <Label htmlFor="display_order">Ordre d'affichage</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={editingPartner?.display_order || 0} />
              </div>
              <div>
                <Label htmlFor="is_active">Statut</Label>
                <select id="is_active" name="is_active" defaultValue={editingPartner?.is_active ? 'true' : 'false'} className="w-full border rounded p-2">
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {editingPartner ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <img src={partner.logo_path} alt={partner.name} className="h-20 object-contain mb-2" />
              <CardTitle className="text-lg">{partner.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Ordre: {partner.display_order}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingPartner(partner); setIsDialogOpen(true); }}>
                  <Pencil className="h-3 w-3 mr-1" /> Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(partner.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
