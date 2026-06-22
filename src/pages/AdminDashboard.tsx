import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { LogOut, FolderKanban, Newspaper, Users, FileText, Briefcase, Image, Mail, Wrench, Share2, Globe } from "lucide-react";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { BlogManager } from "@/components/admin/BlogManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { BrochuresManager } from "@/components/admin/BrochuresManager";
import { AboutManager } from "@/components/admin/AboutManager";
import { HeroManager } from "@/components/admin/HeroManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import ContactMessagesManager from "@/components/admin/ContactMessagesManager";
import JobOffersManager from "@/components/admin/JobOffersManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import { TranslationsManager } from "@/components/admin/TranslationsManager";
import MailsManager from "@/components/admin/MailsManager";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    projects: 0,
    blog: 0,
    partners: 0,
    messages: 0,
    services: 0,
    hero: 0,
    brochures: 0,
    about: 0,
    jobOffers: 0
  });
  const goToTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const checkAuth = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
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
      const [projectsRes, blogRes, partnersRes, messagesRes, servicesRes, heroRes, brochuresRes, aboutRes, jobOffersRes] = await Promise.all([supabase.from('projects').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('blog_posts').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('partners').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('contact_messages').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('services').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('hero_images').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('brochures').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('about_content').select('id', {
        count: 'exact',
        head: true
      }), supabase.from('job_offers').select('id', {
        count: 'exact',
        head: true
      })]);
      setStats({
        projects: projectsRes.count || 0,
        blog: blogRes.count || 0,
        partners: partnersRes.count || 0,
        messages: messagesRes.count || 0,
        services: servicesRes.count || 0,
        hero: heroRes.count || 0,
        brochures: brochuresRes.count || 0,
        about: aboutRes.count || 0,
        jobOffers: jobOffersRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !"
    });
    navigate("/login");
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>;
  }
  return <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Admin SODISTRA</h1>
              <p className="text-sm text-white/80 font-light">Bienvenue, {user?.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} className="bg-accent hover:bg-accent-light text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card shadow-sm border border-border h-auto p-2 gap-2 mb-8 rounded-xl flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Hero
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Services
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Projets
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Blog
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              À propos
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Partenaires
            </TabsTrigger>
            <TabsTrigger value="brochures" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Brochures
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Contact
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Offres d'emploi
            </TabsTrigger>
            <TabsTrigger value="mails" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              <Mail className="mr-2 h-4 w-4" />
              Mails
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              Réseaux sociaux
            </TabsTrigger>
            <TabsTrigger value="translations" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-accent px-6 py-2.5 rounded-lg font-medium transition-all">
              <Globe className="mr-2 h-4 w-4" />
              Traductions
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
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground tracking-tight">Statistiques du site</h2>
                  <p className="text-sm text-muted-foreground mt-1">Cliquez sur une carte pour gérer la section correspondante</p>
                </div>
                <div className="hidden md:block h-1 flex-1 ml-8 bg-gradient-to-r from-primary/40 via-accent/40 to-transparent rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { key: "projects", tab: "projects", label: "Projets", sub: "Total de projets", value: stats.projects, Icon: FolderKanban, from: "from-primary", to: "to-primary-light", text: "text-primary", bg: "bg-primary/10" },
                  { key: "blog", tab: "blog", label: "Articles", sub: "Articles de blog", value: stats.blog, Icon: Newspaper, from: "from-accent", to: "to-accent-light", text: "text-accent", bg: "bg-accent/10" },
                  { key: "partners", tab: "partners", label: "Partenaires", sub: "Partenaires actifs", value: stats.partners, Icon: Users, from: "from-primary", to: "to-primary-light", text: "text-primary", bg: "bg-primary/10" },
                  { key: "messages", tab: "mails", label: "Messages & Mails", sub: "Messages reçus", value: stats.messages, Icon: Mail, from: "from-accent", to: "to-accent-light", text: "text-accent", bg: "bg-accent/10" },
                  { key: "hero", tab: "hero", label: "Images cover", sub: "Images d'accueil", value: stats.hero, Icon: Image, from: "from-accent", to: "to-accent-light", text: "text-accent", bg: "bg-accent/10" },
                  { key: "brochures", tab: "brochures", label: "Brochures", sub: "Brochures disponibles", value: stats.brochures, Icon: FileText, from: "from-primary", to: "to-primary-light", text: "text-primary", bg: "bg-primary/10" },
                  { key: "jobs", tab: "jobs", label: "Offres d'emploi", sub: "Postes disponibles", value: stats.jobOffers, Icon: Briefcase, from: "from-accent", to: "to-accent-light", text: "text-accent", bg: "bg-accent/10" },
                  { key: "services", tab: "services", label: "Services", sub: "Services proposés", value: stats.services, Icon: Wrench, from: "from-primary", to: "to-primary-light", text: "text-primary", bg: "bg-primary/10" },
                ].map(({ key, tab, label, sub, value, Icon, from, to, text, bg }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => goToTab(tab)}
                    className="group relative text-left rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${from} ${to}`} />
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${from} ${to} opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500`} />
                    <div className="relative p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-6 w-6 ${text}`} />
                        </div>
                        <svg className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div className={`text-4xl font-extrabold ${text} tracking-tight leading-none`}>{value}</div>
                      <div className="mt-3">
                        <div className="text-sm font-semibold text-foreground">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hero"><HeroManager /></TabsContent>
          <TabsContent value="services"><ServicesManager /></TabsContent>
          <TabsContent value="projects"><ProjectsManager /></TabsContent>
          <TabsContent value="blog"><BlogManager /></TabsContent>
          <TabsContent value="jobs"><JobOffersManager /></TabsContent>
          <TabsContent value="about"><AboutManager /></TabsContent>
          <TabsContent value="partners"><PartnersManager /></TabsContent>
          <TabsContent value="brochures"><BrochuresManager /></TabsContent>
          <TabsContent value="contact"><ContactMessagesManager /></TabsContent>
          <TabsContent value="mails"><MailsManager /></TabsContent>
          <TabsContent value="social"><SocialLinksManager /></TabsContent>
          <TabsContent value="translations"><TranslationsManager /></TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default AdminDashboard;