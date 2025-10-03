import React, { ReactNode } from "react";

export interface MyComponentProps {
  children?: ReactNode;
  className?: string;
}

/**
 * A simple React component
 */
const MyComponent: React.FC<MyComponentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`my-component ${className || ""}`} {...props}>
      <h2>{{PACKAGE_NAME}}</h2>
      <p>{{DESCRIPTION}}</p>
      {children}
    </div>
  );
};

export default MyComponent;
