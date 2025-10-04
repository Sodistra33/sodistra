import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completion_date: string;
  featured_image_url: string;
  gallery_images?: string[];
  is_published: boolean;
}

export const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({ title: "Erreur", description: "Impossible de charger les projets", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const projectData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      location: formData.get('location') as string,
      completion_date: formData.get('completion_date') as string,
      featured_image_url: formData.get('featured_image_url') as string,
      gallery_images: galleryImages.length > 0 ? galleryImages : null,
      is_published: formData.get('is_published') === 'true',
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast({ title: "Succès", description: "Projet mis à jour" });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast({ title: "Succès", description: "Projet créé" });
      }

      setIsDialogOpen(false);
      setEditingProject(null);
      setGalleryImages([]);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder le projet", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Succès", description: "Projet supprimé" });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer le projet", variant: "destructive" });
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
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      const urlInput = e.target.form?.elements.namedItem('featured_image_url') as HTMLInputElement;
      if (urlInput) urlInput.value = publicUrl;
      
      if (editingProject) {
        setEditingProject({ ...editingProject, featured_image_url: publicUrl });
      }
      
      toast({ title: "Succès", description: "Image principale uploadée" });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setGalleryImages([...galleryImages, ...uploadedUrls]);
      toast({ title: "Succès", description: `${uploadedUrls.length} image(s) ajoutée(s) à la galerie` });
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader les images", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...galleryImages];
    newGallery.splice(index, 1);
    setGalleryImages(newGallery);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Projets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { 
              setEditingProject(null); 
              setGalleryImages([]);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau Projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Modifier' : 'Nouveau'} Projet</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" defaultValue={editingProject?.title} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProject?.description} required rows={4} />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select name="category" defaultValue={editingProject?.category || 'Construction'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Rénovation">Rénovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" name="location" defaultValue={editingProject?.location} required />
              </div>
              <div>
                <Label htmlFor="completion_date">Date d'achèvement</Label>
                <Input id="completion_date" name="completion_date" type="date" defaultValue={editingProject?.completion_date} required />
              </div>
              <div>
                <Label htmlFor="featured_image">Image principale</Label>
                <Input 
                  id="featured_image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  className="cursor-pointer" 
                />
                {uploading && <p className="text-sm text-muted-foreground mt-1">Upload en cours...</p>}
                {editingProject?.featured_image_url && (
                  <img src={editingProject.featured_image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
                <Input id="featured_image_url" name="featured_image_url" type="hidden" defaultValue={editingProject?.featured_image_url} />
              </div>
              <div>
                <Label htmlFor="gallery_images">Images de la galerie</Label>
                <Input 
                  id="gallery_images" 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleGalleryUpload} 
                  disabled={uploading}
                  className="cursor-pointer" 
                />
                {uploading && <p className="text-sm text-muted-foreground mt-1">Upload en cours...</p>}
                {galleryImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {galleryImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Gallery ${index + 1}`} className="h-20 w-full object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="is_published">Statut</Label>
                <Select name="is_published" defaultValue={editingProject?.is_published ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Publié</SelectItem>
                    <SelectItem value="false">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setGalleryImages([]);
                }}>Annuler</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {editingProject ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex-1">
                <CardTitle>{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.category} • {project.location} • {new Date(project.completion_date).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${project.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {project.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { 
                  setEditingProject(project); 
                  setGalleryImages(project.gallery_images || []);
                  setIsDialogOpen(true); 
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
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
