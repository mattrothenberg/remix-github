import { LoaderFunction } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return {
    repos: [],
  };
};

export default function Dashboard() {
  return <div className="p-4">You made it</div>;
}