-- Add status column to projects table
ALTER TABLE public.projects 
ADD COLUMN status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed'));