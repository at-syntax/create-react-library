import type { Options } from "yargs";
import type { Answers, ArgName } from "./types";
import type { PromptObject } from "./utils/prompts";
import validateNpmPackage from "validate-npm-package-name";
import githubUsername from "github-username";

export const args: Record<ArgName, Options> = {
  slug: {
    description: "Name of the npm package",
    type: "string",
  },
  description: {
    description: "Description of the npm package",
    type: "string",
  },
  "author-name": {
    description: "Name of the package author",
    type: "string",
  },
  "author-email": {
    description: "Email address of the package author",
    type: "string",
  },
  "author-url": {
    description: "URL for the package author",
    type: "string",
  },
  "repo-url": {
    description: "URL for the repository",
    type: "string",
  },
  modules: {
    description: "Build support for the package",
    type: "array",
  },
  language: {
    description: "Language for the repository",
    type: "string",
  },
  "package-manager": {
    description: "Package manager to use",
    type: "string",
  },
};

export function getQuestions(initialAnswers: Partial<Answers>): Record<
  ArgName,
  Omit<PromptObject<keyof Answers>, "validate"> & {
    validate?: (value: string) => boolean | string;
  }
> {
  return {
    slug: {
      type: "text",
      name: "slug",
      message: "What is the name of the npm package?",
      initial: initialAnswers.slug,
      validate: input =>
        validateNpmPackage(input).validForNewPackages ||
        "Must be a valid npm package name",
    },
    description: {
      type: "text",
      name: "description",
      message: "What is the description for the package?",
      validate: input => Boolean(input) || "Cannot be empty",
    },
    "author-name": {
      type: "text",
      name: "authorName",
      message: "What is the name of package author? (optional)",
      initial: initialAnswers.authorName,
    },
    "author-email": {
      type: "text",
      name: "authorEmail",
      message: "What is the email address for the package author? (optional)",
      initial: initialAnswers.authorEmail,
      validate: input =>
        !input ||
        /^\S+@\S+$/.test(input) ||
        "Must be a valid email address if provided",
    },
    "author-url": {
      type: "text",
      name: "authorUrl",
      message: "What is the URL for the package author? (optional)",
      initial: async (previous: string) => {
        let url = "";
        try {
          const username = await githubUsername(previous);
          url = `https://github.com/${username}`;
        } catch (_e) {
          url = "";
        }
        return url;
      },
      validate: input =>
        !input ||
        /^https?:\/\//.test(input) ||
        "Must be a valid URL if provided",
    },
    "repo-url": {
      type: "text",
      name: "repoUrl",
      message: "What is the URL for the repository? (optional)",
      initial: (_: string, answers: Answers) => {
        if (
          answers.authorUrl &&
          /^https?:\/\/github.com\/[^/]+/.test(answers.authorUrl)
        ) {
          return `${answers.authorUrl}/${answers.slug
            .replace(/^@/, "")
            .replace(/\//g, "-")}`;
        }

        return "";
      },
      validate: input =>
        !input ||
        /^https?:\/\//.test(input) ||
        "Must be a valid URL if provided",
    },
    modules: {
      type: "multiselect",
      name: "modules",
      message: "What build support do you want for the package?",
      choices: [
        { title: "ESM/CJS", value: "esm", selected: true },
        { title: "UMD", value: "umd" },
        { title: "Standalone", value: "standalone" },
      ],
      min: 1,
      initial: 0,
      validate: input =>
        input.length > 0 || "At least one build support must be selected",
    },
    language: {
      type: "select",
      name: "language",
      message: "Which language do you prefer?",
      initial: 0,
      choices: [
        { title: "Javascript", value: "javascript" },
        { title: "Typescript", value: "typescript" },
      ],
    },
    "package-manager": {
      type: "select",
      name: "packageManager",
      message: "Which package manager would you like to use?",
      initial: 0,
      choices: [
        { title: "npm", value: "npm" },
        { title: "Yarn", value: "yarn" },
        { title: "pnpm", value: "pnpm" },
        { title: "Bun", value: "bun" },
      ],
    },
  };
}
