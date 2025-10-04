import { Calendar, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const navigate = useNavigate();
  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setDbArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (article: any) => {
    const shareUrl = `${window.location.origin}/actualite/${article.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: shareUrl,
      }).catch(() => {
        console.log("Partage annulé");
      });
    } else {
      // Fallback: copier le lien dans le presse-papier
      navigator.clipboard.writeText(shareUrl).then(() => {
        console.log("Lien copié dans le presse-papier");
      });
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

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {dbArticles.length === 0 ? (
              <p className="text-center text-muted-foreground">Aucune actualité disponible pour le moment.</p>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dbArticles.map((article: any, index: number) => (
                    <Card
                      key={`db-${article.id}`}
                      className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.featured_image_url}
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
                            {new Date(article.published_at).toLocaleDateString('fr-FR')}
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

                <div className="text-center mt-12">
                  <Button
                    size="lg"
                    onClick={() => navigate('/actualites')}
                    className="bg-accent hover:bg-accent-light text-accent-foreground"
                  >
                    Voir plus d'actualités
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
