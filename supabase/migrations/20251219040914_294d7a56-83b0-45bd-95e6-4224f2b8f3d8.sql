-- Create table for social links
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Public read access for active links
CREATE POLICY "Allow public read access to active social links"
ON public.social_links
FOR SELECT
USING (is_active = true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage social links"
ON public.social_links
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default social links
INSERT INTO public.social_links (platform, url, icon_name, display_order) VALUES
('Facebook', 'https://facebook.com', 'Facebook', 1),
('Instagram', 'https://instagram.com', 'Instagram', 2),
('LinkedIn', 'https://linkedin.com', 'Linkedin', 3),
('WhatsApp', 'https://wa.me/', 'MessageCircle', 4);