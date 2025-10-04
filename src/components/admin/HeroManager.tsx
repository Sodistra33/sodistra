import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HeroImage {
  id: string;
  title: string;
  subtitle: string | null;
  image_path: string;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
}

export const HeroManager = () => {
  const [heroes, setHeroes] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroes(data || []);
    } catch (error) {
      console.error('Error fetching heroes:', error);
      toast({ title: "Erreur", description: "Impossible de charger les images hero", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const heroData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string || null,
      image_path: formData.get('image_path') as string,
      button_text: formData.get('button_text') as string || null,
      button_link: formData.get('button_link') as string || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'true',
    };

    try {
      if (editingHero) {
        const { error } = await supabase
          .from('hero_images')
          .update(heroData)
          .eq('id', editingHero.id);

        if (error) throw error;
        toast({ title: "Succès", description: "Image hero mise à jour" });
      } else {
        const { error } = await supabase
          .from('hero_images')
          .insert([heroData]);

        if (error) throw error;
        toast({ title: "Succès", description: "Image hero créée" });
      }

      setIsDialogOpen(false);
      setEditingHero(null);
      fetchHeroes();
    } catch (error) {
      console.error('Error saving hero:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder l'image hero", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image hero ?')) return;

    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Succès", description: "Image hero supprimée" });
      fetchHeroes();
    } catch (error) {
      console.error('Error deleting hero:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer l'image hero", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath);

      const urlInput = e.target.form?.elements.namedItem('image_path') as HTMLInputElement;
      if (urlInput) urlInput.value = publicUrl;
      
      setPreviewImage(publicUrl);
      if (editingHero) {
        setEditingHero({ ...editingHero, image_path: publicUrl });
      }
      
      toast({ title: "Succès", description: "Image uploadée" });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const moveHero = async (id: string, direction: 'up' | 'down') => {
    const index = heroes.findIndex(h => h.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === heroes.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedHeroes = [...heroes];
    [updatedHeroes[index], updatedHeroes[newIndex]] = [updatedHeroes[newIndex], updatedHeroes[index]];

    try {
      await Promise.all(
        updatedHeroes.map((hero, idx) =>
          supabase.from('hero_images').update({ display_order: idx }).eq('id', hero.id)
        )
      );
      fetchHeroes();
    } catch (error) {
      console.error('Error reordering:', error);
      toast({ title: "Erreur", description: "Impossible de réorganiser", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion Images Hero</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { 
              setEditingHero(null); 
              setPreviewImage('');
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Image Hero
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHero ? 'Modifier' : 'Nouvelle'} Image Hero</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" defaultValue={editingHero?.title} required />
              </div>
              <div>
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Textarea id="subtitle" name="subtitle" defaultValue={editingHero?.subtitle || ''} rows={2} />
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && <p className="text-sm text-muted-foreground mt-1">Upload en cours...</p>}
                {(previewImage || editingHero?.image_path) && (
                  <img src={previewImage || editingHero?.image_path} alt="Preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
                <Input id="image_path" name="image_path" type="hidden" defaultValue={previewImage || editingHero?.image_path} />
              </div>
              <div>
                <Label htmlFor="button_text">Texte du bouton (optionnel)</Label>
                <Input id="button_text" name="button_text" defaultValue={editingHero?.button_text || ''} placeholder="Ex: En savoir plus" />
              </div>
              <div>
                <Label htmlFor="button_link">Lien du bouton</Label>
                <Input id="button_link" name="button_link" defaultValue={editingHero?.button_link || ''} placeholder="Ex: #services" />
              </div>
              <div>
                <Label htmlFor="display_order">Ordre d'affichage</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={editingHero?.display_order || 0} />
              </div>
              <div>
                <Label htmlFor="is_active">Statut</Label>
                <select id="is_active" name="is_active" defaultValue={editingHero?.is_active ? 'true' : 'false'} className="w-full border rounded p-2">
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setPreviewImage('');
                }}>Annuler</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {editingHero ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {heroes.map((hero, index) => (
          <Card key={hero.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <img src={hero.image_path} alt={hero.title} className="w-32 h-20 object-cover rounded" />
                <div>
                  <CardTitle className="text-lg">{hero.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{hero.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hero.button_text && `Bouton: ${hero.button_text}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => moveHero(hero.id, 'up')} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveHero(hero.id, 'down')} disabled={index === heroes.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => { 
                  setEditingHero(hero); 
                  setPreviewImage(hero.image_path);
                  setIsDialogOpen(true); 
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(hero.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
