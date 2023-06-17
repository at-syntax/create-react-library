import path from "path";
import fs from "fs";
import yargs from "yargs";
import chalk from "chalk";
import { spawn, spawnSync } from "child_process";
import validateNpmPackage from "validate-npm-package-name";
import githubUsername from "github-username";
import { type PromptObject, prompts } from "./utils/prompts";
import ora from "ora";

type ArgName =
  | "slug"
  | "description"
  | "author-name"
  | "author-email"
  | "author-url"
  | "repo-url"
  | "language";

type Answers = {
  slug: string;
  description: string;
  authorName: string;
  authorEmail: string;
  authorUrl: string;
  repoUrl: string;
  language: "javascript" | "typescript";
};

const args: Record<ArgName, yargs.Options> = {
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
  language: {
    description: "Language for the repository",
    type: "string",
  },
};

async function create(argv: yargs.Arguments<any>) {
  if (!argv["package-name"]) {
    console.log(
      `Please specify the package name:\n${chalk.blue(
        "create-react-library"
      )} ${chalk.green("<package-name>")}\n\nFor example:\n${chalk.blue(
        "create-react-library"
      )} ${chalk.green("my-react-package")}\n\nRun ${chalk.blue(
        "create-react-library --help"
      )} to see all options.`
    );
    process.exit(1);
  }

  const folder = path.join(process.cwd(), argv["package-name"]);

  if (fs.existsSync(folder)) {
    console.log(
      `A folder already exists at ${chalk.blue(
        folder
      )}! Please specify another folder name or delete the existing one.`
    );

    process.exit(1);
  }

  const basename = path.basename(argv["package-name"]);

  if (!validateNpmPackage(basename).validForNewPackages) {
    console.log(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          basename
        )} because of npm naming restrictions:\n\n* name can only contain URL-friendly characters\n\nPlease choose a different project name.`
      )
    );
    process.exit(1);
  }

  try {
    const child = spawn("npx", ["--help"]);

    await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", resolve);
    });
  } catch (error) {
    if (error != null && (error as Record<"code", unknown>).code === "ENOENT") {
      console.log(
        `Couldn't find ${chalk.blue(
          "npx"
        )}! Please install it by running ${chalk.blue("npm install -g npx")}`
      );

      process.exit(1);
    } else {
      throw error;
    }
  }

  let name, email;

  try {
    name = spawnSync("git", ["config", "--get", "user.name"])
      .stdout.toString()
      .trim();

    email = spawnSync("git", ["config", "--get", "user.email"])
      .stdout.toString()
      .trim();
  } catch (e) {
    // Ignore error
  }

  const questions: Record<
    ArgName,
    Omit<PromptObject<keyof Answers>, "validate"> & {
      validate?: (value: string) => boolean | string;
    }
  > = {
    slug: {
      type: "text",
      name: "slug",
      message: "What is the name of the npm package?",
      initial: basename,
      validate: (input) =>
        validateNpmPackage(input).validForNewPackages ||
        "Must be a valid npm package name",
    },
    description: {
      type: "text",
      name: "description",
      message: "What is the description for the package?",
      validate: (input) => Boolean(input) || "Cannot be empty",
    },
    "author-name": {
      type: "text",
      name: "authorName",
      message: "What is the name of package author?",
      initial: name,
      validate: (input) => Boolean(input) || "Cannot be empty",
    },
    "author-email": {
      type: "text",
      name: "authorEmail",
      message: "What is the email address for the package author?",
      initial: email,
      validate: (input) =>
        /^\S+@\S+$/.test(input) || "Must be a valid email address",
    },
    "author-url": {
      type: "text",
      name: "authorUrl",
      message: "What is the URL for the package author?",
      initial: async (previous: string) => {
        let url = "";
        try {
          const username = await githubUsername(previous);
          url = `https://github.com/${username}`;
        } catch (e) {
          url = "";
        }
        return url;
      },
      validate: (input) => /^https?:\/\//.test(input) || "Must be a valid URL",
    },
    "repo-url": {
      type: "text",
      name: "repoUrl",
      message: "What is the URL for the repository?",
      initial: (_: string, answers: Answers) => {
        if (/^https?:\/\/github.com\/[^/]+/.test(answers.authorUrl)) {
          return `${answers.authorUrl}/${answers.slug
            .replace(/^@/, "")
            .replace(/\//g, "-")}`;
        }

        return "";
      },
      validate: (input) => /^https?:\/\//.test(input) || "Must be a valid URL",
    },
    language: {
      type: "select",
      name: "language",
      message: "Which language do you prefers?",
      active: "javascript",
      choices: [
        { title: "Javascript", value: "javascript" },
        { title: "Typescript", value: "typescript" },
      ],
    },
  };

  // Validate arguments passed to the CLI
  for (const [key, value] of Object.entries(argv)) {
    if (value == null) {
      continue;
    }

    const question = questions[key as ArgName];

    if (question == null) {
      continue;
    }

    let valid = question.validate ? question.validate(String(value)) : true;

    // We also need to guard against invalid choices
    // If we don't already have a validation message to provide a better error
    if (typeof valid !== "string" && "choices" in question) {
      const choices =
        typeof question.choices === "function"
          ? question.choices(undefined, argv, question)
          : question.choices;

      if (choices && !choices.some((choice) => choice.value === value)) {
        valid = `Supported values are - ${choices.map((c) =>
          chalk.green(c.value)
        )}`;
      }
    }

    if (valid !== true) {
      let message = `Invalid value ${chalk.red(
        String(value)
      )} passed for ${chalk.blue(key)}`;

      if (typeof valid === "string") {
        message += `: ${valid}`;
      }

      console.log(message);

      process.exit(1);
    }
  }

  const {
    slug,
    description,
    authorName,
    authorEmail,
    authorUrl,
    repoUrl,
    language,
  } = {
    ...argv,
    ...(await prompts(
      Object.entries(questions)
        .filter(([key, val]) => {
          // Skip questions which are passed as parameter and pass validation
          if (argv[key] != null && val.validate?.(argv[key]) !== false) {
            return false;
          }

          // Skip questions with a single choice
          if (Array.isArray(val.choices) && val.choices.length === 1) {
            return false;
          }

          return true;
        })
        .map(([, v]) => {
          const { type, choices } = v;

          // Skip dynamic questions with a single choice
          if (type === "select" && typeof choices === "function") {
            return {
              ...v,
              type: (prev, values, prompt) => {
                const result = choices(prev, { ...argv, ...values }, prompt);

                if (result && result.length === 1) {
                  return null;
                }

                return type;
              },
            };
          }

          return v;
        })
    )),
  } as Answers;

  console.log(
    slug,
    description,
    authorName,
    authorEmail,
    authorUrl,
    repoUrl,
    language
  );
  const spinner = ora("Generating template").start();
  spinner.stop();
}

yargs
  .command("$0 [package-name]", "create a react library", args, create)
  .demandCommand()
  .recommendCommands()
  .fail((message, error) => {
    console.log("\n");

    if (error) {
      console.log(chalk.red(error.message));
      throw error;
    }

    if (message) {
      console.log(chalk.red(message));
    } else {
      console.log(
        chalk.red(`An unknown error occurred. See '--help' for usage guide.`)
      );
    }

    process.exit(1);
  })
  .strict().argv;
