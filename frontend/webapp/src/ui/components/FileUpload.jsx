import {
  withStyles,
  TextField,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import FileUploadStyles from "../styles/FileUploadStyles";
import Files from "react-files";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Theme from '../theme/theme-default';

const FileUpload = (props) => {
  const { classes, acceptedFiles, handleFileChange,label,error } = props;

  return (
    <div ondrop={handleFileChange} style={{width: "70%"}}>
      <TextField
        fullWidth
        color="primary"
        label="Upload the file"
        value={label}
        // error={error.file ? true : false}
        // helperText={error.file}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <Files
                onChange={handleFileChange}
                accepts={acceptedFiles}
                multiple
                clickable
              >
                <Button
                  color="primary"
                  className={classes.browseBtn}
                  variant="outlined"
                >
                  Browse
                  <input type="file" hidden />
                </Button>
              </Files>
            </InputAdornment>
          ),
        }}
      />
    </div>
    // <MuiThemeProvider theme={Theme}>
    // <DropzoneArea
    //   // className={classes.DropZoneArea}
    //   showPreviewsInDropzone
    //   // dropZoneClass={classes.dropZoneArea}
    //   acceptedFiles={acceptedFiles}
    //   filesLimit={1}
    //    maxFileSize={5000000000}
    //   dropzoneText={"Drag and drop files here"}
    //   onChange={handleFileChange}
    //   showFileNamesInPreview
    // />
    // </MuiThemeProvider>
  );
};

export default withStyles(FileUploadStyles)(FileUpload);
