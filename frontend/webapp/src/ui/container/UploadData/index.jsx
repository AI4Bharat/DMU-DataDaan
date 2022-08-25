import { Box, Button, Divider, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { Grid, Typography } from "@material-ui/core";
import { useState } from "react";
import FileUpload from "../../components/FileUpload";
import GlobalStyles from "../../styles/Styles";
import TermsAndConditionModal from "./TermsAndConditionsModal";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import FileUploadAPI from "../../../actions/apis/FileUpload/FileUpload";
import Snackbar from "../../components/Snackbar";
import LinearIndeterminate from "../../components/LinearProgress";
import TermsAndConditions from "../../../actions/apis/TermsAndConditions/GetTermsAndConditions";
import AcceptTermsAndConditions from "../../../actions/apis/TermsAndConditions/AcceptTermsAndConditions";

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
  const [tAndCData, setTAndCData] = useState({});

  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbar, open: false });
  };

  const fetchTAndCData = async () => {
    const apiObj = new TermsAndConditions();
    fetch(apiObj.apiEndPoint(), {
      method: "get",
      headers: apiObj.getHeaders(),
    })
      .then(async (res) => {
        const rsp_data = await res.json();
        if (res.ok) {
          const {
            termsAndConditions: { mainText, specificPermissions },
          } = rsp_data;
          setTAndCData({ mainText, specificPermissions });
        } else {
          return Promise.reject(rsp_data);
        }
      })
      .catch((err) => {
        setSnackbarInfo({
          ...snackbar,
          open: true,
          message: err.message,
          variant: "error",
        });
      });
  };

  useEffect(() => {
    const {
      user: { termsAndConditions },
    } = JSON.parse(localStorage.getItem("userInfo"));
    if (termsAndConditions === undefined) {
      fetchTAndCData();
      setModal(true);
    }
  }, []);

  const handleClose = () => {
    setModal(false);
  };

  const handleCancel = () => {
    history.push(`${process.env.PUBLIC_URL}/`);
  };

  const acceptTermsAndConditions = (permission, termsAndConditions) => {
    const apiObj = new AcceptTermsAndConditions(termsAndConditions, permission);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (res) => {
        const rsp_data = await res.json();
        if (res.ok) {
          localStorage.setItem("isAccepted", true);
          setSnackbarInfo({
            ...snackbar,
            open: true,
            message: rsp_data.message,
            variant: "success",
          });
          handleClose();
        } else {
          return Promise.reject(rsp_data);
        }
      })
      .catch((err) => {
        handleClose();
        setSnackbarInfo({
          ...snackbar,
          open: true,
          message: err.message,
          variant: "error",
        });
        setTimeout(() => {
          localStorage.clear();
          history.push(`${process.env.PUBLIC_URL}/`);
        }, [3000]);
      });
  };

  const handleAgree = (permission, termsAndConditions) => {
    acceptTermsAndConditions(permission, termsAndConditions);
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
    setMeta(files);
  };

  const handleZipFileChange = (files) => {
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
    setSnackbarInfo({
      ...snackbar,
      open: true,
      message:
        "Upload in progress. Please wait, it can take several minutes depending on the size",
      variant: "info",
    });
    setLoading(true);
    const apiObj = new FileUploadAPI(meta, zip);
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: apiObj.getFormData(),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (res) => {
        const rsp_data = await res.json();
        if (res.ok) {
          setSnackbarInfo({
            ...snackbar,
            open: true,
            message: rsp_data.message,
            variant: "success",
          });
        } else {
          return Promise.reject(rsp_data);
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
      {/* {loading && <Spinner />} */}
      {loading && <LinearIndeterminate />}
      <Box className={classes.flexBox}>
        <Box className={classes.parentBox}>
          <Box
            style={{
              alignSelf: "center",
            }}
          >
            <Typography>How to submit the files</Typography>
            <ul>
              <li>Make sure the names of text file and zip file are same.</li>
              <li>Max supported zip file size is 5 GB.</li>
            </ul>
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box style={{ width: "55%" }}>
            <Box className={`${classes.parentBox} ${classes.innerBox}`}>
              <Typography style={{ marginRight: "auto" }}>
                README.txt
              </Typography>
              <FileUpload
                acceptedFiles={[".txt"]}
                handleFileChange={handleMetaFileChange}
                handleFileDelete={clearFiles}
                label={meta.length > 0 ? meta[0].name : ""}
                style={{ width: "65%" }}
              />
            </Box>
            <Box
              className={`${classes.parentBox}  ${classes.innerBox}`}
              style={{
                marginTop: "35px",
              }}
            >
              <Typography style={{ marginRight: "auto" }}>
                Media Files zip
              </Typography>
              <FileUpload
                acceptedFiles={[".zip"]}
                handleFileChange={handleZipFileChange}
                handleFileDelete={clearFiles}
                label={zip.length > 0 ? zip[0].name : ""}
                style={{ width: "65%" }}
              />
            </Box>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className={classes.submitBtn}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>

      {modal && Object.keys(tAndCData).length && (
        <TermsAndConditionModal
          open={modal}
          isChecked={checkbox}
          toggleCheckbox={handleCheckboxChange}
          handleClose={handleClose}
          handleAgree={handleAgree}
          handleCancel={handleCancel}
          data={tAndCData}
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
