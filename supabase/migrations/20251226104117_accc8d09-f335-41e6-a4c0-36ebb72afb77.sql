-- Make the contact-attachments bucket public so attachment links work in emails
UPDATE storage.buckets 
SET public = true 
WHERE id = 'contact-attachments';