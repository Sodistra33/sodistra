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

interface AboutContent {
  id: string;
  title: string;
  description: string;
  image_path: string;
  display_order: number;
  is_active: boolean;
}

export const AboutManager = () => {
  const [contents, setContents] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<AboutContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast({ title: "Erreur", description: "Impossible de charger le contenu", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contentData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_path: formData.get('image_path') as string,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'true',
    };

    try {
      if (editingContent) {
        const { error } = await supabase
          .from('about_content')
          .update(contentData)
          .eq('id', editingContent.id);

        if (error) throw error;
        toast({ title: "Succès", description: "Contenu mis à jour" });
      } else {
        const { error } = await supabase
          .from('about_content')
          .insert([contentData]);

        if (error) throw error;
        toast({ title: "Succès", description: "Contenu créé" });
      }

      setIsDialogOpen(false);
      setEditingContent(null);
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder le contenu", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return;

    try {
      const { error } = await supabase
        .from('about_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Succès", description: "Contenu supprimé" });
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer le contenu", variant: "destructive" });
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
        .from('about-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('about-images')
        .getPublicUrl(filePath);

      (e.target.form?.elements.namedItem('image_path') as HTMLInputElement).value = publicUrl;
      toast({ title: "Succès", description: "Image uploadée" });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const moveContent = async (id: string, direction: 'up' | 'down') => {
    const index = contents.findIndex(c => c.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === contents.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedContents = [...contents];
    [updatedContents[index], updatedContents[newIndex]] = [updatedContents[newIndex], updatedContents[index]];

    try {
      await Promise.all(
        updatedContents.map((content, idx) =>
          supabase.from('about_content').update({ display_order: idx }).eq('id', content.id)
        )
      );
      fetchContents();
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
        <h2 className="text-2xl font-bold">Gestion "À Propos"</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContent(null)}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau Contenu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingContent ? 'Modifier' : 'Nouveau'} Contenu</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" defaultValue={editingContent?.title} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingContent?.description} required rows={4} />
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                <Input id="image_path" name="image_path" placeholder="URL de l'image" defaultValue={editingContent?.image_path} className="mt-2" required />
              </div>
              <div>
                <Label htmlFor="display_order">Ordre d'affichage</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={editingContent?.display_order || 0} />
              </div>
              <div>
                <Label htmlFor="is_active">Statut</Label>
                <select id="is_active" name="is_active" defaultValue={editingContent?.is_active ? 'true' : 'false'} className="w-full border rounded p-2">
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {editingContent ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contents.map((content, index) => (
          <Card key={content.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <img src={content.image_path} alt={content.title} className="w-20 h-20 object-cover rounded" />
                <div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">{content.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => moveContent(content.id, 'up')} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveContent(content.id, 'down')} disabled={index === contents.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => { setEditingContent(content); setIsDialogOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(content.id)}>
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
