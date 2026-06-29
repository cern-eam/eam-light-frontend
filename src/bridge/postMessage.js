const DEFAULT_TARGET_ORIGIN = "*";

const postMessageToParent = (message, targetOrigin = DEFAULT_TARGET_ORIGIN) => {
  if (window.parent === window) {
    return;
  }

  const payload =
    typeof message === "string" ? message : JSON.stringify(message);
  window.parent.postMessage(payload, targetOrigin);
};

export const postMessage = (message, targetOrigin = DEFAULT_TARGET_ORIGIN) => {
  postMessageToParent(message, targetOrigin);
};

export const postException = (text, targetOrigin = DEFAULT_TARGET_ORIGIN) => {
  postMessageToParent({ type: "exception", text }, targetOrigin);
};
