import { AdminPasswordSignIn } from "@/ui/admin/admin-password-sign-in";
import { getAdminPasswordAccessConfig } from "@/auth/admin-password-access";

export default async function AdminSignInPage({
  searchParams
}: Readonly<{ searchParams?: Promise<{ error?: string }> }>) {
  const config = getAdminPasswordAccessConfig();
  const params = await searchParams;
  const reason = config.enabled
    ? config.configured ? "password_required" : "password_access_unconfigured"
    : "password_access_disabled";

  return <AdminPasswordSignIn reason={reason} hasError={params?.error === "invalid"} />;
}
