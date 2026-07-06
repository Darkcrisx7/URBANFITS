// Reference only — not wired into the app yet.
// Once you have a Supabase project, install @supabase/supabase-js,
// set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local,
// and use a client like this in place of contexts/auth-context.tsx.

// import { createClient } from "@supabase/supabase-js";
//
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
//
// export async function signUp(email: string, password: string) {
//   return supabase.auth.signUp({ email, password });
// }
//
// export async function signIn(email: string, password: string) {
//   return supabase.auth.signInWithPassword({ email, password });
// }
//
// export async function signInWithGoogle() {
//   return supabase.auth.signInWithOAuth({ provider: "google" });
// }
//
// export async function signOut() {
//   return supabase.auth.signOut();
// }
