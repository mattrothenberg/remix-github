import { LoaderFunction, Outlet, useLoaderData } from "remix";
import { StatBlock } from "~/components/stat-block";
import { requireUserSession } from "~/http.server";
import { Repo } from "~/types";

interface LoaderData {
  repo: Repo;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { user, client } = await requireUserSession(request);

  const { data: repo } = await client.get(
    `/repos/${user.displayName}/${params.repo}`
  );

  return {
    repo,
  };
};

export default function RepoDetail() {
  const { repo } = useLoaderData<LoaderData>();

  return (
    <div className="p-4">
      <dl className="grid grid-cols-3 gap-4">
        <StatBlock label="Forks" value={repo.forks_count} />
        <StatBlock label="Stargazers" value={repo.stargazers_count} />
        <StatBlock label="Watchers" value={repo.watchers_count} />
      </dl>
      <Outlet />
    </div>
  );
}
