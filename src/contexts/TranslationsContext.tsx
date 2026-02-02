import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContentTranslation {
  title_en?: string;
  description_en?: string;
  excerpt_en?: string;
  content_en?: string;
  category_en?: string;
}

export interface TranslationsData {
  blog_posts: Record<string, ContentTranslation>;
  projects: Record<string, ContentTranslation>;
}

interface TranslationsContextType {
  translations: TranslationsData;
  loading: boolean;
  getBlogTranslation: (postId: string) => ContentTranslation | undefined;
  getProjectTranslation: (projectId: string) => ContentTranslation | undefined;
  refreshTranslations: () => Promise<void>;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

const TRANSLATIONS_FILE = 'translations.json';
const STORAGE_BUCKET = 'brochures';

export const TranslationsProvider = ({ children }: { children: ReactNode }) => {
  const [translations, setTranslations] = useState<TranslationsData>({
    blog_posts: {},
    projects: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(TRANSLATIONS_FILE);

      if (error) {
        if (error.message.includes('not found') || error.message.includes('Object not found')) {
          setTranslations({ blog_posts: {}, projects: {} });
          setLoading(false);
          return;
        }
        throw error;
      }

      const text = await data.text();
      const parsed = JSON.parse(text);
      setTranslations(parsed);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setTranslations({ blog_posts: {}, projects: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const getBlogTranslation = (postId: string): ContentTranslation | undefined => {
    return translations.blog_posts[postId];
  };

  const getProjectTranslation = (projectId: string): ContentTranslation | undefined => {
    return translations.projects[projectId];
  };

  const refreshTranslations = async () => {
    await fetchTranslations();
  };

  return (
    <TranslationsContext.Provider value={{
      translations,
      loading,
      getBlogTranslation,
      getProjectTranslation,
      refreshTranslations
    }}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useContentTranslations = () => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useContentTranslations must be used within a TranslationsProvider');
  }
  return context;
};
