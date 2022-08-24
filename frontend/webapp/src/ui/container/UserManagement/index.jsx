import { Grid, MuiThemeProvider, withStyles } from "@material-ui/core";
import Theme from "../../theme/theme-default";
import AppInfo from "./AppInfo";
import Login from "./Login";
import { useParams } from "react-router-dom";
import LoginStyles from "../../styles/Login";

const UserManagement = (props) => {
  const { classes } = props;

  const param = useParams();
  const renderPage = () => {
    switch (param && param.page) {
      case "user-login":
        return <Login location={props.location} />;
      default:
        return <Login />;
    }
  };
  return (
    <MuiThemeProvider theme={Theme}>
      <Grid container>
        <AppInfo />
        <Grid item xs={12} sm={8} md={9} lg={9} className={classes.parent}>
          {renderPage()}
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

export default withStyles(LoginStyles)(UserManagement);
