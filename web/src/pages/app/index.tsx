import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h1>Hello {user.name}!</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <a href="/api/auth/logout">logout</a>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();
