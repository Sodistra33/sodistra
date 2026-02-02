import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Share2, ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isVideoUrl } from "@/lib/mediaUtils";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  gallery_images: string[];
  category: string;
  published_at: string;
  is_published: boolean;
}

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Article non trouvé</h1>
          <Button onClick={() => navigate("/actualites")}>Retour</Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const shareUrl = window.location.href;
    
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
        alert("Lien copié dans le presse-papier !");
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20 bg-secondary">
        <div className="container mx-auto px-4">
          <Button
            onClick={() => navigate("/actualites")}
            variant="ghost"
            className="mb-8 text-primary hover:text-accent"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour
          </Button>

          <article className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg overflow-hidden">
            {(article.gallery_images && article.gallery_images.length > 0) || article.featured_image_url ? (
              <div className="aspect-square overflow-hidden relative bg-muted flex items-center justify-center">
                {(() => {
                  const currentMediaUrl = article.gallery_images && article.gallery_images.length > 0
                    ? article.gallery_images[selectedImage]
                    : article.featured_image_url!;
                  
                  return isVideoUrl(currentMediaUrl) ? (
                    <video
                      src={currentMediaUrl}
                      className="max-w-full max-h-full object-contain"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={currentMediaUrl}
                      alt={article.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  );
                })()}
                {article.gallery_images && article.gallery_images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? article.gallery_images!.length - 1 : prev - 1
                        )
                      }
                    >
                      <ChevronLeft className="h-6 w-6 text-primary" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === article.gallery_images!.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      <ChevronRight className="h-6 w-6 text-primary" />
                    </Button>
                  </>
                )}
              </div>
            ) : null}

            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={16} className="mr-2" />
                    {new Date(article.published_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="text-primary hover:text-accent hover:border-accent"
                >
                  <Share2 size={18} className="mr-2" />
                  Partager
                </Button>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
                {article.title}
              </h1>

              <div 
                className="prose prose-lg max-w-none text-foreground
                  prose-headings:text-primary prose-headings:font-bold
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-ul:text-muted-foreground prose-ul:mb-6
                  prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Vous avez aimé cet article ? Partagez-le !
                  </p>
                  <Button
                    onClick={handleShare}
                    className="bg-accent hover:bg-accent-light text-accent-foreground"
                  >
                    <Share2 size={18} className="mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
