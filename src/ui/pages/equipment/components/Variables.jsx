import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";

const Variables = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMTextField {...register("variable1")} />
      <EAMTextField {...register("variable2")} />
      <EAMTextField {...register("variable3")} />
      <EAMTextField {...register("variable4")} />
      <EAMTextField {...register("variable5")} />
      <EAMTextField {...register("variable6")} />
    </React.Fragment>
  );
};

export default Variables;
