-- Add attachment field to contact_messages table
ALTER TABLE public.contact_messages 
ADD COLUMN attachment_url text;

-- Create storage bucket for contact attachments if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-attachments', 'contact-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for contact-attachments bucket
CREATE POLICY "Anyone can upload contact attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'contact-attachments');

CREATE POLICY "Authenticated users can view contact attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'contact-attachments');