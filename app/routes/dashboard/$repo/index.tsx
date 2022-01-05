import { Outlet } from "remix";

export default function RepoDetail() {
  return (
    <div className="p-4">
      <p>This is the repo detail landing page</p>
      <Outlet />
    </div>
  );
}
