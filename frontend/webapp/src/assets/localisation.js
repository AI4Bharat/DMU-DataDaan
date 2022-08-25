const localization_EN_Data = {
    "label.dmuDataDaan": "DMU Datadaan",
    "label.dmuDataDaanInfo":
    "Bhashini DataDaan is a platform which enables any government entities or PSUs to submit any kind of media files (audio, videos, text, pdf, etc).",
    "label.logOut": "Logout"
  };
  
  export function translate(locale_text) {
    return localization_EN_Data[locale_text]
      ? localization_EN_Data[locale_text]
      : "";
  }
  