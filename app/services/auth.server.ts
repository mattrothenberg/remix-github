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
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async (payload) => {
      const { accessToken, profile } = payload;

      return {
        accessToken,
        displayName: profile.displayName,
        id: profile.id,
      };
    }
  )
);
