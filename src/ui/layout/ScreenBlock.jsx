import React from "react";
import ScreenContainers from "./ScreenContainers";


export const getScreenBlockRegionFlags = (block, screenLayout) => {
  const attribute = screenLayout?.fields?.[block.code]?.attribute;
  return {
    ignore: attribute === "H",
    //initialVisibility: attribute === "O",
    RegionPanelProps: {
      initiallyExpanded: attribute !== "C",
    }
  };
};  

const ScreenBlock = ({ register, screenLayout, layoutPropertiesMap = {}, ctx = {}, blocks, footer }) => {
  const blockList = Array.isArray(blocks) ? blocks : [blocks];
  
  const visibleBlocks = blockList.filter(
    (block) => screenLayout.fields[block.code]?.attribute !== "H"
  );

  if (visibleBlocks.length === 0) {
    return footer ?? null;
  }

  return (
    <React.Fragment>
      {visibleBlocks.map((block) => (
        <ScreenContainers
          key={block.code}
          register={register}
          screenLayout={screenLayout}
          layoutPropertiesMap={layoutPropertiesMap}
          ctx={ctx}
          containers={block?.containers}
        />
      ))}
      {footer}
    </React.Fragment>
  );
};

export default ScreenBlock;