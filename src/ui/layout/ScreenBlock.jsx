import React from "react";
import ScreenContainers from "./ScreenContainers";

const ScreenBlock = ({ register, screenLayout, layoutPropertiesMap = {}, ctx = {}, blocks, footer }) => {
  const blockList = Array.isArray(blocks) ? blocks : [blocks];
  
  const visibleBlocks = blockList.filter(
    (b) => screenLayout.fields[b.code]?.attribute !== "H"
  );

  if (visibleBlocks.length === 0) {
    return footer ?? null;
  }

  return (
    <React.Fragment>
      {visibleBlocks.map((b) => (
        <ScreenContainers
          key={b.code}
          register={register}
          screenLayout={screenLayout}
          layoutPropertiesMap={layoutPropertiesMap}
          ctx={ctx}
          containers={b.containers}
        />
      ))}
      {footer}
    </React.Fragment>
  );
};

export default ScreenBlock;