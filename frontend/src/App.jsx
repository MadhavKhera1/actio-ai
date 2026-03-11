import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userText = message;

    setMessage("");

    setChat(prev => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    setLoading(true);

    try {

      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userText
      });

      const botReply = res.data.reply;

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

  // Send message when pressing Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="container">

      <h2 className="title">AI Support Bot</h2>

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
          <div className="message bot">
            Bot is typing...
          </div>
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
  );
}

export default App;