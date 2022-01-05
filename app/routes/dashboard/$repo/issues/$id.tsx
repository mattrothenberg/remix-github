import { XIcon } from "@heroicons/react/solid";
import ReactMarkdown from "markdown-to-jsx";
import { useEffect, useRef } from "react";
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  useFetcher,
  useLoaderData,
  useParams,
} from "remix";
import { requireUserSession } from "~/http.server";
import { CommentList, IssueList, User } from "~/types";

interface LoaderData {
  issue: IssueList[0];
  comments: CommentList;
  user: User;
}

export const action: ActionFunction = async ({ request, params }) => {
  const { user, client } = await requireUserSession(request);

  const formData = await request.formData();
  const body = formData.get("body");

  await client.post(
    `/repos/${user.displayName}/${params.repo}/issues/${params.id}/comments`,
    {
      body,
    }
  );

  return json({ ok: true });
};

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
    user,
  };
};

export default function IssueDetail() {
  const params = useParams();
  const { repo } = params;
  const { issue, comments, user } = useLoaderData<LoaderData>();
  const addComment = useFetcher();
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (addComment.type === "done" && addComment.data.ok) {
      ref.current?.reset();
    }
  }, [addComment]);

  const optimisticCommentList = [
    ...comments,
    addComment.state === "submitting" || addComment.state === "loading"
      ? {
          body: addComment?.submission?.formData.get("body"),
          user: { login: user.displayName },
          id: Math.random(),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0  w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-gray-900/20 z-0"></div>
      <div className="fixed bg-white w-[400px] shadow-xl right-0 top-0 bottom-0 pointer-events-auto flex flex-col overflow-hidden h-full">
        <header className="border-b p-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Link to={`/dashboard/${repo}/issues`}>
              <XIcon className="w-5 relative top-px" />
            </Link>
            <h2 className="text-xl">{issue.title}</h2>
          </div>
        </header>
        <div className="flex-1 overflow-y-scroll">
          <ul className="p-4 space-y-4">
            <li className="whitespace-pre-wrap break-words border">
              <div className="p-2 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">{issue.user?.login}</p>
              </div>
              <div className="p-2 prose prose-sm prose-headings:mt-0 prose-headings:mb-1">
                <ReactMarkdown>{issue.body || ""}</ReactMarkdown>
              </div>
            </li>
            {optimisticCommentList.map((comment) => {
              if (!comment) return null;
              return (
                <li
                  key={comment?.id}
                  className="whitespace-pre-wrap break-words border"
                >
                  <div className="p-2 bg-gray-50 border-b">
                    <p className="text-sm text-gray-600">
                      {comment.user?.login}
                    </p>
                  </div>
                  <div className="p-2 prose prose-sm prose-headings:mt-0 prose-headings:mb-1">
                    <ReactMarkdown>{comment.body}</ReactMarkdown>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t p-4 flex-shrink-0">
          <addComment.Form method="post" ref={ref}>
            <textarea
              className="border w-full p-2 mb-2"
              rows={4}
              placeholder="Enter your comment"
              name="body"
              id="body"
            />
            <button
              className="btn-primary"
              type="submit"
              disabled={addComment.state === "submitting"}
            >
              {addComment.state === "submitting"
                ? "Adding comment..."
                : "Add Comment"}
            </button>
          </addComment.Form>
        </div>
      </div>
    </div>
  );
}
