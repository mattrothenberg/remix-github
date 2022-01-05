import axios from "axios";
import { redirect } from "remix";
import { authenticator } from "./services/auth.server";
import { sessionStorage } from "./services/session.server";

export async function requireUserSession(request: Request) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (!user) {
    throw redirect("/", 302);
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
      if (error.response.status === 401) {
        console.error(error);
        throw redirect("/", {
          headers: {
            "Set-Cookie": await sessionStorage.destroySession(
              await sessionStorage.getSession()
            ),
          },
        });
      }

      return Promise.reject(error);
    }
  );

  return {
    user,
    client: githubAxios,
  };
}
