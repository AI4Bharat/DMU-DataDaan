import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    boxShadow: theme.shadows[5],
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  const { handleClose, open } = props;
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal open={open} onClose={handleClose} {...props}>
      <div style={modalStyle} className={classes.paper}>
        {props.children}
      </div>
    </Modal>
  );
}
