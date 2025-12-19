-- Add gallery_images column to hero_images table for multiple background images
ALTER TABLE public.hero_images 
ADD COLUMN gallery_images TEXT[] DEFAULT '{}'::text[];