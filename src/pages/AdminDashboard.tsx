import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  LogOut, 
  FolderKanban, 
  Newspaper, 
  Users, 
  FileText, 
  Briefcase, 
  Image, 
  Mail,
  Wrench 
} from "lucide-react";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { BlogManager } from "@/components/admin/BlogManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { BrochuresManager } from "@/components/admin/BrochuresManager";
import { AboutManager } from "@/components/admin/AboutManager";
import { HeroManager } from "@/components/admin/HeroManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import ContactMessagesManager from "@/components/admin/ContactMessagesManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    blog: 0,
    partners: 0,
    messages: 0,
    services: 0,
    hero: 0,
    brochures: 0,
    about: 0
  });

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session.user);
    setLoading(false);
    loadStats();
  };

  const loadStats = async () => {
    try {
      const [
        projectsRes,
        blogRes,
        partnersRes,
        messagesRes,
        servicesRes,
        heroRes,
        brochuresRes,
        aboutRes
      ] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('hero_images').select('id', { count: 'exact', head: true }),
        supabase.from('brochures').select('id', { count: 'exact', head: true }),
        supabase.from('about_content').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        projects: projectsRes.count || 0,
        blog: blogRes.count || 0,
        partners: partnersRes.count || 0,
        messages: messagesRes.count || 0,
        services: servicesRes.count || 0,
        hero: heroRes.count || 0,
        brochures: brochuresRes.count || 0,
        about: aboutRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Admin SODISTRA</h1>
              <p className="text-sm text-white/80 font-light">Bienvenue, {user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            className="bg-accent hover:bg-accent-light text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-card shadow-sm border border-border h-auto p-2 gap-2 mb-8 rounded-xl flex-wrap">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="hero"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Hero
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Projets
            </TabsTrigger>
            <TabsTrigger 
              value="blog"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Blog
            </TabsTrigger>
            <TabsTrigger 
              value="about"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              À propos
            </TabsTrigger>
            <TabsTrigger 
              value="partners"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Partenaires
            </TabsTrigger>
            <TabsTrigger 
              value="brochures"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Brochures
            </TabsTrigger>
            <TabsTrigger 
              value="contact"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-primary mb-2">
                      Bienvenue sur votre Dashboard
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      Gérez facilement tout le contenu de votre site SODISTRA depuis cet espace d'administration.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Statistiques */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Statistiques du site</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Projets */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Projets</CardTitle>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FolderKanban className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.projects}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total de projets</p>
                  </CardContent>
                </Card>

                {/* Articles de blog */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Articles</CardTitle>
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Newspaper className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">{stats.blog}</div>
                    <p className="text-xs text-muted-foreground mt-1">Articles de blog</p>
                  </CardContent>
                </Card>

                {/* Partenaires */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Partenaires</CardTitle>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.partners}</div>
                    <p className="text-xs text-muted-foreground mt-1">Partenaires actifs</p>
                  </CardContent>
                </Card>

                {/* Messages */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">{stats.messages}</div>
                    <p className="text-xs text-muted-foreground mt-1">Messages de contact</p>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Services</CardTitle>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Wrench className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.services}</div>
                    <p className="text-xs text-muted-foreground mt-1">Services proposés</p>
                  </CardContent>
                </Card>

                {/* Images Hero */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Images Hero</CardTitle>
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Image className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">{stats.hero}</div>
                    <p className="text-xs text-muted-foreground mt-1">Images d'accueil</p>
                  </CardContent>
                </Card>

                {/* Brochures */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Brochures</CardTitle>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.brochures}</div>
                    <p className="text-xs text-muted-foreground mt-1">Brochures disponibles</p>
                  </CardContent>
                </Card>

                {/* À propos */}
                <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">À propos</CardTitle>
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-accent" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">{stats.about}</div>
                    <p className="text-xs text-muted-foreground mt-1">Contenus À propos</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hero"><HeroManager /></TabsContent>
          <TabsContent value="services"><ServicesManager /></TabsContent>
          <TabsContent value="projects"><ProjectsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="about"><AboutManager /></TabsContent>
          <TabsContent value="partners"><PartnersManager /></TabsContent>
          <TabsContent value="brochures"><BrochuresManager /></TabsContent>
          <TabsContent value="contact"><ContactMessagesManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
