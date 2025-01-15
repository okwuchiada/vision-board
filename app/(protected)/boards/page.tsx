import { getCurrentUser } from "@/actions/auth/user";
import Boards from "@/components/boards";
import { User } from "@prisma/client";

export default async function BoardsPage() {
  const user = await getCurrentUser();
  return <Boards user={user as User} />;
}
