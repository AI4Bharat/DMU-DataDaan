import { Box, Button, Divider, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import FileUpload from "../../components/FileUpload";
import GlobalStyles from "../../styles/Styles";
import { useHistory } from "react-router-dom";
import FileUploadAPI from "../../../actions/apis/FileUpload/FileUpload";
import Snackbar from "../../components/Snackbar";
import LinearIndeterminate from "../../components/LinearProgress";
import TermsAndConditionsModal from "./TermsAndConditionsModal";
import TermsAndConditions from "../../../actions/apis/TermsAndConditions/GetTermsAndConditions";
import { textFields } from "../../../utils/utils";

const UploadData = (props) => {
  const { classes } = props;
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
  const [modal, setModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [userDetails, setUserDetails] = useState({
    orgName: "",
    officerName: "",
    designation: "",
    emailId: "",
    contactNumber: "",
  });

  const disableSubmit = () => {
    if (
      meta.length <= 0 ||
      zip.length <= 0 ||
      !userDetails.orgName ||
      !userDetails.officerName ||
      !userDetails.designation ||
      !userDetails.emailId ||
      !userDetails.contactNumber
    ) {
      return true;
    }

    return false;
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
            termsAndConditions: {
              acceptance,
              additionalDetails,
              mainText,
              specificPermissions,
            },
          } = rsp_data;
          setTAndCData({
            acceptance,
            additionalDetails,
            mainText,
            specificPermissions,
          });
          setModal(true);
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
    if (!localStorage.getItem("acceptedTnC")) {
      fetchTAndCData();
    }
  }, []);

  const handleClose = () => {
    history.push(`${process.env.PUBLIC_URL}/datadaan/my-contribution`);
    setModal(false);
  };

  const handleAgree = (
    permission,
    termsAndConditions,
    additionalDetails,
    acceptance
  ) => {
    localStorage.setItem(
      "acceptedTnC",
      JSON.stringify({
        permission,
        termsAndConditions,
        additionalDetails,
        acceptance,
      })
    );
    setModal(false);
  };

  const handleCheckboxChange = (event) => {
    setCheckbox(event.target.checked);
  };

  const handleCancel = () => {
    history.push(`${process.env.PUBLIC_URL}/datadaan/my-contribution`);
  };

  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbar, open: false });
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

    const { permission, termsAndConditions, additionalDetails, acceptance } =
      JSON.parse(localStorage.getItem("acceptedTnC"));

    const apiObj = new FileUploadAPI(
      meta,
      zip,
      permission,
      termsAndConditions,
      additionalDetails,
      acceptance,
      userDetails
    );

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
  };

  const handleClearAll = () => {
    setMeta([]);
    setZip([]);
    setUserDetails({
      orgName: "",
      officerName: "",
      designation: "",
      emailId: "",
      contactNumber: "",
    });
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
            <Typography>Best practices for submitting the files</Typography>
            <ul>
              <li className={classes.listStyle}>
                Make sure the names of text file and zip file are{" "}
                <strong>same</strong>.
              </li>
              <li className={classes.listStyle}>
                Max supported zip file size is <strong>5 GB</strong>.
              </li>
              <li className={classes.listStyle}>
                The README file should also contain metadata that specifies the{" "}
                <strong>directory structure</strong> of the zipped file.
              </li>
            </ul>
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box style={{ width: "80%" }}>
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

            {textFields.map((item, index) => {
              return (
                <Box
                  className={`${classes.parentBox}  ${classes.innerBox}`}
                  style={{ marginTop: "35px" }}
                  key={index}
                >
                  <Typography style={{ marginRight: "auto", width: "30%" }}>
                    {item.label}*
                  </Typography>

                  <TextField
                    fullWidth
                    color="primary"
                    style={{ width: "70%" }}
                    label={"Enter here"}
                    name={item.name}
                    type={item.type}
                    value={userDetails[item.name]}
                    onChange={(event) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        [event.target.name]: event.target.value,
                      }))
                    }
                  />
                </Box>
              );
            })}

            <Box style={{ display: "flex" }}>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={handleClearAll}
                className={classes.submitBtn}
                style={{ width: "25%" }}
              >
                Clear All
              </Button>
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className={classes.submitBtn}
                disabled={disableSubmit()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          handleClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          message={snackbar.message}
          variant={snackbar.variant}
        />
      )}

      {modal && (
        <TermsAndConditionsModal
          open={modal}
          isChecked={checkbox}
          toggleCheckbox={handleCheckboxChange}
          handleClose={handleClose}
          handleAgree={handleAgree}
          handleCancel={handleCancel}
          data={tAndCData}
        />
      )}
    </>
  );
};

export default withStyles(GlobalStyles)(UploadData);
