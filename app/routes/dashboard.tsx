import { Form, LoaderFunction, useLoaderData } from "remix";
import { requireUserSession } from "~/http.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, client } = await requireUserSession(request);
  const { data } = await client.get(
    `https://api.github.com/users/${user.displayName}/repos`,
    {
      headers: {
        Authorization: `token ${user.accessToken}`,
      },
    }
  );
  return {
    user,
    repos: data,
  };
};

export default function Dashboard() {
  const data = useLoaderData();
  return (
    <div>
      <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>
      <pre className="p-4">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
