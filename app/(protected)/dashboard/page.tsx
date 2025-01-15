import { getCurrentUser } from "@/actions/auth/user";
import Dashboard from "@/components/dashboard";
import { User } from "@prisma/client";

export default async function Page() {
  const user = await getCurrentUser();
  
  return <Dashboard user={user as User} />;
}
