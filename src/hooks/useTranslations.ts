import { useState, useEffect } from 'react';
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

const TRANSLATIONS_FILE = 'translations.json';
const STORAGE_BUCKET = 'brochures'; // Using existing bucket

export const useTranslations = () => {
  const [translations, setTranslations] = useState<TranslationsData>({
    blog_posts: {},
    projects: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(TRANSLATIONS_FILE);

      if (error) {
        // File doesn't exist yet, use empty translations
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

  const saveTranslations = async (newTranslations: TranslationsData) => {
    try {
      const blob = new Blob([JSON.stringify(newTranslations, null, 2)], { type: 'application/json' });
      
      // First try to remove existing file
      await supabase.storage.from(STORAGE_BUCKET).remove([TRANSLATIONS_FILE]);
      
      // Upload new file
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(TRANSLATIONS_FILE, blob, {
          contentType: 'application/json',
          upsert: true
        });

      if (error) throw error;

      setTranslations(newTranslations);
      return true;
    } catch (error) {
      console.error('Error saving translations:', error);
      return false;
    }
  };

  const updateBlogTranslation = async (postId: string, translation: ContentTranslation) => {
    const newTranslations = {
      ...translations,
      blog_posts: {
        ...translations.blog_posts,
        [postId]: translation
      }
    };
    return saveTranslations(newTranslations);
  };

  const updateProjectTranslation = async (projectId: string, translation: ContentTranslation) => {
    const newTranslations = {
      ...translations,
      projects: {
        ...translations.projects,
        [projectId]: translation
      }
    };
    return saveTranslations(newTranslations);
  };

  const getBlogTranslation = (postId: string): ContentTranslation | undefined => {
    return translations.blog_posts[postId];
  };

  const getProjectTranslation = (projectId: string): ContentTranslation | undefined => {
    return translations.projects[projectId];
  };

  return {
    translations,
    loading,
    fetchTranslations,
    updateBlogTranslation,
    updateProjectTranslation,
    getBlogTranslation,
    getProjectTranslation
  };
};
