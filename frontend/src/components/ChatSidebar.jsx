function ChatSidebar({ conversations }) {

  return (

    <div className="sidebar">

      <h3>Previous Chats</h3>

      {conversations.length === 0 && (
        <p>No chats yet</p>
      )}

      {conversations.map((conv) => (

        <div key={conv._id} className="chat-item">
          {conv.title}
        </div>

      ))}

    </div>

  );

}

export default ChatSidebar;