-- Create table for job offers
CREATE TABLE public.job_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  location TEXT,
  contract_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to active job offers
CREATE POLICY "Allow public read access to active job offers" 
ON public.job_offers 
FOR SELECT 
USING (is_active = true);

-- Create policies for authenticated users to manage job offers
CREATE POLICY "Allow authenticated users to manage job offers" 
ON public.job_offers 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_offers_updated_at
BEFORE UPDATE ON public.job_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();