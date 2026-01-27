import React from "react";
import ScreenContainers from "./ScreenContainers";

const ScreenBlock = ({ register, screenLayout, layoutPropertiesMap = {}, ctx = {}, block, footer }) => {

  if (screenLayout.fields[block.code]?.attribute === "H") {
    return null;
  }

  return (
    <React.Fragment>
        <ScreenContainers
          key={block}
          register={register}
          screenLayout={screenLayout}
          layoutPropertiesMap={layoutPropertiesMap}
          ctx={ctx}
          containers={block.containers}
        />
      {footer}
    </React.Fragment>
  );
};

export default ScreenBlock;