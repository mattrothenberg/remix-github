import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { LoaderFunction, useLoaderData, useParams } from "remix";
import { requireUserSession } from "~/http.server";
import { IssueList, RepoDetail } from "~/types";

interface LoaderData {
  repo: RepoDetail;
  issues: IssueList;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const { client } = await requireUserSession(request);

  try {
    const { data: repo } = await client.get<RepoDetail>(
      `/repos/${params.user}/${params.repo}`
    );
    const { data: issues } = await client.get(
      `/repos/${params.user}/${params.repo}/issues`
    );

    return {
      repo,
      issues,
    };
  } catch (e) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function RepoDetail() {
  const data = useLoaderData<LoaderData>();
  const { user, repo } = useParams();

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white p-4 border-b flex-shrink-0">
        <p className="text-sm text-gray-600">
          {user} / {repo}
        </p>
      </div>
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-4">
          <div className="bg-white shadow rounded">
            <div className="p-4 border-b">
              <p className="text-sm text-gray-600">Open Issues</p>
            </div>
            {data.issues.length === 0 ? (
              <div className="p-4">
                <p className="text-center text-sm text-gray-600">
                  No issues for this repository.
                </p>
              </div>
            ) : (
              <div className="p-4">
                <ul className="divide-y">
                  {data.issues.map((issue) => {
                    return (
                      <li key={issue.id}>
                        <a
                          className="block p-2 text-sm"
                          href={issue.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {issue.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const CatchBoundary: CatchBoundaryComponent = (props) => {
  const params = useParams();
  const { repo, user } = params;

  return (
    <div className="p-4">
      <p className="text-red-600 text-sm">
        Couldn't find a repo at {user}/{repo}
      </p>
    </div>
  );
};
