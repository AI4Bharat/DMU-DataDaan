import {
  withStyles,
  AppBar,
  Toolbar,
  MuiThemeProvider,
  Link,
  Typography,
} from "@material-ui/core";
import HeaderStyles from "../styles/HeaderStyles";
import { translate } from "../../assets/localisation";
import Theme from "../theme/theme-default";
import Avatar from "@material-ui/core/Avatar";
import bhashiniLogo from "../../assets/Bhashini_en.svg";

const Header = (props) => {
  const { classes } = props;
  return (
    <MuiThemeProvider theme={Theme}>
      <AppBar color="inherit" position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h4">{translate("label.dmuDataDaan")}</Typography>
          <div className={classes.profile}>
            <Avatar className={classes.avatar} variant="contained">
              DMU
            </Avatar>
          </div>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

export default withStyles(HeaderStyles)(Header);
