import fs from "fs";
import path from "path";
import chalk from "chalk";
import validateNpmPackage from "validate-npm-package-name";

export function validateAndGetPackage(packageName: string) {
  if (!packageName) {
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

  const folder = path.join(process.cwd(), packageName);

  if (fs.existsSync(folder)) {
    console.log(
      `A folder already exists at ${chalk.blue(
        folder
      )}! Please specify another folder name or delete the existing one.`
    );

    process.exit(1);
  }

  const basename = path.basename(packageName);

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

  return { folder, basename };
}
