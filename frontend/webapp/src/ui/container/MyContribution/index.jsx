import { CircularProgress } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import FetchMyContributionListAPI from "../../../actions/apis/MyContribution/FetchMyContributionList";
import Theme from "../../theme/theme-default";
import moment from "moment";

const MyContribution = (props) => {
  const { classes } = props;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const fetchMyContributionList = async () => {
    setLoading(true);
    const apiObj = new FetchMyContributionListAPI();

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      const result = resp.map((item) => {
        return [
          item.createdTimestamp,
          item.uploadId,
          item.mediaFilePath,
          item.metadataFilePath,
          item.agreement.permission === "BHASHINI_IS_GRANTED_V1"
            ? "For Use and Share"
            : "Only Use",
          item.uploadStatus,
        ];
      });
      setTableData(result);
      setLoading(false);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.detail,
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyContributionList();
  }, []);

  const columns = [
    {
      name: "createdTimestamp",
      label: "Created Timestamp",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          const date = new Date(value);
          return <>{moment(date).format("DD/MM/YYYY HH:MM:SS")}</>;
        },
      },
    },

    {
      name: "uploadId",
      label: "Upload Id",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "mediaFilePath",
      label: "Media File",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          const temp = value.split("/");
          return <>{temp[temp.length - 1]}</>;
        },
      },
    },
    {
      name: "metadataFilePath",
      label: "Meta File",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          const temp = value.split("/");
          return <>{temp[temp.length - 1]}</>;
        },
      },
    },
    {
      name: "agreement",
      label: "Permissions",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "uploadStatus",
      label: "Upload status",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress color="primary" size={50} />
        ) : (
          "No records"
        ),
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: true,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: true,
    jumpToPage: true,
  };

  return (
    <MuiThemeProvider theme={Theme}>
      <MUIDataTable data={tableData} columns={columns} options={options} />
    </MuiThemeProvider>
  );
};

export default MyContribution;
