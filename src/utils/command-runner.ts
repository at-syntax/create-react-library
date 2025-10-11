import { spawn, type StdioOptions } from "child_process";

export function runCommand(
  command: string,
  args: string[],
  cwd?: string,
  stdio?: StdioOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio,
      shell: true,
    });

    child.on("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`${command} ${args.join(" ")} failed with code ${code}`)
        );
      }
    });

    child.on("error", reject);
  });
}
