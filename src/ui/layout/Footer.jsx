import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { isCernMode } from "@/ui/components/CERNMode";
import { version } from "../../../package.json";
import EAMFooter from "eam-components/dist/ui/components/footer/Footer";
import { releaseNotesPath } from "@/Eamlight";

const Footer = (props) => {
  const { applicationData } = props;

  const theme = useTheme();

  const style = {
    backgroundColor: theme.palette.primary.main,
    height: 30,
    color: "white",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    zIndex: 1250, // snackbar has 1400
  };

  return (
    <div style={style}>
      <EAMFooter
        appName={
          "EAM Light " +
          (applicationData.EL_ENVIR !== "PROD" ? applicationData.EL_ENVIR : "")
        }
        version={version}
        supportEmail={isCernMode && "eam.support@cern.ch"}
        releaseNotesPath={releaseNotesPath}
      />
    </div>
  );
};

export default Footer;
