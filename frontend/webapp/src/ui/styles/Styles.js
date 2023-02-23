const GlobalStyles = (theme) => ({
  container: {
    maxWidth: "1272px",
    width: "100%",
    margin: "2rem auto",
    // background: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,
  },

  card:{
    padding:theme.spacing(2),
    textAlign: "justify"
  },

  flexCenter: {
    display: "flex",
    flexDirection:'column',
    justifyContent: "center",
    alignItems: "center",
  },

  flexEnd: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  headerContainer: {
    height: "70px",
  },
  root: {
    flexGrow: 1,
    height: window.innerHeight,
    zIndex: 1,
    position: "relative",
    minHeight: "720px",
    display: "flex",
    flexDirection: "column",
  },
  appBar: {
    backgroundColor: theme.palette.primary.dark,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  typeTypo: {
    color: "black",
    backgroundColor: "#FFD981",
    borderRadius: "24px",
    padding: "5px 10px",
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardGrid: {
    marginTop: "20px",
  },
  modelname: {
    boxSizing: "border-box",
    marginTop: "15px",
    height: "64px",
    backgroundColor: "white",
    maxWidth: "350px",
    minWidth: "350px",
    width: "auto",
    display: "flex",
    alignItems: "center",
    padding: "0 15px",
    borderRadius: "12px",
  },

  contributionTextBox: {
    marginTop: "30px",
  },

  contributionTextBoxInput: {
    fontSize: "14px",
  },

  iconbutton: {
    position: "absolute",
    right: "15px",
    top: "5px",
  },

  flexBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "80vh",
  },
  
  parentBox: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
  }, 

  innerBox: {
    alignItems: "center", 
    justifyContent: "flex-start" 
  },

  submitBtn: {
    display: "block",
    width: "75%",
    marginTop: "10%",
    marginRight: "5%",
  },

  radioBox: {
    display: "flex",
    alignItems: "baseline",
  },

  radiolabel: {
    marginTop: "15px",
    marginLeft: "10px"
  },

  listStyle: {
    margin: "8px 0",
    fontSize: "18px"
  }
});

export default GlobalStyles;
