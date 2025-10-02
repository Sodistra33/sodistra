import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import building1 from "@/assets/project-building-1.jpg";
import building2 from "@/assets/project-building-2.jpg";
import infrastructure1 from "@/assets/project-infrastructure-1.jpg";
import infrastructure2 from "@/assets/project-infrastructure-2.jpg";
import renovation1 from "@/assets/project-renovation-1.jpg";
import { Project } from "@/components/Projects";
import { useState } from "react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  // Same projects data as in Projects component
  const projects: Project[] = [
    {
      id: 1,
      title: "Immeuble de bureaux moderne",
      category: "batiments",
      image: building1,
      status: "Terminé",
      description: "Construction d'un immeuble de bureaux de 12 étages avec des espaces modernes et équipements de pointe, situé au cœur du Plateau.",
      client: "Groupe ABC Investissements",
      date: "Janvier 2024",
      gallery: [building1, building2],
    },
    {
      id: 2,
      title: "Complexe résidentiel",
      category: "batiments",
      image: building2,
      status: "En cours",
      description: "Développement d'un complexe résidentiel de 150 logements avec infrastructures communes : piscine, salle de sport, espaces verts.",
      client: "SOGEPROM Côte d'Ivoire",
      date: "Mars 2025",
      gallery: [building2, building1],
    },
    {
      id: 3,
      title: "Pont autoroutier",
      category: "infrastructures",
      image: infrastructure1,
      status: "Terminé",
      description: "Construction d'un pont autoroutier de 800 mètres reliant deux axes stratégiques de la ville d'Abidjan.",
      client: "Ministère des Infrastructures",
      date: "Décembre 2023",
      gallery: [infrastructure1, infrastructure2],
    },
    {
      id: 4,
      title: "Route nationale",
      category: "infrastructures",
      image: infrastructure2,
      status: "En cours",
      description: "Réhabilitation de 45 km de route nationale avec élargissement à 4 voies et construction d'ouvrages d'art.",
      client: "AGEROUTE",
      date: "Juin 2025",
      gallery: [infrastructure2, infrastructure1],
    },
    {
      id: 5,
      title: "Rénovation façade commerciale",
      category: "renovations",
      image: renovation1,
      status: "Terminé",
      description: "Rénovation complète de la façade d'un centre commercial incluant isolation thermique, peinture et mise aux normes.",
      client: "Centre Commercial Cap Sud",
      date: "Septembre 2024",
      gallery: [renovation1, building1],
    },
  ];

  const project = projects.find((p) => p.id === Number(id));

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
            onClick={() => navigate("/")}
            className="mb-8 hover:text-accent"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour aux projets
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={project.gallery[selectedImage]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {project.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-accent"
                        : "border-transparent hover:border-accent/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  className={`text-sm ${
                    project.status === "En cours" 
                      ? "bg-accent text-accent-foreground" 
                      : "bg-green-600 text-white"
                  }`}
                >
                  {project.status}
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
                    <div className="flex items-start gap-3">
                      <User className="text-accent mt-1" size={20} />
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="font-semibold text-primary">{project.client}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="text-accent mt-1" size={20} />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {project.status === "En cours" ? "Date de fin prévue" : "Date de réalisation"}
                        </p>
                        <p className="font-semibold text-primary">{project.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="text-accent mt-1" size={20} />
                      <div>
                        <p className="text-sm text-muted-foreground">Catégorie</p>
                        <p className="font-semibold text-primary capitalize">
                          {project.category}
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
                      const element = document.querySelector("#contact");
                      if (element) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setTimeout(() => {
                          navigate("/#contact");
                        }, 300);
                      }
                    }}
                  >
                    Contactez-nous
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/")}
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
