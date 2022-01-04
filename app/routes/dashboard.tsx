import { LoaderFunction, useLoaderData, Outlet, Link } from "remix";
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
    <div className="h-screen overflow-y-hidden flex flex-col">
      {/* <header className="p-4 bg-black text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1>Dashboard</h1>
          <p className="text-sm">{data.user.displayName}</p>
        </div>
      </header> */}
      <div className="flex divide-x h-full">
        <aside className="w-[300px] overflow-y-auto flex-shrink-0">
          <ul>
            {data.repos.map((repo) => {
              return (
                <li key={repo.id}>
                  <Link
                    className="block p-2"
                    to={`${data.user.displayName}/${repo.name}`}
                    // to={`${repo.name}`}
                  >
                    {repo.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="flex-1 overflow-y-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
