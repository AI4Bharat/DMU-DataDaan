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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "../../components/Modal";
import GlobalStyles from "../../styles/Styles";

const TermsAndConditionModal = ({ open, handleClose, ...props }) => {
  const { classes, handleAgree, handleCancel, isChecked, toggleCheckbox } = props;
  return (
    <Modal
      disableEscapeKeyDown
      disableBackdropClick
      open={open}
      handleClose={handleClose}
    >
      <Card>
        <CardHeader
          title={
            <span>
              Terms And Conditions
              {/* <div className={classes.iconbutton}> */}
              {/* <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton> */}
              {/* </div> */}
            </span>
          }
        />
        <CardContent>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus
          perferendis minima inventore dignissimos officia excepturi, explicabo
          facere iste aperiam porro obcaecati, magni praesentium, id iure!
          Beatae sapiente qui unde delectus.
        </CardContent>
        <CardActions>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControlLabel
                control={<Checkbox color="primary" name="termsandconditions" value={isChecked} onChange={toggleCheckbox} />}
                label="I accept the terms and conditions"
              />
            </Grid>
            <Grid
              item
              xs={10}
              sm={10}
              md={10}
              lg={10}
              xl={10}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={handleCancel} color="primnary">
                CANCEL
              </Button>
            </Grid>
            <Grid item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button disabled={!isChecked} onClick={handleAgree} color="primary">
                I AGREE
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default withStyles(GlobalStyles)(TermsAndConditionModal);
