import * as React from "react";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import CircleIcon from "@mui/icons-material/Circle";
import { Switch, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

const switchIconStyle = {
  fill: "white",
  borderRadius: "50%",
  padding: "2.5px",
  fontSize: "1.5em",
};

const IconSwitch = styled(Switch)(({ theme }) => ({
  opacity: "70%",
  "& .MuiSwitch-switchBase": {
    position: "absolute",
    padding: "0",
    "&.Mui-checked": {
      transform: "translateX(1.25em)",
      "& .MuiSwitch-track": {
        backgroundColor: theme.palette.primary,
      },
    },
    "&.Mui-disabled": {
      opacity: "100%",
      transform: "translateX(-2.5px)",
    },
  },
  "& .MuiSwitch-track": {
    width: "3em",
    height: "1em",
    position: "relative",
    top: "1px",
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    "&.Mui-disabled": { opacity: "1%" },
  },
  "& .MuiSwitch-thumb": {
    position: "relative",
    top: "10px",
  },
}));

const Dependency = (props) => {
  const { value, valueKey, updateProperty, disabled, dependencyKeysMap } =
    props;

  const theme = useTheme();

  const isTrue = (value) => {
    const checkedTextValue = value || "";
    return checkedTextValue.toLowerCase() === true.toString();
  };

  const unsetRelatedDependencies = () => {
    const relatedDependencies = Object.values(dependencyKeysMap).filter(
      (depKey) => {
        return depKey !== valueKey;
      }
    );

    relatedDependencies.forEach((relatedDependency) => {
      updateProperty(relatedDependency, false.toString());
    });
  };

  const onChangeHandler = () => {
    // A 'value' of 'false' means the dependency will be set to 'true' afterwards
    if (dependencyKeysMap && value === "false") {
      unsetRelatedDependencies();
    }

    isTrue(value)
      ? updateProperty(valueKey, "false")
      : updateProperty(valueKey, "true");
  };

  return (
    <>
      <Tooltip title={isTrue(value) ? "Remove dependency" : "Add dependency"}>
        <IconSwitch
          style={{ height: "100%", margin: "1px 0.5em" }}
          disabled={disabled}
          onChange={onChangeHandler}
          checked={isTrue(value)}
          icon={
            disabled ? (
              <CircleIcon
                style={{ color: "#ddd", fontSize: "2.25em", margin: "0" }}
              />
            ) : (
              <LinkOffIcon
                style={{
                  ...switchIconStyle,
                  backgroundColor: "#737373",
                }}
              />
            )
          }
          checkedIcon={
            <LinkIcon
              style={{
                ...switchIconStyle,
                backgroundColor: `${theme.palette.primary.main}`,
              }}
            />
          }
        />
      </Tooltip>
    </>
  );
};

export default Dependency;
