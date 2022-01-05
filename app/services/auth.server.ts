import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { User } from "~/types";
import { sessionStorage } from "./session.server";

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "",
      scope: "repo,user,email",
    },
    async (payload) => {
      const { accessToken, profile } = payload;
      const fullProfileRes = await fetch(
        `https://api.github.com/users/${profile.displayName}`
      );
      const fullProfile = await fullProfileRes.json();

      return {
        accessToken,
        displayName: profile.displayName,
        id: profile.id,
        ...fullProfile,
      };
    }
  )
);

export async function clearSession() {
  return await sessionStorage.destroySession(await sessionStorage.getSession());
}
