import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import {
  LoaderFunction,
  useLoaderData,
  useParams,
  Outlet,
  NavLink,
} from "remix";
import { requireUserSession } from "~/http.server";
import { IssueList, RepoDetail, User } from "~/types";

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
      <div className="bg-white p-4 border-b flex-shrink-0">
        <p className="text-sm text-gray-600">
          {data.user.displayName} / {repo}
        </p>
      </div>
      <div className="bg-white border-b flex-shrink-0 flex">
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
