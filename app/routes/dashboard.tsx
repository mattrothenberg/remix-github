import { LoaderFunction, useLoaderData } from "remix";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Authorization", `token ${user.accessToken}`);

  const reposRes = await fetch(
    `https://api.github.com/users/${user.displayName}/repos`,
    {
      headers: requestHeaders,
    }
  );

  const repos = await reposRes.json();

  return {
    user,
    repos,
  };
};

export default function Dashboard() {
  const data = useLoaderData();
  return <pre className="p-4">{JSON.stringify(data, null, 2)}</pre>;
}
