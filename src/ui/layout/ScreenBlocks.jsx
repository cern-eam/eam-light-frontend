import React from "react";
import ScreenContainers from "./ScreenContainers";

const ScreenBlocks = ({ register, screenLayout, layoutPropertiesMap = {}, ctx = {}, blocks = [], blockContainers, footer }) => {

  const visibleBlocks = blocks.filter(block => 
    screenLayout.fields[block]?.attribute !== "H" && blockContainers[block]?.length > 0
  );

  if (visibleBlocks.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      {visibleBlocks.map(block => (
        <ScreenContainers
          key={block}
          register={register}
          screenLayout={screenLayout}
          layoutPropertiesMap={layoutPropertiesMap}
          ctx={ctx}
          containers={blockContainers[block]}
        />
      ))}
      {footer}
    </React.Fragment>
  );
};

export default ScreenBlocks;