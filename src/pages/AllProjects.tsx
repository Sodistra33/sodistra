import { Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  status: string;
  description: string;
  client: string;
  date: string;
  gallery: string[];
}

const AllProjects = () => {
  const navigate = useNavigate();
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('completion_date', { ascending: false });

      if (error) throw error;
      setDbProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map database projects to Project interface
  const displayedProjects: Project[] = dbProjects.map(project => {
    // Calculer le statut basé sur la date d'achèvement
    const isCompleted = project.completion_date 
      ? new Date(project.completion_date) <= new Date() 
      : false;
    
    return {
      id: project.id.toString(),
      title: project.title,
      category: project.category || 'batiments',
      image: project.featured_image_url || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
      status: isCompleted ? 'Terminé' : 'En cours',
      description: project.description || '',
      client: project.client || '',
      date: project.completion_date || '',
      gallery: project.gallery_images || []
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <Button
              variant="outline"
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const element = document.getElementById('projets');
                  if (element) {
                    const offset = 14; // Ajustement pour la navbar
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="mb-8"
            >
              ← Retour
            </Button>
            
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Nos Réalisations
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
              Tous nos <span className="text-accent">projets</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez l'ensemble de notre portfolio de projets réussis en Côte d'Ivoire
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayedProjects.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Aucun projet disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.map((project, index) => (
                <Card
                  key={project.id}
                  onClick={() => navigate(`/projet/${project.id}`)}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer animate-slide-up border-none h-[400px]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay - transparent at top, dark at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/40 to-blue-950/90" />
                    
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={project.status === "Terminé" ? "default" : "secondary"}
                        className={
                          project.status === "Terminé"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {/* Text content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-accent mb-2 group-hover:text-accent/80 transition-colors">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-white/90 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllProjects;
