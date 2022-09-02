import {
  Grid,
  Typography,
  withStyles,
  Button,
  TextField,
  Link,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  FormHelperText,
  FormControl,
  CircularProgress,
} from "@material-ui/core";

import React, { useState, useEffect } from "react";
import LoginStyles from "../../../styles/Login";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import config from "../../../../configs/config";
import apiEndPoint from "../../../../configs/apiendpoints";
import Snackbar from "../../../components/Snackbar";
import TermsAndConditions from "../../../../actions/apis/TermsAndConditions/GetTermsAndConditions";
import TermsAndConditionsModal from "../../UploadData/TermsAndConditionsModal";

const Login = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    checked: false,
  });
  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [tAndCData, setTAndCData] = useState({});
  const [modal, setModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

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
            termsAndConditions: { acceptance, additionalDetails, mainText, specificPermissions },
          } = rsp_data;
          setTAndCData({ acceptance, additionalDetails, mainText, specificPermissions });
          localStorage.setItem("termsAndConditions", JSON.stringify( {acceptance, additionalDetails, mainText, specificPermissions}))
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
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userDetails");
    fetchTAndCData();
  }, []);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const handleChange = (prop) => (event) => {
    setError({ ...error, password: false, email: false });
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    const apiendpoint = `${config.BASE_URL_AUTO}${apiEndPoint.login}`;
    const { email, password } = values;
    const body = JSON.stringify({ username: email, password });
    fetch(apiendpoint, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const rsp_data = await res.json();
        if (res.ok) {
          localStorage.setItem("userInfo", JSON.stringify(rsp_data));
          history.push(`${process.env.PUBLIC_URL}/datadaan/upload-data`);
        } else {
          return Promise.reject(rsp_data);
        }
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

  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbar, open: false });
  };

  const HandleSubmitCheck = () => {
    if (!values.email.trim() || !values.password.trim()) {
      setError({
        ...error,
        email: !values.email.trim() ? true : false,
        password: !values.password.trim() ? true : false,
      });
    } else {
      setModal(true);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleAgree = (permission, termsAndConditions, additionalDetails, acceptance) => {
    localStorage.setItem("acceptedTnC", JSON.stringify({permission, termsAndConditions, additionalDetails, acceptance}))
    handleSubmit();
    setLoading(true);
  };

  const handleCheckboxChange = (event) => {
    setCheckbox(event.target.checked);
  };

  const handleCancel = () => {
    history.push(`${process.env.PUBLIC_URL}/`);
  };

  const { classes } = props;

  return (
    <>
      <Grid container className={classes.loginGrid}>
        <Typography variant="h4">Sign in</Typography>
        <form className={classes.root} autoComplete="off">
          <TextField
            className={classes.textField}
            required
            onChange={handleChange("email")}
            onKeyPress={(e) => e.key === "Enter" && HandleSubmitCheck()}
            id="outlined-required"
            value={values.email}
            error={error.email}
            label="Email address"
            helperText={error.email ? "Enter an email" : " "}
            variant="outlined"
          />
          <FormControl className={classes.fullWidth} variant="outlined">
            <InputLabel
              error={error.password}
              htmlFor="outlined-adornment-password"
            >
              Password *{" "}
            </InputLabel>

            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              required
              error={error.password}
              helperText={error.password ? "Enter a password" : ""}
              onChange={handleChange("password")}
              onKeyPress={(e) => e.key === "Enter" && HandleSubmitCheck()}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={100}
            />
            {error.password && (
              <FormHelperText error={true}>Incorrect password</FormHelperText>
            )}
          </FormControl>
          {/* <div className={classes.forgotPassword}>
            <Typography className={classes.forgoLink}>
              <Link
                id="newaccount"
                className={classes.link}
                href="#"
                onClick={() => { history.push(`${process.env.PUBLIC_URL}/user/forgot-password`) }}
              >
                {" "}
                Forgot Password?
              </Link>
            </Typography>
          </div> */}

          <Button
            color="primary"
            size="large"
            variant="contained"
            aria-label="edit"
            className={classes.fullWidth}
            onClick={() => {
              HandleSubmitCheck();
            }}
            disabled={loading}
          >
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
            Sign In
          </Button>
        </form>
        {/* <div className={classes.createLogin}>
          <Typography variant={"body2"} className={classes.width}>New to ULCA ?</Typography>
          <Typography variant={"body2"} >
            <Link id="newaccount" className={classes.link} href="#"
              onClick={() => { history.push(`${process.env.PUBLIC_URL}/user/register`) }}>
              {" "}
              Create an account
            </Link>
          </Typography>
        </div> */}
      </Grid>
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

export default withStyles(LoginStyles)(Login);
