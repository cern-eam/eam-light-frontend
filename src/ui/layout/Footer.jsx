import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { isCernMode } from "@/ui/components/CERNMode";
import { version } from "../../../package.json";
import EAMFooter from "eam-components/dist/ui/components/footer/Footer";
import { releaseNotesPath } from "@/Eamlight";
import Chat from "@/ui/components/chat/Chat";

const Footer = (props) => {
  const { applicationData } = props;
  const [chatOpen, setChatOpen] = useState(false);

  const theme = useTheme();

  const style = {
    backgroundColor: theme.palette.primary.main,
    height: 30,
    color: "white",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    zIndex: 1250,
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
      <IconButton
        size="small"
        onClick={() => setChatOpen(true)}
        sx={{ color: "white", marginLeft: "5px", marginRight: "5px" }}
      >
        <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Chat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default Footer;
