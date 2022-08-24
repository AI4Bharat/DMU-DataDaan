import { Typography } from "@material-ui/core";
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
    handleCancel,
    isChecked,
    toggleCheckbox,
    data,
  } = props;
  const [radio, setRadio] = useState(null);
  const handleRadioBtnChange = (e) => {
    setRadio(e.target.name);
  };
  const { mainText, specificPermissions } = data;

  return (
    <Modal
      disableEscapeKeyDown
      disableBackdropClick
      open={open}
      handleClose={handleClose}
    >
      <Card className={classes.card}>
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
        <CardContent
          style={{
            whiteSpace: "break-spaces",
            maxHeight: "50vh",
            overflow: "auto",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {/* <span>{`Digital India Bhashini, the National Language Translation Mission, has been launched by the Hon’ble Prime Minister on 4.7.2022 with the vision of harnessing natural language technologies to create a diverse ecosystem of contributors, partnering entities and citizens for the purpose of transcending language barriers, thereby ensuring digital inclusion and digital empowerment in an Atma Nirbhar Bharat. To this end, the Mission aims to develop a public digital platform for making available open source artificial intelligence (AI) models through Application Programming Interfaces (APIs) in Indian languages and English, to enable speech-to-text conversion, text-to-text translation, text-to-speech conversion, transliteration and optical character recognition.\n\nDevelopment and efficacy of the AI models would depend critically on the availability of large and good quality language datasets in speech and text forms, particularly of the kind used for public purposes. To help augment the available datasets, the Hon’ble Prime Minister has also launched a crowdsourcing initiative through BhashaDaan portal on the Bhashini platform`}</span>{" "}
              <Link href="https://bhashini.gov.in">Bhashini.</Link>
              <span>{`\n\nYour organization has generated a large volume of digital multilingual content for public purposes, much of which is already in the public domain. Sharing of such content with Bhashini would go a long way in helping realize the vision of a language-barriers-free India.\n\nPlease upload the content you intend to share onto the portal as a zipped tar file and a README file. The zipped tar file should include all content such as (pdf, docx, pptx, mp3, wav, jpeg, png files).  The README file should contain the metadata with the directory structure of the tar file. In addition, metadata  should contain a short description, format, language, domain for content file. The DMU team of Bhashini is available to assist in the creation of this README file.\n\nPlease select one of the two following terms under which the content is being shared with Bhashini:\n\n`}</span> */}
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
                      <>
                        <input
                          id={permission.code}
                          type="radio"
                          name={permission.code}
                          onChange={handleRadioBtnChange}
                        />
                        <label htmlFor={permission.code}>{permission.value}</label>
                        <br />
                        <br /> 
                      </>
                    );
                  }
                })}
              {/* <input
                id="radio1"
                type="radio"
                name="radio"
                onChange={handleRadioBtnChange}
              />
              <label htmlFor="test">
                {" "}
                Bhashini is granted the right to create and publish datasets for
                training AI models from the content shared. These datasets will
                be created by extracting a fraction of the content shared,
                processing and reshuffling the extracted content with other
                content sources so that it is impossible to recreate the
                original content from the dataset. The datasets shall be
                published using a Creative Commons (CC by 4.0) with attribution
                to the original contributors content. This is the preferred way
                to share content for which your organization has full rights as
                it will maximize the utility of the datasets for training AI
                models
              </label>{" "}
              <br />
              <br />
              <input
                id="radio2"
                type="radio"
                name="radio"
                onChange={handleRadioBtnChange}
              />
              <label htmlFor="test">
                {" "}
                Bhashini requests to be granted the right to train AI models
                from the content shared. The trained AI models shall be
                published using a Creative Commons (CC by 4.0) with attribution
                to the original contributors content. However, no public
                datasets will be created from the content shared.
              </label>{" "}
              <br /> */}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                label="I accept the terms and conditions"
              />
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
              <Button onClick={handleCancel} color="primnary" size="large">
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
                onClick={()=>handleAgree(radio,mainText.filter(text=>text.active)[0].code)}
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
