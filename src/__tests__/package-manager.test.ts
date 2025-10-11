// Additional specific mocks for this test file
jest.mock("validate-npm-package-name", () =>
  jest.fn(() => ({
    validForNewPackages: true,
    validForOldPackages: true,
  }))
);

jest.mock("fs");

import { validateAndGetPackage } from "../package-manager";
import fs from "fs";
import path from "path";
import validateNpmPackage from "validate-npm-package-name";
import { mockConsole, mockProcess } from "./setup";

const mockFs = fs as jest.Mocked<typeof fs>;
const mockValidateNpmPackage = validateNpmPackage as jest.MockedFunction<
  typeof validateNpmPackage
>;

describe("package-manager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateAndGetPackage", () => {
    it("should return folder and basename for valid package name", () => {
      mockFs.existsSync.mockReturnValue(false);
      mockValidateNpmPackage.mockReturnValue({
        validForNewPackages: true,
        validForOldPackages: true,
      });

      const result = validateAndGetPackage("my-react-library");

      expect(result).toEqual({
        folder: path.join(process.cwd(), "my-react-library"),
        basename: "my-react-library",
      });

      expect(mockFs.existsSync).toHaveBeenCalledWith(
        path.join(process.cwd(), "my-react-library")
      );
      expect(mockValidateNpmPackage).toHaveBeenCalledWith("my-react-library");
    });

    it("should exit when package name is empty", () => {
      validateAndGetPackage("");

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("Please specify the package name:")
      );
      expect(mockProcess.exit).toHaveBeenCalledWith(1);
    });

    it("should exit when folder already exists", () => {
      mockFs.existsSync.mockReturnValue(true);

      validateAndGetPackage("existing-folder");

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("A folder already exists at")
      );
      expect(mockProcess.exit).toHaveBeenCalledWith(1);
    });

    it("should exit when package name is invalid", () => {
      mockFs.existsSync.mockReturnValue(false);
      mockValidateNpmPackage.mockReturnValue({
        validForNewPackages: false,
        validForOldPackages: false,
        errors: ["Invalid characters"],
        warnings: [],
      });

      validateAndGetPackage("Invalid Package Name");

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining("Cannot create a project named")
      );
      expect(mockProcess.exit).toHaveBeenCalledWith(1);
    });

    it("should handle nested paths correctly", () => {
      mockFs.existsSync.mockReturnValue(false);
      mockValidateNpmPackage.mockReturnValue({
        validForNewPackages: true,
        validForOldPackages: true,
      });

      const result = validateAndGetPackage("packages/my-lib");

      expect(result).toEqual({
        folder: path.join(process.cwd(), "packages/my-lib"),
        basename: "my-lib",
      });

      expect(mockValidateNpmPackage).toHaveBeenCalledWith("my-lib");
    });
  });
});
