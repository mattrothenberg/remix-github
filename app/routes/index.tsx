import { Form, LoaderFunction, useLoaderData } from "remix";
import { authenticator } from "~/services/auth.server";
import { User } from "~/types";

interface LoaderData {
  user: User;
}

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);

  return {
    user,
  };
};

export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="h-screen flex items-center justify-center">
      {user ? (
        <Form action="/logout" method="post">
          <button type="submit" className="btn-primary">
            Logout
          </button>
        </Form>
      ) : (
        <Form action="/auth/github" method="post">
          <button type="submit" className="btn-primary">
            Login with GitHub
          </button>
        </Form>
      )}
    </div>
  );
}
