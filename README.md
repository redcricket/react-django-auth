# react-django-auth

This my attempt to learn how to develop react applications with TypeScript.

I initialized this project like so:

```
$ git clone https://github.com/redcricket/react-django-auth.git
$ cd react-django-auth/
$ npx create-react-app . -django-auth --template typescript
...
$ cd react-django-auth/
$ npm start
```

I go the above instructions from https://create-react-app.dev/docs/getting-started/#creating-a-typescript-app

## Routes

I am trying to figure out how to do this with Typescript or if I need to or not.

https://create-react-app.dev/docs/adding-a-router

This was the first result if I web searched 'typescript router react'.

https://www.pluralsight.com/guides/react-router-typescript

As per the above docs I executed:

```
$ npm install --save react-router-dom
```

I guess I need to do this too:

```bash
$ npm install @types/react-router-dom
```

I also changed `src/App.jsx` to 

```typescript
import React from 'react';
import { BrowserRouter as Router, Route, Link, RouteComponentProps } from 'react-router-dom';

import logo from './logo.svg';
import './App.css'; import {is} from "@babel/types"; import {exact} from "prop-types";


function Index() { return <h2>Home</h2>; }
type TParams = { id: string };

function Product({ match }: RouteComponentProps<TParams>) {
  return <h2>This is a page for product with ID: {match.params.id} </h2>;
}

const App: React.FC = () => {
  return (
      <Router>
        <div>
          <nav>
            <ul>
              <li> <Link to="/">Home</Link> </li>
              <li> <Link to="/products/1">First Product</Link> </li>
              <li> <Link to="/products/2">Second Product</Link> </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/products/:id" component={Product} />
        </div>
      </Router>
  );
}

export default App;
```

After doing that I tested and it worked.  So I went back to:

https://medium.com/better-programming/building-basic-react-authentication-e20a574d5e71

The above article states we need to execute:

```
npm install --save styled-components react-router-dom axios
```

we already install react-router-dom so I executed:

```
npm install --save styled-components axios
```

I added the file `src/PrivateRoute.jsx` based on the [src/PrivateRoute.js](https://gist.github.com/DennyScott/a1f00ac31b9b14bbd889f4b39a970e81/raw/67ed2d00e15324da33588402b9966157028c41d7/react-hook-auth-block6.jsx)