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

  useEffect(() => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userDetails");
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
          localStorage.removeItem("acceptedTnC");
          history.push(`${process.env.PUBLIC_URL}/datadaan/my-contribution`);
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
      handleSubmit();
    }
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
    </>
  );
};

export default withStyles(LoginStyles)(Login);
