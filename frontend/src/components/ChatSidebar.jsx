import { useEffect, useState } from "react";
import axios from "axios";

function ChatSidebar() {

  const [chats, setChats] = useState([]);

  useEffect(() => {

    const fetchChats = async () => {
      const res = await axios.get("http://localhost:5000/api/chats");
      setChats(res.data);
    };

    fetchChats();

  }, []);

  return (
    <div className="sidebar">

      <h3>Previous Chats</h3>

      {chats.map((chat, index) => (
        <div key={index} className="chat-item">
          {chat.userMessage}
        </div>
      ))}

    </div>
  );
}

export default ChatSidebar;