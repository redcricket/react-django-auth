import React from 'react';
import { BrowserRouter as Router, Route, Link, RouteComponentProps } from 'react-router-dom';
import {AuthContext, useAuth} from "./context/auth";
import './App.css';
import PrivateRoute from "./PrivateRoute";
import logoImg from "./img/logo.svg";
import { Card, Logo, Form, Input, Button } from "./components/AuthForm";

// function oldIndex() { return <h2>Home</h2>; }
function Index() {
    const isAuthenticated = useAuth();
    return isAuthenticated ? ( <h2>Home you are logged in.</h2> ) : (
        <Router>
            <div>
                <h2>Home you not logged in.</h2>
                <nav>
                    <ul>
                        <li> <Link to="/login">Login</Link> </li>
                        <li> <Link to="/signup">Sign Up</Link> </li>
                    </ul>
                </nav>

                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
            </div>
        </Router>
    );
}
type TParams = { id: string };

function Product({ match }: RouteComponentProps<TParams>) {
  return <h2>This is a page for product with ID: {match.params.id} </h2>;
}

function Admin (props: RouteComponentProps<TParams>) {
  console.log(props);
  return <h2>This is the {props.location.pathname} page.</h2>;
}

const Signup: React.FunctionComponent = () => {
    return (
        <Card>
            <Logo src={logoImg} />
            <Form>
                <Input type="email" placeholder="email" />
                <Input type="password" placeholder="password" />
                <Input type="password" placeholder="password again" />
                <Button>Sign Up</Button>
            </Form>
            <Link to="/login">Already have an account?</Link>
        </Card>
    );
}

const Login: React.FunctionComponent = () => {
  return (
      <Card>
        <Logo src={logoImg} />
        <Form>
          <Input type="email" placeholder="email" />
          <Input type="password" placeholder="password" />
          <Button>Sign In</Button>
        </Form>
        <Link to="/signup">Don't have an account?</Link>
      </Card>
  );
}


const App: React.FunctionComponent = () => {
  return (
      <AuthContext.Provider value={false}>
        <Router>
          <div>
            <nav>
              <ul>
                <li> <Link to="/">Home</Link> </li>
                <li> <Link to="/products/1">First Product</Link> </li>
                <li> <Link to="/products/2">Second Product</Link> </li>
                <li> <Link to="/admin">Admin Page</Link> </li>
              </ul>
            </nav>

            <Route path="/" exact component={Index} />
            <Route path="/products/:id" component={Product} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/admin" component={Admin} />
          </div>
        </Router>
      </AuthContext.Provider>
  );
};

export default App;
