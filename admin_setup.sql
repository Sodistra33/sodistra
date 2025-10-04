-- ========================================
-- SCRIPT SQL À EXÉCUTER DANS SUPABASE
-- ========================================

-- 1. Créer le type enum pour les rôles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Créer la table user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Créer la fonction has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Politiques RLS pour user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Créer la table hero_images
CREATE TABLE IF NOT EXISTS public.hero_images (
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

DROP POLICY IF EXISTS "Anyone can view active hero images" ON public.hero_images;
CREATE POLICY "Anyone can view active hero images"
  ON public.hero_images FOR SELECT TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage hero images" ON public.hero_images;
CREATE POLICY "Admins can manage hero images"
  ON public.hero_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_hero_images_updated_at ON public.hero_images;
CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Créer le bucket hero-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques pour le bucket hero-images
DROP POLICY IF EXISTS "Public can view hero images" ON storage.objects;
CREATE POLICY "Public can view hero images"
  ON storage.objects FOR SELECT TO public
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

-- ========================================
-- CRÉATION DE L'UTILISATEUR ADMIN
-- ========================================
-- Méthode recommandée: Créer l'utilisateur via le Dashboard Supabase
-- 1. Aller dans Authentication > Users
-- 2. Cliquer "Add user" > "Create new user"
-- 3. Email: sodistra.net@gmail.com
-- 4. Auto Confirm User: OUI
-- 5. Copier l'UUID de l'utilisateur créé
-- 6. Exécuter les requêtes ci-dessous en remplaçant USER_UUID_ICI

-- Après avoir créé l'utilisateur dans le dashboard:
/*
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID_ICI', 'admin');

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"full_name": "Sodistra Admin"}'::jsonb
WHERE id = 'USER_UUID_ICI';
*/
