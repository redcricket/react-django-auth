import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, RouteComponentProps, Redirect } from 'react-router-dom';
import {AuthContext, useAuth} from "./context/auth";
import './App.css';
import PrivateRoute from "./PrivateRoute";
import logoImg from "./img/logo.svg";
import { Card, Logo, Form, Input, Button } from "./components/AuthForm";
import axios from 'axios';
import Cookies from 'js-cookie';

function Index() {
    const [appUser, setAppUser] = useState({pk:-1, username: '', email: '', first_name: '', last_name:''});
    const [errorMessage, setErrorMessage] = useState("");
    // const {authTokens} = useAuth();
    const key = sessionStorage.getItem('key');
    //console.log('Index() before useEffect key is, ', key);
    //console.log('Index() before useEffect appUser is, ', appUser);
    useEffect(()=> {
        // if (key) {
        if (appUser.pk === -1) {
            const url = 'http://localhost:8000/rest-auth/user/';
            const withCredentials = true;
            const method = 'get';

            // this is the part that took me 2 weeks to figure out!
            // also had to make a change on the django backend.
            // REST_FRAMEWORK = {
            //     # Use Django's standard `django.contrib.auth` permissions,
            //     # or allow read-only access for unauthenticated users.
            //     #'DEFAULT_PERMISSION_CLASSES': [
            //     #    'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
            //     #],
            //     # adding this fix the logout 403 crrf errors but broke /rest-auth/user GET
            //     # which now gets 401 unauthorized
            //     'DEFAULT_AUTHENTICATION_CLASSES': (
            //         'rest_framework.authentication.TokenAuthentication',
            //     )
            // }
            //
            // the token is what we got from the backend when we logged in.
            const headers = {
                // "Authorization": "Token " + authTokens['key'] + " "
                "Authorization": "Token " + key + " "
            };
            axios.request({method, url, withCredentials, headers}).then(response => {
                //console.log('Index.useEffect() response is ', response);
                //console.log('Index() useEffect setting appUser.');
                setAppUser((appUser) => ({...appUser, ...response.data}));
            }).catch( (error) => { // Error
                //console.log('Index useEffect catch error error is ', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setErrorMessage(Object.values(error.response.data).join(':'));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the
                    // browser and an instance of
                    // http.ClientRequest in node.js
                    //console.log('postSignup catch error error.request is ', error.request);
                    setErrorMessage('postSignup catch error error.request is '+ error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('ELSE Error', error.message);
                    setErrorMessage(error.message)
                }
                //console.log('Index() useEffect catch error', error.config);
            });
        }}, []);
        // }}, [key]);
// }, [authTokens]);
// const isAuthenticated = useAuth();
return key ? (
    <h2>{errorMessage} Home you are logged in. {appUser.first_name || 'No first name'} email is {appUser.email}</h2>
    ) : (
        <Router>
            <div>
                <h2>{errorMessage} Home you not logged in.</h2>
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

function ConfirmEmail({ match }: RouteComponentProps<TParams>) {
    const [, setIsError] = useState(false);
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    //console.log('ConfirmEmail match is :', match);
    useEffect(()=> {
        if( ! emailConfirmed ) {
            const url = 'http://localhost:8000/rest-auth/registration/verify-email/';
            const withCredentials = true;
            const method = 'post';
            const headers = {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            const data = {
                "key": match.params.id
            };
            axios.request({url, withCredentials, data, method, headers}).then(
                result => {
                    //console.log('ConfirmEmail result is :', result);
                    if (result.status === 200) {
                        //console.log('ConfirmEmail status 200 result is :', result);
                        setEmailConfirmed(result.data.detail)
                    } else {
                        setIsError(true);
                    }
                }).catch(e => {
                //console.log('ConfirmEmail.catch e is :', e);
                setIsError(true);
            });
        }
    }, [emailConfirmed]);

    // <h2>email with ID: {match.params.id} confirmed {emailConfirmed} email = {appUser.email} </h2>
    if( emailConfirmed ) {
        return (
            <Router>
                <div>
                    <h2>email with ID: {match.params.id} confirmed {emailConfirmed}</h2>
                    <nav>
                        <ul>
                            <li> <Link to="/login">Login</Link> </li>
                        </ul>
                    </nav>
                    <Route path="/login" component={Login} />
                </div>
            </Router>
    );
    }
    return <h2>confirming email with ID: {match.params.id} FAILED.</h2>;
}

function Logout () {

    const {setAuthTokens} = useAuth();
    const [, setIsError] = useState(false);
    const [, setUserName] = useState("");
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
                //console.log('Logout result is :', result);
                if (result.status === 200) {
                    setAuthTokens(null);
                    setUserName("");
                } else {
                    setIsError(true);
                }
            });// .catch(e => { console.log('Login.postLogin.catch e is :', e); setIsError(true); });
    });
    sessionStorage.clear();
    return (<div>Thank you come again.</div>);
}

