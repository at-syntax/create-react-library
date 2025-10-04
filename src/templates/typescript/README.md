# {{PACKAGE_NAME}}

{{DESCRIPTION}}

## This package is crafted with [@saikat737/create-react-library](https://www.npmjs.com/package/@saikat737/create-react-library)

## Installation

```bash
npm install {{PACKAGE_NAME}}
```

## Usage

```tsx
import React from 'react';
import MyComponent from '{{PACKAGE_NAME}}';

function App() {
  return (
    <div>
      <MyComponent>
        <p>Hello from {{PACKAGE_NAME}}!</p>
      </MyComponent>
    </div>
  );
}

export default App;
```

## API

### MyComponent

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | undefined | Content to render inside the component |
| className | string | undefined | Additional CSS class name |

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

MIT © [{{AUTHOR_NAME}}]({{AUTHOR_URL}})
