GRANT INSERT ON public.contact_submissions TO anon;
GRANT INSERT ON public.contact_submissions TO authenticated;

CREATE POLICY "Anyone can submit a contact enquiry"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);