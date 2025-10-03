import React from "react";

/**
 * A simple React component
 */
const MyComponent = ({ children, ...props }) => {
  return (
    <div className="my-component" {...props}>
      <h2>{{PACKAGE_NAME}}</h2>
      <p>{{DESCRIPTION}}</p>
      {children}
    </div>
  );
};

export default MyComponent;
