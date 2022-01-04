import axios from "axios";
import { redirect } from "remix";
import { authenticator } from "./services/auth.server";
import { sessionStorage } from "./services/session.server";

export async function requireUserSession(request: Request) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!user) {
    throw redirect("/login", 302);
  }

  const githubAxios = axios.create({
    baseURL: "https://api.github.com/",
    headers: { Authorization: `token ${user.accessToken}` },
  });

  githubAxios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      console.error(error);
      throw redirect("/login", {
        headers: {
          "Set-Cookie": await sessionStorage.destroySession(
            await sessionStorage.getSession()
          ),
        },
      });
    }
  );

  return {
    user,
    client: githubAxios,
  };
}
