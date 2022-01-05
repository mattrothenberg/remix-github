import { LoaderFunction, useLoaderData } from "remix";
import { requireUserSession } from "~/http.server";
import { CommentList, IssueList } from "~/types";

interface LoaderData {
  issue: IssueList[0];
  comments: CommentList;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { repo, id } = params;
  const { user, client } = await requireUserSession(request);

  const { data: issue } = await client.get(
    `/repos/${user.displayName}/${repo}/issues/${id}`
  );

  const { data: comments } = await client.get(
    `/repos/${user.displayName}/${repo}/issues/${id}/comments`
  );

  return {
    issue,
    comments,
  };
};

export default function IssueDetail() {
  const { issue, comments } = useLoaderData<LoaderData>();

  return (
    <div className="fixed inset-0  w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-gray-900/20 z-0"></div>
      <div className="fixed bg-white w-[400px] shadow-xl right-0 top-0 bottom-0 pointer-events-auto flex flex-col">
        <header className="border-b p-4 flex-shrink-0">
          <h2 className="text-xl">{issue.title}</h2>
        </header>
        <div className="flex-1">
          <ul>
            {comments.map((comment) => {
              return (
                <li className="p-4">
                  <p className="text-sm text-gray-600">{comment.user?.login}</p>
                  <p className="text-sm">{comment.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t p-4"></div>
      </div>
    </div>
  );
}
