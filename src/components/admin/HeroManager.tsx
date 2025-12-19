import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2, X, ImagePlus } from "lucide-react";
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
  gallery_images: string[];
}

export const HeroManager = () => {
  const [hero, setHero] = useState<HeroImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setHero(data);
      setGalleryImages(data?.gallery_images || []);
    } catch (error) {
      console.error('Error fetching hero:', error);
      toast({ title: "Erreur", description: "Impossible de charger la configuration hero", variant: "destructive" });
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
      image_path: galleryImages[0] || '',
      button_text: formData.get('button_text') as string || null,
      button_link: formData.get('button_link') as string || null,
      display_order: 0,
      is_active: true,
      gallery_images: galleryImages,
    };

    try {
      if (hero) {
        const { error } = await supabase
          .from('hero_images')
          .update(heroData)
          .eq('id', hero.id);

        if (error) throw error;
        toast({ title: "Succès", description: "Configuration hero mise à jour" });
      } else {
        const { error } = await supabase
          .from('hero_images')
          .insert([heroData]);

        if (error) throw error;
        toast({ title: "Succès", description: "Configuration hero créée" });
      }

      setIsDialogOpen(false);
      fetchHero();
    } catch (error) {
      console.error('Error saving hero:', error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder la configuration hero", variant: "destructive" });
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

        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('hero-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setGalleryImages([...galleryImages, ...uploadedUrls]);
      toast({ title: "Succès", description: `${uploadedUrls.length} image(s) ajoutée(s)` });
    } catch (error) {
      console.error('Error uploading images:', error);
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
        <h2 className="text-2xl font-bold">Configuration Hero</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setGalleryImages(hero?.gallery_images || []);
            }}>
              <Pencil className="mr-2 h-4 w-4" /> {hero ? 'Modifier' : 'Configurer'} le Hero
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration du Hero</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre principal</Label>
                <Input id="title" name="title" defaultValue={hero?.title || ''} required placeholder="Votre partenaire de confiance" />
              </div>
              <div>
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Textarea id="subtitle" name="subtitle" defaultValue={hero?.subtitle || ''} rows={2} placeholder="Description de votre entreprise..." />
              </div>
              <div>
                <Label htmlFor="button_text">Texte du bouton</Label>
                <Input id="button_text" name="button_text" defaultValue={hero?.button_text || ''} placeholder="Télécharger notre brochure" />
              </div>
              <div>
                <Label htmlFor="button_link">Lien du bouton</Label>
                <Input id="button_link" name="button_link" defaultValue={hero?.button_link || ''} placeholder="#contact" />
              </div>
              
              <div className="space-y-3">
                <Label>Images de fond (défilement automatique toutes les 2 secondes)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <Input 
                    id="gallery_images" 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleGalleryUpload} 
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {uploading && <p className="text-sm text-muted-foreground mt-2">Upload en cours...</p>}
                  
                  {galleryImages.length > 0 ? (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {galleryImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img src={url} alt={`Hero ${index + 1}`} className="h-24 w-full object-cover rounded-lg" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                              Principale
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <ImagePlus className="h-12 w-12 mb-2" />
                      <p className="text-sm">Ajoutez des images pour le défilement</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Les images défileront automatiquement en arrière-plan. Le texte restera fixe.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={uploading || galleryImages.length === 0}>
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Enregistrer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {hero ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{hero.title}</CardTitle>
            {hero.subtitle && <p className="text-sm text-muted-foreground">{hero.subtitle}</p>}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Images:</span> {galleryImages.length} image(s) en rotation
              </div>
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((url, index) => (
                    <img key={index} src={url} alt={`Hero ${index + 1}`} className="h-16 w-full object-cover rounded" />
                  ))}
                </div>
              )}
              {hero.button_text && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Bouton:</span> {hero.button_text}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ImagePlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune configuration hero. Cliquez sur "Configurer le Hero" pour commencer.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
