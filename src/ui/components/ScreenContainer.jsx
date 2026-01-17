import React from "react";
import EAMInput from "./EAMInput";

const ScreenContainer = ({ register, screenLayout, layoutPropertiesMap = {}, ctx = {}, containers = [], footer }) => {

  const fields = screenLayout?.fields || {};

  const containerIndex = (c) => containers.length ? containers.indexOf(c) : 0;

    // TODO: if all blocks are hidden, return null

  return (
    <React.Fragment>
      {Object.values(fields)
        .filter(
          (field) =>
            field && field.elementType === "F" && field.attribute !== "H" && field.xpath &&
            (containers.length === 0 || containers.includes(field.fieldContainer))
        )
        .sort((field1, field2) => {
          const cDiff = containerIndex(field1.fieldContainer) - containerIndex(field2.fieldContainer);
          if (cDiff !== 0) return cDiff;

          return (field1.fieldGroup ?? Infinity) - (field2.fieldGroup ?? Infinity);
        })
        .map((field) => {
            const extraProps = typeof layoutPropertiesMap[field.elementId]?.extraProps === "function"
                ? layoutPropertiesMap[field.elementId].extraProps(ctx)
                : layoutPropertiesMap[field.elementId]?.extraProps ?? {};

           return <EAMInput {...register(field.elementId)} {...extraProps}/>
        })}

        {footer}
    </React.Fragment>
  );
};

export default ScreenContainer;