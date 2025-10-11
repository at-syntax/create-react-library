import { runCommand } from "../utils/command-runner";
import { spawn, type ChildProcess } from "child_process";

jest.mock("child_process");

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

describe("command-runner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("runCommand", () => {
    it("should resolve when command exits with code 0", async () => {
      const mockChild = {
        on: jest.fn((event, callback) => {
          if (event === "close") {
            callback(0);
          }
        }),
      };

      mockSpawn.mockReturnValue(mockChild as unknown as ChildProcess);

      await expect(runCommand("echo", ["test"])).resolves.toBeUndefined();

      expect(mockSpawn).toHaveBeenCalledWith("echo", ["test"], {
        cwd: undefined,
        stdio: undefined,
        shell: true,
      });
    });

    it("should reject when command exits with non-zero code", async () => {
      const mockChild = {
        on: jest.fn((event, callback) => {
          if (event === "close") {
            callback(1);
          }
        }),
      };

      mockSpawn.mockReturnValue(mockChild as unknown as ChildProcess);

      await expect(runCommand("false", [])).rejects.toThrow(
        "false  failed with code 1"
      );
    });

    it("should reject when command throws an error", async () => {
      const error = new Error("Command not found");
      const mockChild = {
        on: jest.fn((event, callback) => {
          if (event === "error") {
            callback(error);
          }
        }),
      };

      mockSpawn.mockReturnValue(mockChild as unknown as ChildProcess);

      await expect(runCommand("nonexistent", [])).rejects.toThrow(
        "Command not found"
      );
    });

    it("should pass correct options to spawn", async () => {
      const mockChild = {
        on: jest.fn((event, callback) => {
          if (event === "close") {
            callback(0);
          }
        }),
      };

      mockSpawn.mockReturnValue(mockChild as unknown as ChildProcess);

      await runCommand("test", ["arg1", "arg2"], "/custom/path", "inherit");

      expect(mockSpawn).toHaveBeenCalledWith("test", ["arg1", "arg2"], {
        cwd: "/custom/path",
        stdio: "inherit",
        shell: true,
      });
    });
  });
});
