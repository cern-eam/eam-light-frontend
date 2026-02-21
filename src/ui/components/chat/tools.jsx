import React from "react";
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

export const extractAutoNavLink = (text) => {
  const match = text.match(/AUTO\[[^\]]+\]\(([^)]+)\)/);
  return match ? match[1] : null;
};

export const renderMessageContent = (text) => {
  const cleaned = text.replace(/AUTO(\[[^\]]+\]\([^)]+\))/g, "$1");
  const parts = cleaned.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return <Link key={i} to={match[2]} className="chat-link">{match[1]}</Link>;
    }
    return part;
  });
};
