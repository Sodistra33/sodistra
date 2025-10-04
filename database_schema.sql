-- ========================================
-- SCRIPT SQL DE CORRECTION DES TABLES SODISTRA
-- ========================================
-- À exécuter dans Supabase SQL Editor
-- ATTENTION: Ce script supprime et recrée toutes les tables (sauf profiles et user_roles)

-- Fonction helper pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- 1. TABLE PROJECTS
-- ========================================
DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  location text,
  completion_date date,
  featured_image_url text,
  gallery_images text[], -- Array d'URLs d'images
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir les projets publiés
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
CREATE POLICY "Anyone can view published projects"
  ON public.projects FOR SELECT
  USING (is_published = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
CREATE POLICY "Admins can manage all projects"
  ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 2. TABLE BLOG_POSTS
-- ========================================
DROP TABLE IF EXISTS public.blog_posts CASCADE;

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL,
  featured_image_url text,
  author text DEFAULT 'SODISTRA',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir les posts publiés
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.blog_posts;
CREATE POLICY "Admins can manage all posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 3. TABLE PARTNERS
-- ========================================
DROP TABLE IF EXISTS public.partners CASCADE;

CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_path text,
  website_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir les partenaires actifs
DROP POLICY IF EXISTS "Anyone can view active partners" ON public.partners;
CREATE POLICY "Anyone can view active partners"
  ON public.partners FOR SELECT
  USING (is_active = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
CREATE POLICY "Admins can manage partners"
  ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_partners_updated_at ON public.partners;
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 4. TABLE BROCHURES
-- ========================================
DROP TABLE IF EXISTS public.brochures CASCADE;

CREATE TABLE public.brochures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_type text,
  file_size bigint, -- en bytes
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.brochures ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir les brochures actives
DROP POLICY IF EXISTS "Anyone can view active brochures" ON public.brochures;
CREATE POLICY "Anyone can view active brochures"
  ON public.brochures FOR SELECT
  USING (is_active = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage brochures" ON public.brochures;
CREATE POLICY "Admins can manage brochures"
  ON public.brochures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_brochures_updated_at ON public.brochures;
CREATE TRIGGER update_brochures_updated_at
  BEFORE UPDATE ON public.brochures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. TABLE ABOUT_CONTENT
-- ========================================
DROP TABLE IF EXISTS public.about_content CASCADE;

CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_path text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir le contenu actif
DROP POLICY IF EXISTS "Anyone can view active about content" ON public.about_content;
CREATE POLICY "Anyone can view active about content"
  ON public.about_content FOR SELECT
  USING (is_active = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage about content" ON public.about_content;
CREATE POLICY "Admins can manage about content"
  ON public.about_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_about_content_updated_at ON public.about_content;
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. TABLE HERO_IMAGES
-- ========================================
DROP TABLE IF EXISTS public.hero_images CASCADE;

CREATE TABLE public.hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_path text NOT NULL,
  button_text text,
  button_link text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir les hero images actives
DROP POLICY IF EXISTS "Anyone can view active hero images" ON public.hero_images;
CREATE POLICY "Anyone can view active hero images"
  ON public.hero_images FOR SELECT
  USING (is_active = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage hero images" ON public.hero_images;
CREATE POLICY "Admins can manage hero images"
  ON public.hero_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_hero_images_updated_at ON public.hero_images;
CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 7. TABLE CONTACT_MESSAGES
-- ========================================
DROP TABLE IF EXISTS public.contact_messages CASCADE;

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut créer un message
DROP POLICY IF EXISTS "Anyone can create contact message" ON public.contact_messages;
CREATE POLICY "Anyone can create contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- RLS: Admins peuvent tout lire et gérer
DROP POLICY IF EXISTS "Admins can manage messages" ON public.contact_messages;
CREATE POLICY "Admins can manage messages"
  ON public.contact_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- 8. TABLE SERVICES (optionnelle)
-- ========================================
DROP TABLE IF EXISTS public.services CASCADE;

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text, -- nom de l'icône lucide ou URL
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS: Tout le monde peut voir les services actifs
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

-- RLS: Admins peuvent tout gérer
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 9. STORAGE BUCKETS
-- ========================================

-- Bucket pour les images hero
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket pour les images de projets
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket pour les images de blog
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket pour les logos de partenaires
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket pour les images about
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket pour les brochures (PDFs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('brochures', 'brochures', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ========================================
-- 10. STORAGE POLICIES
-- ========================================

-- Policies pour hero-images
DROP POLICY IF EXISTS "Public can view hero images" ON storage.objects;
CREATE POLICY "Public can view hero images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hero-images');

DROP POLICY IF EXISTS "Admins can upload hero images" ON storage.objects;
CREATE POLICY "Admins can upload hero images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update hero images" ON storage.objects;
CREATE POLICY "Admins can update hero images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete hero images" ON storage.objects;
CREATE POLICY "Admins can delete hero images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

-- Policies pour project-images
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admins can upload project images" ON storage.objects;
CREATE POLICY "Admins can upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete project images" ON storage.objects;
CREATE POLICY "Admins can delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

-- Policies pour blog-images
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'));

-- Policies pour partner-logos
DROP POLICY IF EXISTS "Public can view partner logos" ON storage.objects;
CREATE POLICY "Public can view partner logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-logos');

DROP POLICY IF EXISTS "Admins can upload partner logos" ON storage.objects;
CREATE POLICY "Admins can upload partner logos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete partner logos" ON storage.objects;
CREATE POLICY "Admins can delete partner logos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'admin'));

-- Policies pour about-images
DROP POLICY IF EXISTS "Public can view about images" ON storage.objects;
CREATE POLICY "Public can view about images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'about-images');

DROP POLICY IF EXISTS "Admins can upload about images" ON storage.objects;
CREATE POLICY "Admins can upload about images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'about-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete about images" ON storage.objects;
CREATE POLICY "Admins can delete about images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'about-images' AND public.has_role(auth.uid(), 'admin'));

-- Policies pour brochures
DROP POLICY IF EXISTS "Public can view brochures" ON storage.objects;
CREATE POLICY "Public can view brochures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brochures');

DROP POLICY IF EXISTS "Admins can upload brochures" ON storage.objects;
CREATE POLICY "Admins can upload brochures"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'brochures' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete brochures" ON storage.objects;
CREATE POLICY "Admins can delete brochures"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'brochures' AND public.has_role(auth.uid(), 'admin'));

-- ========================================
-- FIN DU SCRIPT
-- ========================================
-- Toutes les tables sont maintenant configurées correctement
-- avec les bonnes colonnes et les RLS appropriées.
