import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import useUserDataStore from "@/state/useUserDataStore";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const getUserContext = () => {
  const { userCode, emailAddress, userDesc } = useUserDataStore.getState().userData.eamAccount;
  return [{role: "user", content: `About me: user code=${userCode}, emailAddress=${emailAddress}, name=${userDesc}`}];
};

export const isSpeechSupported = () => !!SpeechRecognition;

export const createSpeechRecognition = (onResult, onEnd) => {
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    onResult(transcript);
  };

  recognition.onend = () => onEnd?.();
  recognition.onerror = () => onEnd?.();

  return recognition;
};

const MarkdownLink = ({ href, children }) => {
  if (href?.startsWith("/")) {
    return <Link to={href} className="chat-link">{children}</Link>;
  }
  return <a href={href} className="chat-link" target="_blank" rel="noopener noreferrer">{children}</a>;
};

export const renderMessageContent = (text) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
      {text}
    </ReactMarkdown>
  );
};

export const normalizeResponseMessage = (message) => {
  if (typeof message !== "string") return "";
  return message.replace(/\\n/g, "\n");
};

const buildSetFieldQuery = (toolCalls = []) => {
  return toolCalls
    .filter((tool) => tool?.name === "setField")
    .map((tool) => tool?.args)
    .filter((args) => typeof args?.field === "string" && args.field.trim())
    .map((args) => `${encodeURIComponent(args.field)}=${encodeURIComponent(args.value == null ? "" : String(args.value))}`)
    .join("&");
};

export const processToolCalls = (toolCalls = [], { history, updateEntityProperty } = {}) => {
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) return null;

  const navigateCall = toolCalls.find((tool) => tool?.name === "navigate");
  const setFieldTools = toolCalls.filter((tool) => tool?.name === "setField");
  if (!navigateCall && setFieldTools.length > 0) {
    setFieldTools.forEach((tool) => {
      updateEntityProperty(tool.args.field, tool.args.value);
    });
    return null;
  }

  if (!navigateCall) return null;

  const handlers = {
    navigate: (toolArgs) => {
      let link = toolArgs?.link;
      if (typeof link !== "string" || !link.trim() || !history) return null;

      const query = buildSetFieldQuery(toolCalls);
      if (query) link = `${link}${link.includes("?") ? "&" : "?"}${query}`;

      history.push(link);
      return { type: "navigate", link };
    },
  };

  const { name, args } = navigateCall;
  const handler = handlers[name];
  if (!handler) return null;

  return handler(args);
};
