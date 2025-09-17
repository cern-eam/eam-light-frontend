import * as React from "react";
import {
  AssetIcon,
  PartIcon,
  PositionIcon,
  SystemIcon,
} from "eam-components/dist/ui/components/icons";
import LocationIcon from "@mui/icons-material/Room";
import LotIcon from "../LotIcon";

export const EAMIcon = ({ eqtype, style, classes }) => (
  <div>
    {eqtype === "A" && <AssetIcon style={style} classes={classes} />}
    {eqtype === "S" && <SystemIcon style={style} classes={classes} />}
    {eqtype === "P" && <PositionIcon style={style} classes={classes} />}
    {eqtype === "L" && <LocationIcon style={style} classes={classes} />}
    {eqtype === "PART" && <PartIcon style={style} classes={classes} />}
    {eqtype === "LOT" && <LotIcon style={style} classes={classes} />}

  </div>
);

export default EAMIcon;
