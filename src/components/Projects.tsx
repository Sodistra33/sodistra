import { Building2, MapPin, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const Projects = () => {
  const navigate = useNavigate();
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('completion_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setDbProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map database projects to Project interface
  const displayedProjects: Project[] = dbProjects.map(project => ({
    id: project.id.toString(),
    title: project.title,
    category: project.category || 'batiments',
    image: project.featured_image_url || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
    status: project.status === 'completed' ? 'Terminé' : 'En cours',
    description: project.description || '',
    client: project.client || '',
    date: project.completion_date || '',
    gallery: project.gallery_images || []
  }));

  if (loading) {
    return (
      <section id="realisations" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Nos Réalisations
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
              Découvrez nos <span className="text-accent">projets</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Un portfolio diversifié de projets réussis en Côte d'Ivoire
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="realisations" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Nos Réalisations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            Découvrez nos <span className="text-accent">projets</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un portfolio diversifié de projets réussis en Côte d'Ivoire
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <Card
              key={project.id}
              onClick={() => navigate(`/projet/${project.id}`)}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer animate-slide-up border-none bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-accent/80 transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {displayedProjects.length > 0 && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/projets')}
              className="bg-accent hover:bg-accent-light text-accent-foreground"
            >
              Voir tous les projets
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
