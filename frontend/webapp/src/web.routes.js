import {
    Router,
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";
  import history from "./web.history";
  import Layout from "./ui/Layout";
  import authenticateUser from "./configs/authenticate";
  import Login from './ui/container/UserManagement';
  import UploadData from "./ui/container/UploadData";

  const PrivateRoute = ({
    path,
    component: Component,
    authenticate,
    title,
    token,
    type,
    index,
    ...rest
  }) => {
    return (
      <Route
        {...rest}
        render={(props) => {
          return authenticate() ? (
              <Layout component={Component} type={type} index={index} {...rest} />
            )
          : (
            <Redirect
              to={{
                pathname: `${process.env.PUBLIC_URL}/datadaan/user-login`,
                from: props.location.pathname,
              }}
            />
          );
        }}
      />
    );
  };
  
  export default function App() {
    console.log('App')
    return (
      <Router history={history} basename="/">
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path={`${process.env.PUBLIC_URL}/datadaan/user-login`} component={Login} />
          {/* <PrivateRoute  */}
        </Switch>
      </Router>
    );
  }
  