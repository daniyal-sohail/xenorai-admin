import { redirect } from "next/navigation";

export default function HomePage() {
  // Immediately redirect to /dashboard
  redirect("/dashboard");

  // This component never renders
  return null;
}
