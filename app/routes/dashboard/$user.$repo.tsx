import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { LoaderFunction, useLoaderData, useParams } from "remix";
import { requireUserSession } from "~/http.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { client } = await requireUserSession(request);

  try {
    const { data } = await client.get(`/repos/${params.user}/${params.repo}`);
    return {
      params,
      repo: data,
    };
  } catch (e) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function RepoDetail() {
  const data = useLoaderData();
  return <div>{JSON.stringify(data)}</div>;
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
