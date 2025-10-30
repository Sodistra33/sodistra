import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image_url: string;
  gallery_images: string[];
  is_published: boolean;
  published_at: string;
}

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: "Erreur", description: "Impossible de charger les articles", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const postData = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      featured_image_url: formData.get('featured_image_url') as string,
      gallery_images: galleryImages,
      is_published: formData.get('is_published') === 'true',
      published_at: formData.get('is_published') === 'true' ? new Date().toISOString() : null,
    };

    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast({ title: "Succès", description: "Article mis à jour" });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        toast({ title: "Succès", description: "Article créé" });
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder l'article", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Succès", description: "Article supprimé" });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer l'article", variant: "destructive" });
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
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      const urlInput = e.target.form?.elements.namedItem('featured_image_url') as HTMLInputElement;
      if (urlInput) urlInput.value = publicUrl;
      
      setPreviewImage(publicUrl);
      if (editingPost) {
        setEditingPost({ ...editingPost, featured_image_url: publicUrl });
      }
      
      toast({ title: "Succès", description: "Image uploadée" });
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
          .from('blog-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const newGallery = [...galleryImages, ...uploadedUrls];
      setGalleryImages(newGallery);
      
      toast({ title: "Succès", description: `${uploadedUrls.length} image(s) uploadée(s)` });
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast({ title: "Erreur", description: "Impossible d'uploader les images", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion du Blog</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { 
              setEditingPost(null); 
              setPreviewImage('');
              setGalleryImages([]);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nouvel Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Modifier' : 'Nouvel'} Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" name="title" defaultValue={editingPost?.title} required />
              </div>
              <div>
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea id="excerpt" name="excerpt" defaultValue={editingPost?.excerpt} required rows={2} />
              </div>
              <div>
                <Label htmlFor="content">Contenu</Label>
                <Textarea id="content" name="content" defaultValue={editingPost?.content} required rows={8} />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input id="category" name="category" defaultValue={editingPost?.category} required placeholder="Événement, Nouveauté, etc." />
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
                {(previewImage || editingPost?.featured_image_url) && (
                  <img src={previewImage || editingPost?.featured_image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded" />
                )}
                <Input id="featured_image_url" name="featured_image_url" type="hidden" defaultValue={previewImage || editingPost?.featured_image_url} />
              </div>
              <div>
                <Label htmlFor="gallery_images">Galerie d'images</Label>
                <Input 
                  id="gallery_images" 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleGalleryUpload} 
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {galleryImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {galleryImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="is_published">Statut</Label>
                <Select name="is_published" defaultValue={editingPost?.is_published ? 'true' : 'false'}>
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
                  setPreviewImage('');
                  setGalleryImages([]);
                }}>Annuler</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {editingPost ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex-1">
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{post.category}</p>
                <p className="text-sm mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {post.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => { 
                  setEditingPost(post); 
                  setPreviewImage(post.featured_image_url);
                  setGalleryImages(post.gallery_images || []);
                  setIsDialogOpen(true); 
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
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
