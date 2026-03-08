import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL=https://jdnncemtvcjwrhernkoz.supabase.co
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkbm5jZW10dmNqd3JoZXJua296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjU0NTgsImV4cCI6MjA4NzY0MTQ1OH0.-elAaE7eyF6bAkiIBlZNWW1IpQ67fVO6KYAkPR6Th9o
);
