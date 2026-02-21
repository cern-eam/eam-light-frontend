import React, { useState, useRef, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { useTheme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import "./Chat.css";
import useUserDataStore from "@/state/useUserDataStore";
import { getUserContext, renderMessageContent, extractAutoNavLink, isSpeechSupported, createSpeechRecognition } from "./tools";

const Chat = ({ open, onClose }) => {
  const theme = useTheme();
  const history = useHistory();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const { userData } = useUserDataStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant") {
      const autoLink = extractAutoNavLink(lastMsg.content);
      if (autoLink) history.push(autoLink);
    }
  }, [messages]);

  useEffect(() => {
    if (open && !threadId) {
      setThreadId(crypto.randomUUID());
    }
  }, [open]);

  const extractHumanMessage = (data) => {
    const response = data.messages[data.messages.length - 1].kwargs.content;
    return response;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: { messages: [
            ...(messages.length === 0 ? getUserContext() : []),
            { role: "user", content: text }
          ] },
          config: { configurable: { thread_id: threadId, user: userData.eamAccount.userCode } }
      }),
      });
      const data = await res.json();
      console.log('chat response', data);
      const response = extractHumanMessage(data);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = createSpeechRecognition(
      (transcript) => setInput(transcript),
      () => setListening(false)
    );
    if (!recognition) return;
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) return null;

  return (
    <div className="chat-panel">
      <div className="chat-header" style={{ backgroundColor: theme.palette.primary.main }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SmartToyOutlinedIcon fontSize="small" />
          EAM Light Assistant
        </span>
        <div>
          <IconButton size="small" onClick={() => { setMessages([]); setThreadId(crypto.randomUUID()); }} sx={{ color: "white" }} disabled={messages.length === 0 || loading}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">How can I help you today?</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble chat-bubble-${msg.role}`}
            style={msg.role === "user" ? { backgroundColor: theme.palette.primary.main } : undefined}
          >
            {msg.role === "assistant" ? renderMessageContent(msg.content) : msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble-assistant">
            <CircularProgress size={16} thickness={5} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          className="chat-input"
          autoFocus
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        {isSpeechSupported() && (
          <IconButton
            onClick={toggleListening}
            disabled={loading}
            color={listening ? "error" : "default"}
            size="small"
          >
            {listening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        )}
        <IconButton
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          color="primary"
          size="small"
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;
