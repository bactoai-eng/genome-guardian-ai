import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ContactSubmissionRow = {
  id: string;
  form_type: string;
  full_name: string;
  email: string;
  organization: string | null;
  message: string | null;
  metadata: string | null;
  created_at: string;
};

export const listContactSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("contact_submissions")
      .select("id, form_type, full_name, email, organization, message, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      throw new Error(error.message || "Forbidden");
    }
    const rows: ContactSubmissionRow[] = (data ?? []).map((r) => ({
      id: r.id,
      form_type: r.form_type,
      full_name: r.full_name,
      email: r.email,
      organization: r.organization,
      message: r.message,
      metadata: r.metadata == null ? null : JSON.stringify(r.metadata),
      created_at: r.created_at,
    }));
    return rows;
  });
