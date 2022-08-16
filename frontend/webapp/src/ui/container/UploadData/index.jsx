import { Button, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import FileUpload from "../../components/FileUpload";
import GlobalStyles from "../../styles/Styles";
import TermsAndConditionModal from "./TermsAndConditionsModal";
import { useHistory } from "react-router-dom";

const UploadData = (props) => {
  const { classes } = props;
  const [modal, setModal] = useState(true);
  const [checkbox,setCheckbox] = useState(false);

  const history = useHistory();

  const handleClose = () => {
    setModal(false);
  };

  const handleCancel = () => {
    history.push(`${process.env.PUBLIC_URL}/`);
  };

  const handleAgree = () => {
    handleClose();
  };

  const handleCheckboxChange = (event)=>{
    setCheckbox(event.target.checked);
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classes.flexCenter}
        >
          <Typography>Metadata File</Typography>
          <Link
            className={classes.flexCenter}
            href="https://docs.google.com/spreadsheets/d/1jo9Pr2rbg_gph78pbM-0oXdxRrA4RaKRSZGNDRn7E4k/edit#gid=0 "
          >
            (Format available here)
          </Link>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <FileUpload acceptedFiles={[".xlsx"]} />
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classes.flexCenter}
        >
          <Typography>Media Files zip</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <FileUpload acceptedFiles={[".zip"]} />
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classes.flexEnd}
        >
          <Button size="large" color="primary" variant="contained">
            Clear
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Button size="large" color="primary" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
      {modal && (
        <TermsAndConditionModal
          open={modal}
          isChecked={checkbox}
          toggleCheckbox={handleCheckboxChange}
          handleClose={handleClose}
          handleAgree={handleAgree}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default withStyles(GlobalStyles)(UploadData);
