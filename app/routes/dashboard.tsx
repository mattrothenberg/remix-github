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
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <aside className="w-[300px] flex-shrink-0 bg-white flex flex-col border-r">
        <div className="h-12 flex items-center px-4 border-b flex-shrink-0">
          <p className="text-sm text-gray-600">Repositories</p>
        </div>
        <div className="flex-1 overflow-y-scroll p-2">
          <ul>
            {data.repos.map((repo) => {
              return (
                <li key={repo.id}>
                  <Link
                    className="flex justify-between items-center text-sm px-2 py-2 hover:bg-gray-50"
                    to={`${repo.name}`}
                  >
                    <span className="flex-1">{repo.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {repo.open_issues_count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full"
              src={data.user.avatar_url}
              alt="avatar"
            />
            <p className="text-sm">{data.user.displayName}</p>
          </div>
        </div>
      </aside>
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  );
}
