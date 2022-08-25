import { Grid, Hidden, Typography, withStyles, Link} from "@material-ui/core";
import LoginStyles from "../../styles/Login";
import { useHistory } from "react-router-dom";
import { translate } from "../../../assets/localisation";
import bhashiniLogo from "../../../assets/Bhashini_en.svg";
import LoginLogo from "../../../assets/LoginLogo.png";

function AppInfo(props) {
  const { classes } = props;
  const history = useHistory();
  return (
    <Grid
      item
      xs={12}
      sm={4}
      md={3}
      lg={3}
      color={"primary"}
      className={classes.appInfo}
    >
      <Link href="https://bhashini.gov.in/en/">
        <img
          className={classes.logo}
          src={LoginLogo}
          alt="Logo"
        />
      </Link>
      
      {/* <Typography
        className={classes.title}
        variant={"h2"}
        onClick={() => {
          history.push(`${process.env.PUBLIC_URL}/dashboard`);
        }}
      >
        {translate("label.dmuDataDaan")}
      </Typography> */}
      <Hidden only="xs">
        <Typography variant={"body1"} className={classes.body}>
          {translate("label.dmuDataDaanInfo")}
        </Typography>
      </Hidden>
    </Grid>
  );
}

export default withStyles(LoginStyles)(AppInfo);
