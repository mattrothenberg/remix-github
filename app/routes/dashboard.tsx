import { LoaderFunction, useLoaderData, Outlet, NavLink, Form } from "remix";
import { GoEye, GoIssueOpened, GoRepoForked, GoStar } from "react-icons/go";
import { requireUserSession } from "~/http.server";
import { RepositoryList, User } from "~/types";
import { LogoutIcon } from "@heroicons/react/solid";

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
          <ul className="divide-y divide-gray-100">
            {data.repos.map((repo) => {
              return (
                <li key={repo.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `${
                        isActive ? "bg-blue-700 text-white" : "hover:bg-gray-50"
                      } p-3 group block rounded`
                    }
                    to={`${repo.name}`}
                  >
                    <p>{repo.name}</p>
                    <div className="mt-1 text-xs opacity-50">
                      <ul className="flex items-center space-x-3">
                        <li className="flex items-center space-x-1">
                          <GoRepoForked />
                          <span>{repo.forks_count}</span>
                        </li>
                        <li className="flex items-center space-x-1">
                          <GoStar />
                          <span>{repo.stargazers_count}</span>
                        </li>
                        <li className="flex items-center space-x-1">
                          <GoEye />
                          <span>{repo.watchers_count}</span>
                        </li>
                        <li className="flex items-center space-x-1">
                          <GoIssueOpened />
                          <span>{repo.open_issues_count}</span>
                        </li>
                      </ul>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t p-4 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full"
              src={data.user.avatar_url}
              alt="avatar"
            />
            <p className="text-sm">{data.user.displayName}</p>
          </div>
          <Form method="post" action="/logout">
            <button className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600">
              <LogoutIcon className="w-4" />
            </button>
          </Form>
        </div>
      </aside>
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  );
}
