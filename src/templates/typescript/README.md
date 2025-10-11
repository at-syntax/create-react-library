# {{%=PACKAGE_NAME%}}

{{%=DESCRIPTION%}}

## This package is crafted with [@atsyntax/create-react-library](https://www.npmjs.com/package/@atsyntax/create-react-library)

## Installation

```bash
npm install {{%=PACKAGE_NAME%}}
```

## Usage

```tsx
import React from 'react';
import MyComponent from '{{%=PACKAGE_NAME%}}';

function App() {
  return (
    <div>
      <MyComponent>
        <p>Hello from {{%=PACKAGE_NAME%}}!</p>
      </MyComponent>
    </div>
  );
}

export default App;
```

## API

### MyComponent

#### Props

| Prop      | Type      | Default   | Description                            |
| --------- | --------- | --------- | -------------------------------------- |
| children  | ReactNode | undefined | Content to render inside the component |
| className | string    | undefined | Additional CSS class name              |

## Example

Check out the `example/` directory for a complete TypeScript React application demonstrating how to use this library with full type safety:

Note: Build you library first `{{%=PACKAGE_MANAGER%}} run build`

```bash
cd example
npm install
npm start
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Type checking
npm run type-check

# Watch for changes
npm run build:watch
```

## License

MIT © [<%=AUTHOR_NAME%>]({{%=AUTHOR_URL%}})
