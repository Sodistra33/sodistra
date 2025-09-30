import { useState } from "react";
import { Button } from "@/components/ui/button";
import building1 from "@/assets/project-building-1.jpg";
import building2 from "@/assets/project-building-2.jpg";
import infrastructure1 from "@/assets/project-infrastructure-1.jpg";
import infrastructure2 from "@/assets/project-infrastructure-2.jpg";
import renovation1 from "@/assets/project-renovation-1.jpg";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("tous");

  const projects = [
    {
      id: 1,
      title: "Immeuble de bureaux moderne",
      category: "batiments",
      image: building1,
    },
    {
      id: 2,
      title: "Complexe résidentiel",
      category: "batiments",
      image: building2,
    },
    {
      id: 3,
      title: "Pont autoroutier",
      category: "infrastructures",
      image: infrastructure1,
    },
    {
      id: 4,
      title: "Route nationale",
      category: "infrastructures",
      image: infrastructure2,
    },
    {
      id: 5,
      title: "Rénovation façade commerciale",
      category: "renovations",
      image: renovation1,
    },
  ];

  const filters = [
    { id: "tous", label: "Tous les projets" },
    { id: "batiments", label: "Bâtiments" },
    { id: "infrastructures", label: "Infrastructures" },
    { id: "renovations", label: "Rénovations" },
  ];

  const filteredProjects =
    activeFilter === "tous"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <section id="realisations" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Nos réalisations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            Découvrez nos <span className="text-accent">projets</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un portfolio diversifié de projets réussis en Côte d'Ivoire
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up animate-delay-100">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              variant={activeFilter === filter.id ? "default" : "outline"}
              className={
                activeFilter === filter.id
                  ? "bg-accent hover:bg-accent-light text-accent-foreground"
                  : "hover:border-accent hover:text-accent"
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-white font-bold text-xl mb-2">{project.title}</h3>
                  <span className="text-accent font-medium text-sm uppercase tracking-wider">
                    {filters.find((f) => f.id === project.category)?.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
