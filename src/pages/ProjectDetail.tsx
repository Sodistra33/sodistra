import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Building2, Loader2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  featured_image_url: string;
  gallery_images: string[];
  client: string | null;
  location: string | null;
  completion_date: string | null;
  status: string;
  is_published: boolean;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      // Calculer le statut basé sur la date d'achèvement et créer l'objet avec status
      if (data) {
        const isCompleted = data.completion_date 
          ? new Date(data.completion_date) <= new Date() 
          : false;
        
        const projectWithStatus: Project = {
          ...data,
          status: isCompleted ? 'completed' : 'en_cours'
        };
        
        setProject(projectWithStatus);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-accent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Projet non trouvé</h1>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 hover:text-accent"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl relative">
                <img
                  src={project.gallery_images?.[selectedImage] || project.featured_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.gallery_images && project.gallery_images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => setSelectedImage((prev) => 
                        prev === 0 ? project.gallery_images!.length - 1 : prev - 1
                      )}
                    >
                      <ChevronLeft className="h-6 w-6 text-primary" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() => setSelectedImage((prev) => 
                        prev === project.gallery_images!.length - 1 ? 0 : prev + 1
                      )}
                    >
                      <ChevronRight className="h-6 w-6 text-primary" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={`text-sm ${
                    project.status === "en_cours" 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {project.status === "en_cours" ? "En cours" : "Terminé"}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                {project.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    Détails du projet
                  </h3>
                  
                  <div className="space-y-4">
                    {project.client && (
                      <div className="flex items-start gap-3">
                        <User className="text-accent mt-1" size={20} />
                        <div>
                          <p className="text-sm text-muted-foreground">Client</p>
                          <p className="font-semibold text-primary">{project.client}</p>
                        </div>
                      </div>
                    )}

                    {project.completion_date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="text-accent mt-1" size={20} />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {project.status === "en_cours" ? "Date de fin prévue" : "Date de réalisation"}
                          </p>
                          <p className="font-semibold text-primary">
                            {new Date(project.completion_date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {project.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="text-accent mt-1" size={20} />
                        <div>
                          <p className="text-sm text-muted-foreground">Localisation</p>
                          <p className="font-semibold text-primary">{project.location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Building2 className="text-accent mt-1" size={20} />
                      <div>
                        <p className="text-sm text-muted-foreground">Catégorie</p>
                        <p className="font-semibold text-primary capitalize">
                          {project.category === 'batiments' ? 'Bâtiments' : 
                           project.category === 'infrastructures' ? 'Infrastructures' : 
                           'Rénovations'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-accent hover:bg-accent-light text-accent-foreground"
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  >
                    Contactez-nous
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/projets")}
                  >
                    Autres projets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
