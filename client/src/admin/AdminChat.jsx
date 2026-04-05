import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { fetchConversations(); const i = setInterval(fetchConversations, 5000); return () => clearInterval(i); }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("/api/chat/admin/conversations");
      setConversations(res.data);
    } catch {}
  };

  const selectConvo = async (convo) => {
    setSelected(convo._id);
    try {
      const res = await axios.get(`/api/chat/${encodeURIComponent(convo._id)}`);
      setMessages(res.data);
      await axios.put(`/api/chat/read/${encodeURIComponent(convo._id)}/admin`);
      fetchConversations();
    } catch {}
  };

  useEffect(() => {
    if (!selected) return;
    const i = setInterval(async () => {
      try {
        const res = await axios.get(`/api/chat/${encodeURIComponent(selected)}`);
        setMessages(res.data);
      } catch {}
    }, 3000);
    return () => clearInterval(i);
  }, [selected]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || !selected) return;
    try {
      await axios.post("/api/chat", { conversationId: selected, sender: "admin", senderEmail: "admin", message: input.trim() });
      setInput("");
      const res = await axios.get(`/api/chat/${encodeURIComponent(selected)}`);
      setMessages(res.data);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-black text-white pt-6 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif">Customer Chats</h1>
        <button onClick={() => navigate("/admin")} className="bg-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-600">← Dashboard</button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-140px)]">
        {/* Conversations List */}
        <div className="w-72 flex-shrink-0 bg-gray-900 rounded-xl overflow-y-auto">
          {conversations.length === 0 && <p className="text-gray-500 text-center py-10 text-sm">No chats yet</p>}
          {conversations.map(convo => (
            <button
              key={convo._id}
              onClick={() => selectConvo(convo)}
              className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800 transition ${selected === convo._id ? "bg-gray-800" : ""}`}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium truncate">{convo.senderEmail || convo._id}</p>
                {convo.unreadCount > 0 && (
                  <span className="bg-amber-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{convo.unreadCount}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">{convo.lastMessage}</p>
              <p className="text-[10px] text-gray-600 mt-1">{new Date(convo.lastTime).toLocaleString()}</p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gray-900 rounded-xl flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${msg.sender === "admin" ? "bg-amber-500 text-black rounded-br-sm" : "bg-gray-800 text-white rounded-bl-sm"}`}>
                      {msg.message}
                      <div className={`text-[10px] mt-1 ${msg.sender === "admin" ? "text-black/40" : "text-gray-500"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-gray-800 p-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Reply..."
                  className="flex-1 bg-black text-white px-4 py-2 rounded-xl text-sm focus:outline-none"
                  maxLength={500}
                />
                <button onClick={send} className="bg-amber-500 text-black px-4 py-2 rounded-xl font-semibold hover:bg-amber-400">Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
