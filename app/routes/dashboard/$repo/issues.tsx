import { Link } from "react-router-dom";
import { LoaderFunction, Outlet, useLoaderData } from "remix";
import { requireUserSession } from "~/http.server";
import { IssueList, User } from "~/types";

interface LoaderData {
  user: User;
  issues: IssueList;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { user, client } = await requireUserSession(request);

  const { data: issues } = await client.get(
    `/repos/${user.displayName}/${params.repo}/issues`
  );

  return {
    issues,
  };
};

export default function IssuesLayout() {
  const { issues } = useLoaderData<LoaderData>();

  return (
    <div className="p-4 bg-white shadow">
      {issues.length === 0 ? (
        <div className="p-4">
          <p className="text-center text-sm text-gray-600">
            No issues for this repository.
          </p>
        </div>
      ) : (
        <div className="p-4">
          <ul className="divide-y">
            {issues.map((issue) => {
              return (
                <Link
                  className="block p-2 text-sm"
                  key={issue.id}
                  to={`issues/${issue.id}`}
                >
                  {issue.title}
                </Link>
              );
            })}
          </ul>
        </div>
      )}
      <Outlet />
    </div>
  );
}
