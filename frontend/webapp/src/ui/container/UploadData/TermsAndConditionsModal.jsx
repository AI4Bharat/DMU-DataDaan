import { FormControl, RadioGroup, Typography } from "@material-ui/core";
import { Radio } from "@material-ui/core";
import {
  Card,
  CardHeader,
  withStyles,
  IconButton,
  CardContent,
  CardActionArea,
  Checkbox,
  CardActions,
  FormControlLabel,
  Button,
  Grid,
  Link,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import Modal from "../../components/Modal";
import GlobalStyles from "../../styles/Styles";

const TermsAndConditionModal = ({ open, handleClose, ...props }) => {
  const {
    classes,
    handleAgree,
    isChecked,
    toggleCheckbox,
    data,
  } = props;

  const [radio, setRadio] = useState(null);
  const handleRadioBtnChange = (e) => {
    setRadio(e.target.name);
  };

  const { mainText, specificPermissions, acceptance, additionalDetails } = data;

  return (
    <Modal
      disableEscapeKeyDown
      disableBackdropClick
      open={open}
      handleClose={handleClose}
    >
      <Card className={classes.card}>
        <CardHeader title={<span>Terms And Conditions</span>} />
        <CardContent
          style={{
            whiteSpace: "break-spaces",
            maxHeight: "50vh",
            overflow: "auto",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {mainText.length &&
                mainText.map((text) => {
                  if (text.active) return <span>{text.value}</span>;
                })}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  {specificPermissions.length &&
                    specificPermissions.map((permission) => {
                      if (permission.active) {
                        return (
                          <div className={classes.radioBox}>
                            <input
                              id={permission.code}
                              type="radio"
                              name={permission.code}
                              onChange={handleRadioBtnChange}
                              checked={radio === permission.code}
                              className={classes.radioBtn}
                            />
                            <label htmlFor={permission.code} className={classes.radiolabel}>
                              {permission.value}
                            </label>
                            <br />
                            <br />
                          </div>
                        );
                      }
                    })}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "15px" }}>
              {additionalDetails.length &&
                additionalDetails.map((text) => {
                  if (text.active) {
                    return <span>{text.value}</span>;
                  }
                })}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {acceptance.length &&
                acceptance.map((text) => {
                  if (text.active) {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            name="termsandconditions"
                            value={isChecked}
                            onChange={toggleCheckbox}
                            disabled={!radio}
                          />
                        }
                        label={text.value}
                      />
                    );
                  }
                })}
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={8}
              lg={9}
              xl={9}
              className={classes.flexEnd}
            >
              <Button onClick={handleClose} color="primnary" size="large">
                Cancel
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={classes.flexEnd}
            >
              <Button
                disabled={!isChecked}
                onClick={() =>
                  handleAgree(
                    radio,
                    mainText.filter((text) => text.active)[0].code,
                    additionalDetails.filter((text) => text.active)[0].code,
                    acceptance.filter((text) => text.active)[0].code
                  )
                }
                color="primary"
                variant="contained"
                size="large"
              >
                Accept and continue
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default withStyles(GlobalStyles)(TermsAndConditionModal);
