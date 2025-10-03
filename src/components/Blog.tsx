import { Calendar, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Blog = () => {
  const navigate = useNavigate();
  const articles = [
    {
      id: 1,
      title: "Participation au Salon International de la Construction 2025",
      date: "15 Mars 2025",
      excerpt: "SODISTRA sera présente au Salon International de la Construction d'Abidjan. Venez découvrir nos dernières innovations et rencontrer notre équipe.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      category: "Événement",
    },
    {
      id: 2,
      title: "Nouveau projet : Centre commercial moderne à Cocody",
      date: "10 Mars 2025",
      excerpt: "Nous sommes fiers d'annoncer le lancement d'un nouveau projet ambitieux : la construction d'un centre commercial de 15 000 m² à Cocody.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      category: "Nouveauté",
    },
    {
      id: 3,
      title: "Journée Portes Ouvertes : Découvrez nos chantiers",
      date: "5 Mars 2025",
      excerpt: "SODISTRA organise une journée portes ouvertes sur nos chantiers en cours. Une occasion unique de voir nos équipes en action.",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
      category: "Événement",
    },
  ];

  const handleShare = (article: typeof articles[0]) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {
        console.log("Partage annulé");
      });
    } else {
      console.log("Partage non supporté");
    }
  };

  return (
    <section id="actualites" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Actualités & Événements
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
            Restez <span className="text-accent">informés</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez nos dernières actualités, événements et nouveautés
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card
              key={article.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={16} className="mr-1" />
                    {article.date}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-accent"
                    onClick={() => navigate(`/actualite/${article.id}`)}
                  >
                    Lire la suite →
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(article);
                    }}
                    className="text-muted-foreground hover:text-accent"
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
