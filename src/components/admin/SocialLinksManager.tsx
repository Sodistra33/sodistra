import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
};

const SocialLinksManager = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon_name: "Facebook",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Erreur lors du chargement des réseaux sociaux");
      return;
    }

    setSocialLinks(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLink) {
      const { error } = await supabase
        .from("social_links")
        .update({
          platform: formData.platform,
          url: formData.url,
          icon_name: formData.icon_name,
          display_order: formData.display_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingLink.id);

      if (error) {
        toast.error("Erreur lors de la mise à jour");
        return;
      }
      toast.success("Lien mis à jour avec succès");
    } else {
      const { error } = await supabase.from("social_links").insert({
        platform: formData.platform,
        url: formData.url,
        icon_name: formData.icon_name,
        display_order: formData.display_order,
        is_active: formData.is_active,
      });

      if (error) {
        toast.error("Erreur lors de la création");
        return;
      }
      toast.success("Lien créé avec succès");
    }

    setIsDialogOpen(false);
    resetForm();
    fetchSocialLinks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return;

    const { error } = await supabase.from("social_links").delete().eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("Lien supprimé avec succès");
    fetchSocialLinks();
  };

  const moveLink = async (index: number, direction: "up" | "down") => {
    const newLinks = [...socialLinks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newLinks.length) return;

    const tempOrder = newLinks[index].display_order;
    newLinks[index].display_order = newLinks[swapIndex].display_order;
    newLinks[swapIndex].display_order = tempOrder;

    await supabase
      .from("social_links")
      .update({ display_order: newLinks[index].display_order })
      .eq("id", newLinks[index].id);

    await supabase
      .from("social_links")
      .update({ display_order: newLinks[swapIndex].display_order })
      .eq("id", newLinks[swapIndex].id);

    fetchSocialLinks();
  };

  const resetForm = () => {
    setFormData({
      platform: "",
      url: "",
      icon_name: "Facebook",
      display_order: 0,
      is_active: true,
    });
    setEditingLink(null);
  };

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon_name: link.icon_name,
      display_order: link.display_order,
      is_active: link.is_active,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  const IconComponent = iconMap[formData.icon_name] || Facebook;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Réseaux Sociaux</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau lien
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Modifier le lien" : "Nouveau lien"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="platform">Plateforme</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  placeholder="Facebook, Instagram, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon_name">Icône</Label>
                <select
                  id="icon_name"
                  value={formData.icon_name}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Linkedin">LinkedIn</option>
                  <option value="MessageCircle">WhatsApp</option>
                </select>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <span>Aperçu:</span>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              <div>
                <Label htmlFor="display_order">Ordre d'affichage</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Actif</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingLink ? "Mettre à jour" : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {socialLinks.map((link, index) => {
          const Icon = iconMap[link.icon_name] || Facebook;
          return (
            <Card key={link.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{link.platform}</CardTitle>
                    {!link.is_active && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Inactif
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveLink(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveLink(index, "down")}
                      disabled={index === socialLinks.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(link)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary truncate block"
                >
                  {link.url}
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinksManager;
