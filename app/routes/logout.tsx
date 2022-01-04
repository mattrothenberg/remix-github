import { ActionFunction, json, LoaderFunction, redirect } from "remix";
import { sessionStorage } from "~/services/session.server";

export let action: ActionFunction = async ({ request }) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(
        await sessionStorage.getSession()
      ),
    },
  });
};

export let loader: LoaderFunction = () => {
  throw json({}, { status: 404 });
};
