import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import {
  LoaderFunction,
  NavLink,
  Outlet,
  useLoaderData,
  useParams,
} from "remix";
import { requireUserSession } from "~/http.server";
import { RepoDetail, User } from "~/types";

export interface RepoDetailLayoutLoaderData {
  repo: RepoDetail;
  user: User;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { user, client } = await requireUserSession(request);

  try {
    const { data: repo } = await client.get<RepoDetail>(
      `/repos/${user.displayName}/${params.repo}`
    );

    return {
      user,
      repo,
    };
  } catch (e) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function RepoDetailLayout() {
  const data = useLoaderData<RepoDetailLayoutLoaderData>();
  const params = useParams();

  const { repo } = params;

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white h-12 flex items-center px-3 border-b flex-shrink-0">
        <a
          className="text-sm text-gray-600 hover:bg-gray-100 py-1 px-2 rounded-md"
          target="_blank"
          rel="noopener"
          href={`https://github.com/${data.user.displayName}/${repo}`}
        >
          {data.user.displayName} / {repo}
        </a>
      </div>
      <div className="bg-white border-b flex-shrink-0 flex">
        <NavLink
          end
          className={({ isActive }) =>
            `${
              isActive
                ? "border-blue-500"
                : "border-transparent hover:border-gray-200"
            } text-xs border-b-2  tracking-wide uppercase p-4 block`
          }
          to={`/dashboard/${repo}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive
                ? "border-blue-500"
                : "border-transparent hover:border-gray-200"
            } text-xs border-b-2  tracking-wide uppercase p-4 block`
          }
          to="issues"
        >
          Issues
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${
              isActive
                ? "border-blue-500"
                : "border-transparent hover:border-gray-200"
            } text-xs border-b-2  tracking-wide uppercase p-4 block`
          }
          to="pull-requests"
        >
          Pull Requests
        </NavLink>
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export const CatchBoundary: CatchBoundaryComponent = (props) => {
  const params = useParams();
  const { repo } = params;

  return (
    <div className="p-4">
      <p className="text-red-600 text-sm">
        Couldn't find a repo by the name {repo}.
      </p>
    </div>
  );
};
