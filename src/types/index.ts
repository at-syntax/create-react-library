export interface GenerateProjectOptions {
  targetPath: string;
  slug: string;
  description: string;
  authorName?: string;
  authorEmail?: string;
  authorUrl?: string;
  repoUrl?: string;
  modules: string[];
  language: "javascript" | "typescript";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
}

export type ArgName =
  | "slug"
  | "description"
  | "author-name"
  | "author-email"
  | "author-url"
  | "repo-url"
  | "modules"
  | "language"
  | "package-manager";

export type Answers = {
  slug: string;
  description: string;
  authorName?: string;
  authorEmail?: string;
  authorUrl?: string;
  repoUrl?: string;
  modules: string[];
  language: "javascript" | "typescript";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
};
