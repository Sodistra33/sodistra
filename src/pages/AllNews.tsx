import { Calendar, Share2, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategoryTranslation } from "@/lib/contentTranslations";
import { useContentTranslations } from "@/contexts/TranslationsContext";
import { isVideoUrl } from "@/lib/mediaUtils";

const AllNews = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { getBlogTranslation } = useContentTranslations();
  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      setDbArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (article: any) => {
    const translation = getBlogTranslation(article.id);
    const displayTitle = (language === 'en' && translation?.title_en) ? translation.title_en : article.title;
    const displayExcerpt = (language === 'en' && translation?.excerpt_en) ? translation.excerpt_en : article.excerpt;
    
    if (navigator.share) {
      navigator.share({
        title: displayTitle,
        text: displayExcerpt,
        url: `${window.location.origin}/actualite/${article.id}`
      }).catch(() => {
        console.log("Share cancelled");
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
  };

  const translateCategory = (category: string) => {
    const key = getCategoryTranslation(category);
    return key ? t(key) : category;
  };

  const getDisplayContent = (article: any) => {
    const translation = getBlogTranslation(article.id);
    return {
      title: (language === 'en' && translation?.title_en) ? translation.title_en : article.title,
      excerpt: (language === 'en' && translation?.excerpt_en) ? translation.excerpt_en : article.excerpt,
      category: (language === 'en' && translation?.category_en) ? translation.category_en : translateCategory(article.category)
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <Button
              variant="outline"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const element = document.getElementById("actualites");
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: 'smooth'
                    });
                  }
                }, 100);
              }}
              className="mb-8"
            >
              ← {t('blog.back')}
            </Button>

            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              {t('blog.section_title')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4">
              {t('blog.all_title')} <span className="text-accent">{t('blog.all_title_accent')}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('blog.all_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
          ) : dbArticles.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">{t('blog.no_articles')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbArticles.map((article: any, index: number) => {
                const display = getDisplayContent(article);
                return (
                  <Card
                    key={article.id}
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-video overflow-hidden">
                      {isVideoUrl(article.featured_image_url) ? (
                        <video
                          src={article.featured_image_url}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={article.featured_image_url}
                          alt={display.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                          {display.category}
                        </span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar size={16} className="mr-1" />
                          {formatDate(article.published_at)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                        {display.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{display.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="link"
                          className="p-0 h-auto text-accent"
                          onClick={() => navigate(`/actualite/${article.id}`)}
                        >
                          {t('blog.read_more')} →
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
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
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllNews;
