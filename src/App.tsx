import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, RouteComponentProps, Redirect } from 'react-router-dom';
import {AuthContext, useAuth} from "./context/auth";
import './App.css';
import PrivateRoute from "./PrivateRoute";
import logoImg from "./img/logo.svg";
import { Card, Logo, Form, Input, Button } from "./components/AuthForm";
import axios from 'axios';

// function oldIndex() { return <h2>Home</h2>; }
function Index() {
    const [appUser, setAppUser] = useState({pk:-1, username: '', email: '', first_name: '', last_name:''});
    const {authTokens, setAuthTokens} = useAuth();
    useEffect(()=> {
        if (!!authTokens) {
            const url = 'http://localhost:8000/rest-auth/user/';
            const withCredentials = true;
            const method = 'get';
            const headers = {
                "Authorization": "Token " + authTokens['key'] + " "
            };
            axios.request({method, url, withCredentials, headers}).then(response => {
                console.log('Login() response is ', response);
                // setAppUser({...appUser, ...response.data});
                setAppUser((appUser) => ({...appUser, ...response.data}));
                //setLoggedIn(true);
            })
            //    .catch(error => { setAppUser(null); setLoggedIn(false); })
        }
    }, [authTokens]);
    // const isAuthenticated = useAuth();
    return authTokens ? (
        <h2>Home you are logged in. {appUser.first_name}</h2>
    ) : (
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

function Logout (props: RouteComponentProps<TParams>) {

    const {authTokens, setAuthTokens} = useAuth();
    const [isError, setIsError] = useState(false);
    useEffect(()=> {
        const url = 'http://localhost:8000/rest-auth/logout/';
        const withCredentials = true;
        const method = 'post';
        const headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };
        const data = null;
        axios.request({url, withCredentials, data, method, headers}).then(
            result => {
                console.log('Logout result is :', result);
                if (result.status === 200) {
                    setAuthTokens(null);
                } else {
                    setIsError(true);
                }
            });// .catch(e => { console.log('Login.postLogin.catch e is :', e); setIsError(true); });
    }); // end postLogin
    return (<div>Thank you come again.</div>);
}

function Admin (props: RouteComponentProps<TParams>) {
  const {authTokens, setAuthTokens} = useAuth();
  const [isError, setIsError] = useState(false);
  console.log(props);
  return (
      <Router>
          <div>
              <nav>
                  <ul>
                      <li> <Link to="/logout">Logout</Link> </li>
                  </ul>
              </nav>
              <PrivateRoute path="/logout" component={Logout} />
          </div>
      </Router>
);
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

function Login (props: RouteComponentProps<TParams>) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const {authTokens, setAuthTokens} = useAuth();
  const [isError, setIsError] = useState(false);
  const referer = props.location.state ? props.location.state.referer : '/';
  const [appUser, setAppUser] = useState({pk:-1, username: '', email: '', first_name: '', last_name:''});
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(()=> {
      // axios.get('http://localhost:8000/api/v1/rest-auth/user/', {headers: { 'Authorization': `Token ${token}`}})
        if (!!authTokens) {
            const url = 'http://localhost:8000/rest-auth/user/';
            const withCredentials = true;
            const method = 'get';
            const headers = {
                "Authorization": "Token " + authTokens['key'] + " "
            };
            axios.request({method, url, withCredentials, headers}).then(response => {
                console.log('Login() /rest-auth/user response is ', response);
                // setAppUser({...appUser, ...response.data});
                setAppUser((appUser) => ({...appUser, ...response.data}));
                setLoggedIn(true);
            })
            //    .catch(error => { setAppUser(null); setLoggedIn(false); })
        }
  }, [authTokens]);
  console.log('Login referer is ', referer);
  console.log('Login props is ', props);

  function postLogin() {
        const url = 'http://localhost:8000/rest-auth/login/';
        const withCredentials = true;
        const method = 'post';
        const data = {"username": userName, "password": password};
        // BIG WARNING!!!
        // password is being passed unencrypted and in the clear.
        axios.request({url, withCredentials, data, method}).then(
            result => {
                // console.log('Login.postLogin.else result is :', result);
                if (result.status === 200) {
                    setAuthTokens(result.data);
                } else {
                    setIsError(true);
                }
            });// .catch(e => { console.log('Login.postLogin.catch e is :', e); setIsError(true); });
  } // end postLogin

  if (authTokens) {
    console.log('Login page authTokens is ', authTokens);
    console.log('Login page appUser is ', appUser);
    return <Redirect to={referer}/>;
  } else {
    console.log('Login page authTokens is ', authTokens);
    console.log('Login page appUser is ', appUser);
  }

  return (
      <Card>
        <Logo src={logoImg} />
        <Form>
          <Input
              type="username"
              placeholder="username"
              value={userName}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setUserName(e.target.value); }}
          />
          <Input
              type="password"
              value={password}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setPassword(e.target.value); }}
              placeholder="password" />
          <Button onClick={postLogin}>Sign In</Button>
        </Form>
        <Link to="/signup">Don't have an account?</Link>
      </Card>
  );
}


const App: React.FunctionComponent = () => {
    const [authTokens, setAuthTokens] = useState(undefined);  //type: AuthTokens | undefined (see auth.js)
    // <AuthContext.Provider value={false}>
    return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens }}>
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
