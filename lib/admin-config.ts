// Extra safety layer on top of a valid Supabase Auth session: only these
// emails are treated as admins, even if someone else signs up on your
// Supabase project. Add/remove emails here as needed.
export const ADMIN_EMAILS = ["admin@urbanfits.store"];
