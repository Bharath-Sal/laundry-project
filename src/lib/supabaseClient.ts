import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== "undefined") {
    console.warn(
      "⚠️ Foldo: Supabase environment variables are not configured in .env.local. " +
      "Falling back to dummy credentials. Database integrations will run in dry-run mode."
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
