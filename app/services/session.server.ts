import { createCookieSessionStorage } from "remix";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "gh_remix_example_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["secret1"],
    secure: process.env.NODE_ENV === "production",
  },
});
