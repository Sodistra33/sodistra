-- Add gallery_images column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.blog_posts.gallery_images IS 'Array of image URLs for the article gallery';