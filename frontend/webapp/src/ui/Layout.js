import React from "react";
import Theme from "./theme/theme-default";
import { withStyles, MuiThemeProvider } from "@material-ui/core";
import GlobalStyles from "./styles/Styles";
import Header from "./components/Header";

function App(props) {
  const Component = props.component;
  const { classes } = props;
  return (
    <MuiThemeProvider theme={Theme}>
      <div className={classes.root}>
        <div className={classes.container}>
          <Header />
          <Component />
        </div>
      </div>
    </MuiThemeProvider>
  );
}
export default withStyles(GlobalStyles(Theme), { withTheme: true })(App);
