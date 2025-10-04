-- Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    location TEXT,
    completion_date DATE,
    images TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published projects"
ON public.projects FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Allow authenticated users to manage projects"
ON public.projects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    featured_image_url TEXT,
    author TEXT DEFAULT 'SODISTRA',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published blog posts"
ON public.blog_posts FOR SELECT
TO public
USING (is_published = true);

CREATE POLICY "Allow authenticated users to manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Partners table
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_path TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active partners"
ON public.partners FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage partners"
ON public.partners FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Brochures table
CREATE TABLE IF NOT EXISTS public.brochures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.brochures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active brochures"
ON public.brochures FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage brochures"
ON public.brochures FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_brochures_updated_at BEFORE UPDATE ON public.brochures
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- About content table
CREATE TABLE IF NOT EXISTS public.about_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_path TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active about content"
ON public.about_content FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage about content"
ON public.about_content FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Hero images table
CREATE TABLE IF NOT EXISTS public.hero_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_path TEXT NOT NULL,
    button_text TEXT,
    button_link TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active hero images"
ON public.hero_images FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage hero images"
ON public.hero_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON public.hero_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to create contact messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage contact messages"
ON public.contact_messages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active services"
ON public.services FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage services"
ON public.services FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-logos', 'partner-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('about-images', 'about-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('brochures', 'brochures', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for hero images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can upload hero images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can update hero images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can delete hero images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-images');

CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can update project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can delete project images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Public read access for partner logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can upload partner logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can update partner logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated users can delete partner logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'partner-logos');

CREATE POLICY "Public read access for about images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'about-images');

CREATE POLICY "Authenticated users can upload about images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'about-images');

CREATE POLICY "Authenticated users can update about images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'about-images');

CREATE POLICY "Authenticated users can delete about images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'about-images');

CREATE POLICY "Public read access for brochures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brochures');

CREATE POLICY "Authenticated users can upload brochures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brochures');

CREATE POLICY "Authenticated users can update brochures"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brochures');

CREATE POLICY "Authenticated users can delete brochures"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brochures');