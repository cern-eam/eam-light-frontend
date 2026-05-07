import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";

const functionToEAMLightPageMapping = {
  OSOBJA: "/asset",
  OSOBJN: "/ncr",
  OSOBJS: "/system",
  OSOBJP: "/position",
  OSOBJL: "/location",
};

const ParentMessageBridge = () => {
  const history = useHistory();

  const handleMessage = useCallback((event) => {
    // console.log("ParentMessageBridge received postMessage:", {
    //   origin: event.origin,
    //   data: event.data,
    // });

    let data = event.data;

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (_error) {
        return;
      }
    }

    if (!data) return;

    if (data.messageName === "directSelect") {
      const basePath = functionToEAMLightPageMapping[data.systemFunction];
      const equipmentNo = data.drillbackParams?.equipmentno;

      if (basePath && equipmentNo) {
        history.push(`${basePath}/${equipmentNo}`);
      }
      return;
    }

    const toolCalls = data?.toolCalls || [];
    toolCalls.forEach((toolCall) => {
      if (toolCall?.name === "navigate") {
        history.push(toolCall.args.link);
      }
    });
  }, [history]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return null;
};

export default ParentMessageBridge;
