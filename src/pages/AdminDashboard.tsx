import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { BlogManager } from "@/components/admin/BlogManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { BrochuresManager } from "@/components/admin/BrochuresManager";
import { AboutManager } from "@/components/admin/AboutManager";
import { HeroManager } from "@/components/admin/HeroManager";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    Utilisez les onglets ci-dessus pour naviguer entre les différentes sections de gestion.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg border border-accent/20">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-primary">Système actif</span>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-primary">Gestion rapide</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero"><HeroManager /></TabsContent>
          <TabsContent value="projects"><ProjectsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="about"><AboutManager /></TabsContent>
          <TabsContent value="partners"><PartnersManager /></TabsContent>
          <TabsContent value="brochures"><BrochuresManager /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
