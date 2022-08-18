import { Button, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import FileUpload from "../../components/FileUpload";
import GlobalStyles from "../../styles/Styles";
import TermsAndConditionModal from "./TermsAndConditionsModal";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import FileUploadAPI from "../../../actions/apis/FileUpload/FileUpload";
import config from "../../../configs/config";
import apiendpoints from "../../../configs/apiendpoints";
import Spinner from "../../components/Spinner";
import Snackbar from "../../components/Snackbar";
const UploadData = (props) => {
  const { classes } = props;
  const [modal, setModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [meta, setMeta] = useState([]);
  const [zip, setZip] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbar, open: false });
  };

  useEffect(() => {
    // setLoading(false);
    const isAccepted = localStorage.getItem("isAccepted");
    setModal(!isAccepted);
  }, []);

  const handleClose = () => {
    setModal(false);
  };

  const handleCancel = () => {
    history.push(`${process.env.PUBLIC_URL}/`);
  };

  const handleAgree = () => {
    localStorage.setItem("isAccepted", true);
    handleClose();
  };

  const handleCheckboxChange = (event) => {
    setCheckbox(event.target.checked);
  };

  const handleFileChange = (files) => {
    if (files.length > 0) {
      let path = files[0].name.split(".");
      let fileType = path[path.length - 1];
      let fileName = path.splice(0, path.length - 1).join(".");
      return { path, fileType, fileName };
    }
  };

  const handleMetaFileChange = (files) => {
    console.log("handleMetaFileChange", files);
    // handleFileChange(files);
    setMeta(files);
  };

  const handleZipFileChange = (files) => {
    console.log("handleZipFileChange", files);
    // handleFileChange(files);
    setZip(files);
  };

  const deletZipFile = () => {
    setZip([]);
  };

  const deleteMetaFile = () => {
    setMeta([]);
  };

  const clearFiles = () => {
    deleteMetaFile();
    deletZipFile();
  };

  const handleSubmit = () => {
    setLoading(true);
    const apiObj = new FileUploadAPI(meta,zip)
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: apiObj.getFormData(),
      headers: apiObj.getHeaders().headers,
    })
    .then(async res=>{
      const rsp_data = await res.json();
      if(res.ok){
        setSnackbarInfo({
          ...snackbar,
          open: true,
          message: rsp_data.message,
          variant: "success",
        });
      }
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      setSnackbarInfo({
        ...snackbar,
        open: true,
        message: err.message,
        variant: "error",
      });
    });

    // const apiendpoint = `${config.BASE_URL_AUTO}${apiendpoints.upload}`;
    // const {
    //   token,
    //   user: { userId },
    // } = JSON.parse(localStorage.getItem("userInfo"));
    // const formData = new FormData();
    // formData.append("zipFile", zip[0]);
    // formData.append("metadata", meta[0]);
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}`);
    // }
    // fetch(apiendpoint, {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     "x-token": token,
    //     "x-user-id": userId,
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    //   .then(async (res) => {
    //     const rsp_data = await res.json();
    //     if (res.ok) {
    //       console.log(rsp_data);
    //     } else {
    //       return Promise.reject(rsp_data);
    //     }
    //   })
    //   .catch((err) => err);
  };

  return (
    <>
    {loading && <Spinner />}
      <Grid container spacing={4} style={{marginTop:"80px", paddingRight:"150px" }}>
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
          <FileUpload
            acceptedFiles={[".xlsx",".tsv"]}
            handleFileChange={handleMetaFileChange}
            handleFileDelete={clearFiles}
            label={meta.length>0 ? meta[0].name: ""}
          />
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
          <FileUpload
            acceptedFiles={[".zip"]}
            handleFileChange={handleZipFileChange}
            handleFileDelete={clearFiles}
            label={zip.length>0 ? zip[0].name:""}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} style={{ paddingTop: "15px" }}>
        <Grid
          item
          xs={7}
          sm={7}
          md={7}
          lg={7}
          xl={7}
          className={classes.flexEnd}
        >
          {/* <Button size="large" color="primary" variant="contained" onClick={clearFiles}>
            Clear
          </Button> */}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={classes.flexCenter}
        >
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
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
      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          handleClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          message={snackbar.message}
          variant={snackbar.variant}
        />
      )}
    </>
  );
};

export default withStyles(GlobalStyles)(UploadData);
