import React from "react";
import { render, screen } from "@testing-library/react";
import MyComponent from "../index";

describe("MyComponent", () => {
  it("renders without crashing", () => {
    render(<MyComponent />);
    expect(screen.getByText('{{PACKAGE_NAME}}')).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<MyComponent />);
    expect(screen.getByText('{{DESCRIPTION}}')).toBeInTheDocument();
  });

  it("renders children", () => {
    const testContent = "Test content";
    render(
      <MyComponent>
        <span>{testContent}</span>
      </MyComponent>
    );
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});
