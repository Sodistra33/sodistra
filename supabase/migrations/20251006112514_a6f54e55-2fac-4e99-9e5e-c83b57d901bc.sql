-- Add images array column to about_content table to support multiple images per content
ALTER TABLE public.about_content 
ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing image_path data to images array
UPDATE public.about_content 
SET images = ARRAY[image_path]
WHERE image_path IS NOT NULL AND image_path != '';