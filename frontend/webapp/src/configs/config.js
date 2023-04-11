const config = {
  BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
  ? process.env.REACT_APP_APIGW_BASE_URL
    :"https://datadaan-dibd.centralindia.cloudapp.azure.com/api"
}

export default config;