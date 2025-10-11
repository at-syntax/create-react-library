import React from 'react';
import MyComponent from '{{%=PACKAGE_NAME%}}';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{{%=PACKAGE_NAME%}} Example</h1>
        <p>This is a demonstration of how to use the {{%=PACKAGE_NAME%}} library.</p>
      </header>
      
      <main className="App-main">
        <section className="demo-section">
          <h2>Basic Usage</h2>
          <MyComponent>
            <p>This content is passed as children to the component.</p>
          </MyComponent>
        </section>

        <section className="demo-section">
          <h2>With Custom Props</h2>
          <MyComponent className="custom-style" data-testid="custom-component">
            <p>This shows the component with additional props.</p>
            <button onClick={() => alert('Hello from {{%=PACKAGE_NAME%}}!')}>
              Click me!
            </button>
          </MyComponent>
        </section>
      </main>
    </div>
  );
}

export default App;