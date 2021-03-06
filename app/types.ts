import { Endpoints } from "@octokit/types";

export type Repo = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export type IssueList =
  Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]["data"];

export type CommentList =
  Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"];

export type RepositoryList =
  Endpoints["GET /users/{username}/repos"]["response"]["data"];

export type RepoDetail =
  Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export interface User {
  accessToken: string;
  displayName: string;
  id: number;
  login: string;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: null;
  hireable: boolean;
  bio: null;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}
