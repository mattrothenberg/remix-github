import { Link } from "react-router-dom";
import { LoaderFunction, Outlet, useLoaderData } from "remix";
import formatDistance from "date-fns/formatDistance";
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
  const nonDependabot = issues.filter(
    (issue) => issue.user?.login !== "dependabot[bot]"
  );

  return (
    <>
      <div className="mb-4 text-right">
        <Link className="btn-primary w-auto" to="new">
          New Issue
        </Link>
      </div>
      <div className="p-4 bg-white shadow rounded-md">
        {nonDependabot.length === 0 ? (
          <div className="p-4">
            <p className="text-center text-sm text-gray-600">
              No issues for this repository.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {nonDependabot.map((issue) => {
              return (
                <li className="py-3 first:pt-0 last:pb-0" key={issue.number}>
                  <Link className="hover:underline" to={`${issue.number}`}>
                    {issue.title}
                  </Link>
                  <div className="text-xs mt-1 text-gray-600">
                    <p>
                      #{issue.number} opened{" "}
                      {formatDistance(
                        Date.parse(issue.created_at),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Outlet />
    </>
  );
}