function Admin () {
  // const {authTokens, setAuthTokens} = useAuth();
  // const [isError, setIsError] = useState(false);
  const appUser = useState({pk:-1, username: '', email: '', first_name: '', last_name:''});
  return (
      <Router>
          <div>
              <nav>
                  <ul>
                      <li> <Link to="/logout">Logout email={JSON.stringify(appUser)}</Link> </li>
                  </ul>
              </nav>
              <PrivateRoute path="/logout" component={Logout} />
          </div>
      </Router>
  );
}

/*
see
https://docs.djangoproject.com/en/2.1/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-or-csrf-cookie-httponly-is-true

the above recommends https://github.com/js-cookie/js-cookie/


May have to look at

https://stackoverflow.com/questions/36488743/django-allauth-overriding-default-signup-form

https://stackoverflow.com/questions/24536774/django-allauth-custom-user-generates-integrityerror-at-accounts-signup-custo#answer-24622274

*/

function Signup () {
    const [userName, setUserName] = useState("");
    const {authTokens, setAuthTokens} = useAuth();
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("unknown");
    const [isError, setIsError] = useState(false);
    const [csrfCookie, setCSRFCookie] = useState(Cookies.get('csrfcookie'));
    const [errorMessage, setErrorMessage] = useState("");
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [location, setLocation] = useState("/products/1");

    // need to set up useEffect to get csrfcookie from GET http://localhost:8000/accounts/signup/
    function postSignup() {
        const url = 'http://localhost:8000/rest-auth/registration/';
        const withCredentials = true;
        const method = 'post';
        const data = {
            "username": userName,
            "email": email,
            "password1": password1,
            "password2": password2
        };
        const headers = { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', };
        // BIG WARNING!!!
        // password is being passed unencrypted and in the clear.
        axios.request({url, withCredentials, data, method, headers}).then(
            result => {
                //console.log('Signup.postSignup result is :', result);
                if (result.status === 201) {
                    setIsSignedUp(true);
                    setAuthTokens(result.data);
                    return <Redirect to={location}/>
                } else {
                    //console.log('Signup.pistSignup else result is ', result)
                    setIsError(true);
                    if ( result.data.username ) {
                        setErrorMessage(result.data.username);
                    }
                }
            }).catch( (error) => { // Error
                //console.log('postSign up catch error error is ', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log('postSignup catch if error.response is', error.response);
                    // console.log('error.response.data is ', error.response.data);
                    // console.log('error.response.data keys is ', Object.keys(error.response.data));
                    // const errMsgs = Object.values(error.response.data).join(':');
                    // console.log('error.response.status is ', error.response.status);
                    // console.log('error.ressponse.headers is ', error.response.headers);
                    setErrorMessage(Object.values(error.response.data).join(':'));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the
                    // browser and an instance of
                    // http.ClientRequest in node.js
                    console.log('postSignup catch error error.request is ', error.request);
                    setErrorMessage('postSignup catch error error.request is '+ error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('ELSE Error', error.message);
                    setErrorMessage(error.message)
                }
                console.log('Signup postSignup catch error', error.config);
            });
    } // end postSignup
    if( isSignedUp ) {
        console.log('SIgnup isSignedUp is true and location is ', location)
        return <Redirect to={location}/>
    }
return (
    <Card>
        <Logo src={logoImg} />
        <div>{errorMessage}</div>
        <Form>
            <Input
                type="username"
                placeholder="username"
                value={userName}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setUserName(e.target.value); }} />
            <Input
                type="email"
                value={email}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setEmail(e.target.value); }}
                placeholder="email (optional)" />
            <Input
                type="password"
                value={password1}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setPassword1(e.target.value); }}
                placeholder="password" />
            <Input
                type="password"
                placeholder="password again"
                value={password2}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => { setPassword2(e.target.value); }} />
            <Button onClick={postSignup}>Sign Up</Button>
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
                //console.log('Login() /rest-auth/user response is ', response);
                // setAppUser({...appUser, ...response.data});
                //console.log('Login() useEffect setting appUser.');
                setAppUser((appUser) => ({...appUser, ...response.data}));
                setLoggedIn(true);
            })
            //    .catch(error => { setAppUser(null); setLoggedIn(false); })
        }
  }, [authTokens]);

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
                    // sessionStorage.setItem('key', JSON.stringify(result.data['key']));
                    sessionStorage.setItem('key', result.data['key']);
                    //console.log('XXX postLogin setting key to :', result.data['key']);
                    setAuthTokens(result.data);
                } else {
                    setIsError(true);
                }
            });// .catch(e => { console.log('Login.postLogin.catch e is :', e); setIsError(true); });
  } // end postLogin

  if (authTokens) {
    return <Redirect to={referer}/>;
  } else {
    //console.log('Login page authTokens is ', authTokens);
    //console.log('Login page appUser is ', appUser);
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
    const [authTokens, setAuthTokens] = useState(undefined);
    // type: AuthTokens | undefined (see auth.js)
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
            <Route path="/confirm-email/:id" component={ConfirmEmail} />
          </div>
        </Router>
      </AuthContext.Provider>
  );
};

export default App;
