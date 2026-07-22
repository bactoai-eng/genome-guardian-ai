import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ContactSubmissionRow = {
  id: string;
  form_type: string;
  full_name: string;
  email: string;
  organization: string | null;
  message: string | null;
  metadata: unknown;
  created_at: string;
};

export const listContactSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ContactSubmissionRow[]> => {
    const { data, error } = await context.supabase
      .from("contact_submissions")
      .select("id, form_type, full_name, email, organization, message, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      // RLS denies non-admins — surface as Forbidden.
      throw new Error(error.message || "Forbidden");
    }
    return (data ?? []) as ContactSubmissionRow[];
  });
