import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import history from "./web.history";
import Layout from "./ui/Layout";
import authenticateUser from "./configs/authenticate";
import Login from "./ui/container/UserManagement";
import UploadData from "./ui/container/UploadData";
import MyContribution from "./ui/container/MyContribution";

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
        ) : (
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
  return (
    <HashRouter history={history} basename="/">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/datadaan/user-login`}
          component={Login}
        />
        <PrivateRoute
          path={`${process.env.PUBLIC_URL}/datadaan/upload-data`}
          title={"Upload Data"}
          authenticate={authenticateUser}
          component={UploadData}
          currentMenu="upload-data"
          dontShowHeader={false}
          type={"dataset"}
          index={0}
        />

        <PrivateRoute
          path={`${process.env.PUBLIC_URL}/datadaan/my-contribution`}
          title={"My Contribution"}
          authenticate={authenticateUser}
          component={MyContribution}
          currentMenu="upload-data"
          dontShowHeader={false}
          type={"dataset"}
          index={0}
        />
      </Switch>
    </HashRouter>
  );
}
