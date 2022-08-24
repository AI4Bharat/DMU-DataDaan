import {
  withStyles,
  AppBar,
  Toolbar,
  MuiThemeProvider,
  Link,
  Typography,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";
import HeaderStyles from "../styles/HeaderStyles";
import { translate } from "../../assets/localisation";
import Theme from "../theme/theme-default";
import Avatar from "@material-ui/core/Avatar";
import bhashiniLogo from "../../assets/Bhashini_en.svg";
import DatadaanLogo from "../../assets/DataDaan.svg";
import { useHistory } from "react-router-dom";
import DownIcon from "@material-ui/icons/ArrowDropDown";
import { useState } from "react";

const StyledMenu = withStyles({
  paper: {
    "@media (max-width:650px)": {
      width: "120px",
    },
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const Header = (props) => {
  const { classes } = props;
  const [logout, setAnchorElLogout] = useState(null);
  const history = useHistory();

  const handleClose = () => {
    setAnchorElLogout(null);
  };

  const handleLogoutOption = (e) => {
    setAnchorElLogout(e.currentTarget);
  };

  return (
    <MuiThemeProvider theme={Theme}>
      <AppBar color="inherit" position="static">
        <Toolbar className={classes.toolbar}>
        <Link href="https://bhashini.gov.in/en/">
              <img
                className={classes.bhashiniLogo}
                src={bhashiniLogo}
                alt="Bhashini Logo"
              />
            </Link>
            <a><span style={{fontWeight:'bolder',fontSize:'1.75rem'}}>Data</span><span style={{fontWeight:'bolder',color:'#ffcc35',marginLeft: "3px",fontSize:'1.75rem'}}>Daan</span></a>
          {/* <Typography variant="h4">{translate("label.dmuDataDaan")}</Typography> */}
          {/* <img
                className={classes.bhashiniLogo}
                src={DatadaanLogo}
                alt="Datadaan Logo"
              /> */}

          <div className={classes.profile}>
            <Button
              onClick={(e) => handleLogoutOption(e)}
              className={classes.menuBtn}
            >
              <Avatar
                className={classes.avatar}
                variant="contained"
              >{`D`}</Avatar>
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.profileName}
              >{`DMU Master`}</Typography>
              <DownIcon color="action" />
            </Button>
            <StyledMenu
              id="data-set"
              anchorEl={logout}
              open={Boolean(logout)}
              onClose={(e) => handleClose(e)}
              className={classes.styledMenu1}
            >
              <MenuItem
                className={classes.styledMenu}
                onClick={() => {
                  localStorage.clear();
                  history.push(`${process.env.PUBLIC_URL}`);
                }}
              >
                {translate("label.logOut")}
              </MenuItem>
            </StyledMenu>
          </div>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

export default withStyles(HeaderStyles)(Header);
