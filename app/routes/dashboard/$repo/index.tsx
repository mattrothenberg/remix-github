import { Link, useOutletContext } from "remix";
import { RepoDetailLayoutLoaderData } from "../$repo";

export default function RepoDetail() {
  const { issues } = useOutletContext<RepoDetailLayoutLoaderData>();

  return (
    <div className="p-4">
      <div className="bg-white shadow rounded">
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">Open Issues</p>
        </div>
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
      </div>
    </div>
  );
}
