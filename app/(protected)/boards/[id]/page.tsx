import { getCurrentUser } from '@/actions/auth/user';
import SingleBoard from '@/components/singleBoard';
import { User } from '@prisma/client';


interface PageProps {
  params: Promise<{ id: string }>; // Make it asynchronous
  // searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BoardPage({
  params: paramsPromise,
}: PageProps) {
  const params = await paramsPromise; // Await the Promise
  const id = params.id;
  const user = await getCurrentUser();

  return (
    <>
      <SingleBoard id={id} user={user as User} />
    </>
  );
}