-- Ajouter les colonnes manquantes à la table projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS client TEXT;

-- Migrer les données existantes: mettre la première image dans featured_image_url
UPDATE public.projects 
SET featured_image_url = CASE 
  WHEN images IS NOT NULL AND array_length(images, 1) > 0 
  THEN images[1] 
  ELSE NULL 
END
WHERE featured_image_url IS NULL;

-- Migrer les autres images dans gallery_images
UPDATE public.projects 
SET gallery_images = CASE 
  WHEN images IS NOT NULL AND array_length(images, 1) > 1 
  THEN images[2:array_length(images, 1)] 
  ELSE ARRAY[]::TEXT[] 
END
WHERE gallery_images IS NULL;