import { withStyles } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import FileUploadStyles from "../styles/FileUploadStyles";

const FileUpload = (props) => {
  const { classes,acceptedFiles } = props;
  return (
    <DropzoneArea
      className={classes.DropZoneArea}
      showPreviewsInDropzone
      dropZoneClass={classes.dropZoneArea}
      acceptedFiles={acceptedFiles}
      filesLimit={1}
      maxFileSize={200000000}
      dropzoneText={"Drag and drop files here"}
    />
  );
};

export default withStyles(FileUploadStyles)(FileUpload);
// export default FileUpload;
