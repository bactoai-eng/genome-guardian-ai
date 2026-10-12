REVOKE INSERT ON public.contact_submissions FROM anon, authenticated;
GRANT INSERT (form_type, full_name, email, organization, message, metadata) ON public.contact_submissions TO anon, authenticated;
DROP POLICY IF EXISTS "Anyone can submit a contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a contact form" ON public.contact_submissions
FOR INSERT TO anon, authenticated
WITH CHECK (
  form_type IN ('demo','partner','newsletter','contact','general')
  AND char_length(full_name) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 254
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (organization IS NULL OR char_length(organization) <= 150)
  AND (message IS NULL OR char_length(message) <= 5000)
  AND (metadata IS NULL OR octet_length(metadata::text) <= 4000)
);