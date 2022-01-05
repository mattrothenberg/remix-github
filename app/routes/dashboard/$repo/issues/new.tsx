import { XIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import {
  ActionFunction,
  Form,
  redirect,
  useParams,
  useTransition,
} from "remix";
import { requireUserSession } from "~/http.server";

export const action: ActionFunction = async ({ request, params }) => {
  const { client, user } = await requireUserSession(request);

  const formData = await request.formData();

  const body = formData.get("body");
  const title = formData.get("title");

  const { data } = await client.post(
    `/repos/${user.displayName}/${params.repo}/issues`,
    {
      body,
      title,
    }
  );

  return redirect(`/dashboard/${params.repo}/issues/${data.number}`);
};

export default function NewIssue() {
  const params = useParams();
  const { repo } = params;

  const transition = useTransition();

  return (
    <div className="fixed inset-0  w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-gray-900/20 z-0"></div>
      <div className="fixed bg-white w-[400px] shadow-xl right-0 top-0 bottom-0 pointer-events-auto flex flex-col overflow-hidden h-full">
        <header className="border-b p-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Link to={`/dashboard/${repo}/issues`}>
              <XIcon className="w-5 relative top-px" />
            </Link>
            <h2 className="text-xl">New Issue</h2>
          </div>
        </header>
        <div className="flex-1 overflow-y-scroll p-4">
          <Form className="flex flex-col gap-4" method="post">
            <input
              required
              placeholder="What is the title?"
              type="text"
              name="title"
            />
            <textarea
              className="border w-full p-2 mb-2"
              rows={4}
              placeholder="What is this issue about?"
              name="body"
              id="body"
            />
            <button
              className="btn-primary"
              type="submit"
              disabled={transition.state === "submitting"}
            >
              {transition.state === "submitting"
                ? "Creating issue..."
                : "Create issue"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
