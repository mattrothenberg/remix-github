import { LoaderFunction, useLoaderData } from "remix";
import { requireUserSession } from "~/http.server";
import { RepositoryList, User } from "~/types";

interface LoaderData {
  user: User;
  repos: RepositoryList;
}

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
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <ul>
        {data.repos.map((repo) => {
          return (
            <li key={repo.id}>
              <a href={repo.html_url}>{repo.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
