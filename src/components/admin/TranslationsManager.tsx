import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Globe } from "lucide-react";
import { useTranslations, ContentTranslation } from "@/hooks/useTranslations";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const TranslationsManager = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  const { translations, loading: translationsLoading, updateBlogTranslation, updateProjectTranslation } = useTranslations();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogRes, projectsRes] = await Promise.all([
        supabase.from('blog_posts').select('id, title, excerpt, content, category').order('created_at', { ascending: false }),
        supabase.from('projects').select('id, title, description, category').order('created_at', { ascending: false })
      ]);

      if (blogRes.error) throw blogRes.error;
      if (projectsRes.error) throw projectsRes.error;

      setBlogPosts(blogRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSave = async (postId: string, formData: FormData) => {
    setSaving(postId);
    const translation: ContentTranslation = {
      title_en: formData.get('title_en') as string || undefined,
      excerpt_en: formData.get('excerpt_en') as string || undefined,
      content_en: formData.get('content_en') as string || undefined,
      category_en: formData.get('category_en') as string || undefined,
    };

    const success = await updateBlogTranslation(postId, translation);
    if (success) {
      toast({ title: "Succès", description: "Traduction sauvegardée" });
    } else {
      toast({ title: "Erreur", description: "Impossible de sauvegarder la traduction", variant: "destructive" });
    }
    setSaving(null);
  };

  const handleProjectSave = async (projectId: string, formData: FormData) => {
    setSaving(projectId);
    const translation: ContentTranslation = {
      title_en: formData.get('title_en') as string || undefined,
      description_en: formData.get('description_en') as string || undefined,
      category_en: formData.get('category_en') as string || undefined,
    };

    const success = await updateProjectTranslation(projectId, translation);
    if (success) {
      toast({ title: "Succès", description: "Traduction sauvegardée" });
    } else {
      toast({ title: "Erreur", description: "Impossible de sauvegarder la traduction", variant: "destructive" });
    }
    setSaving(null);
  };

  if (loading || translationsLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Gestion des Traductions</h2>
          <p className="text-sm text-muted-foreground">Ajoutez les traductions anglaises pour vos contenus</p>
        </div>
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="blog">Articles de Blog ({blogPosts.length})</TabsTrigger>
          <TabsTrigger value="projects">Projets ({projects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {blogPosts.map((post) => {
              const currentTranslation = translations.blog_posts[post.id] || {};
              return (
                <AccordionItem key={post.id} value={post.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-medium">{post.title}</span>
                      {currentTranslation.title_en && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          EN ✓
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="pt-4">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleBlogSave(post.id, new FormData(e.currentTarget));
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Titre (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded">{post.title}</p>
                            </div>
                            <div>
                              <Label htmlFor={`title_en_${post.id}`}>Titre (EN)</Label>
                              <Input 
                                id={`title_en_${post.id}`} 
                                name="title_en" 
                                defaultValue={currentTranslation.title_en || ''} 
                                placeholder="English title..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Catégorie (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded">{post.category}</p>
                            </div>
                            <div>
                              <Label htmlFor={`category_en_${post.id}`}>Catégorie (EN)</Label>
                              <Input 
                                id={`category_en_${post.id}`} 
                                name="category_en" 
                                defaultValue={currentTranslation.category_en || ''} 
                                placeholder="English category..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Extrait (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded line-clamp-3">{post.excerpt}</p>
                            </div>
                            <div>
                              <Label htmlFor={`excerpt_en_${post.id}`}>Extrait (EN)</Label>
                              <Textarea 
                                id={`excerpt_en_${post.id}`} 
                                name="excerpt_en" 
                                defaultValue={currentTranslation.excerpt_en || ''} 
                                placeholder="English excerpt..."
                                rows={3}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Contenu (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded line-clamp-5">{post.content}</p>
                            </div>
                            <div>
                              <Label htmlFor={`content_en_${post.id}`}>Contenu (EN)</Label>
                              <Textarea 
                                id={`content_en_${post.id}`} 
                                name="content_en" 
                                defaultValue={currentTranslation.content_en || ''} 
                                placeholder="English content..."
                                rows={6}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit" disabled={saving === post.id}>
                              {saving === post.id ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                              Sauvegarder
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {projects.map((project) => {
              const currentTranslation = translations.projects[project.id] || {};
              return (
                <AccordionItem key={project.id} value={project.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-medium">{project.title}</span>
                      {currentTranslation.title_en && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          EN ✓
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="pt-4">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleProjectSave(project.id, new FormData(e.currentTarget));
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Titre (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded">{project.title}</p>
                            </div>
                            <div>
                              <Label htmlFor={`title_en_${project.id}`}>Titre (EN)</Label>
                              <Input 
                                id={`title_en_${project.id}`} 
                                name="title_en" 
                                defaultValue={currentTranslation.title_en || ''} 
                                placeholder="English title..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Catégorie (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded">{project.category}</p>
                            </div>
                            <div>
                              <Label htmlFor={`category_en_${project.id}`}>Catégorie (EN)</Label>
                              <Input 
                                id={`category_en_${project.id}`} 
                                name="category_en" 
                                defaultValue={currentTranslation.category_en || ''} 
                                placeholder="English category..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Description (FR)</Label>
                              <p className="text-sm bg-muted p-2 rounded line-clamp-5">{project.description}</p>
                            </div>
                            <div>
                              <Label htmlFor={`description_en_${project.id}`}>Description (EN)</Label>
                              <Textarea 
                                id={`description_en_${project.id}`} 
                                name="description_en" 
                                defaultValue={currentTranslation.description_en || ''} 
                                placeholder="English description..."
                                rows={5}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit" disabled={saving === project.id}>
                              {saving === project.id ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                              Sauvegarder
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};
