import { ActionFunction, json, LoaderFunction, redirect } from "remix";
import { clearSession } from "~/services/auth.server";

export let action: ActionFunction = async ({ request }) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await clearSession(),
    },
  });
};

export let loader: LoaderFunction = () => {
  throw json({}, { status: 404 });
};
