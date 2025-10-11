import React from "react";
import MyComponent, { MyComponentProps } from "{{%=PACKAGE_NAME%}}";
import "./App.css";

interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

const App: React.FC = () => {
  const handleButtonClick = (): void => {
    alert("Hello from {{%=PACKAGE_NAME%}}!");
  };

  // Example of using the component with proper TypeScript typing
  const componentProps: MyComponentProps = {
    className: "custom-style",
    children: (
      <div>
        <p>This content is passed as children with proper typing.</p>
        <CustomButton onClick={handleButtonClick}>Click me!</CustomButton>
      </div>
    ),
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{{%=PACKAGE_NAME%}} TypeScript Example</h1>
        <p>This demonstrates the {{%=PACKAGE_NAME%}} library with full TypeScript support.</p>
      </header>
      
      <main className="App-main">
        <section className="demo-section">
          <h2>Basic Usage</h2>
          <MyComponent>
            <p>This content is passed as children to the component.</p>
          </MyComponent>
        </section>

        <section className="demo-section">
          <h2>With TypeScript Props</h2>
          <MyComponent {...componentProps} />
        </section>

        <section className="demo-section">
          <h2>With Type-Safe Event Handling</h2>
          <MyComponent 
            className="interactive-style" 
            data-testid="interactive-component"
          >
            <p>This shows type-safe event handling:</p>
            <CustomButton onClick={handleButtonClick}>
              Type-safe click handler
            </CustomButton>
          </MyComponent>
        </section>
      </main>
    </div>
  );
};

export default App;
