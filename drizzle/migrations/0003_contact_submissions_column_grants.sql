REVOKE INSERT ON public.contact_submissions FROM anon, authenticated;
GRANT INSERT (form_type, full_name, email, organization, message, metadata) ON public.contact_submissions TO anon, authenticated;