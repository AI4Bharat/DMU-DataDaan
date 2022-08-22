import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  progress: {
    position: "relative",
  },
  progressDiv: {
    position: "fixed",
    backgroundColor: "rgba(0.5, 0, 0, 0.5)",
    zIndex: 1000,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0.7,
  },
});

function LinearIndeterminate(props) {
  const { classes } = props;

  return (
    <div className={classes.progressDiv}>
      <LinearProgress className={classes.progress} />
    </div>
  );
}

export default withStyles(styles)(LinearIndeterminate);
