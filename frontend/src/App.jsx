import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatSidebar from "./components/ChatSidebar";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  const chatEndRef = useRef(null);

  // fetch conversations for sidebar
  const fetchConversations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/conversations");
      setConversations(res.data);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  // load conversations when app starts
  useEffect(() => {
    fetchConversations();
  }, []);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const startNewConversation = () => {
    setConversationId(null);
    setChat([]);
  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userText = message;

    setMessage("");

    // show user message immediately
    setChat(prev => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    setLoading(true);

    try {

      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userText,
        conversationId: conversationId
      });

      const botReply = res.data.reply;

      // if first message → create conversation
      if (!conversationId) {

        const newConversationId = res.data.conversationId;

        setConversationId(newConversationId);

        // add new conversation instantly to sidebar
        setConversations(prev => [
          {
            _id: newConversationId,
            title: userText.slice(0, 40)
          },
          ...prev
        ]);
      }

      // add bot response
      setChat(prev => [
        ...prev,
        { sender: "bot", text: botReply }
      ]);

    } catch (error) {

      console.error("API Error:", error);

      setChat(prev => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." }
      ]);

    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (

    <div className="app-layout">

      <ChatSidebar conversations={conversations} />

      <div className="container">

        <h2 className="title">AI Support Bot</h2>

        <button className="new-chat-btn" onClick={startNewConversation}>
          + New Chat
        </button>

        <div className="chat-box">

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="message bot">Bot is typing...</div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        <div className="input-area">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question..."
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;