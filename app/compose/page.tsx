import Composer from "@/components/Composer";
// TODO SUPABASE AUTH: redirect to /login if the user is not signed in.
export default function ComposePage() {
  return (<><h1 className="mb-4 text-2xl font-semibold">New post</h1><Composer /></>);
}
