import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ------------------ Types ------------------ */
type Message = {
  from: "admin" | "user";
  type: "text" | "image" | "file";
  text?: string;
  url?: string;
  fileName?: string;
};

/* ------------------ Dummy Users ------------------ */
const users = [
  {
    id: 1,
    name: "Cameron Williamson",
    last: "Hey, How are you?",
    avatar: "https://i.ibb.co/s9k6bVKm/user-4.png",
    time: "2 min",
  },
  {
    id: 2,
    name: "Esther Howard",
    last: "Thanks for reply",
    avatar: "https://i.ibb.co/27NB7NcJ/user-12.png",
    time: "7:30 PM",
  },
  {
    id: 3,
    name: "Jane Cooper",
    last: "What's up?",
    avatar: "https://i.ibb.co/CsHtrdcN/user-8.png",
    time: "1:10 PM",
  },
];

const adminAvatar = "https://i.ibb.co/672c7YGb/user-9.png";

/* ------------------ Component ------------------ */
export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      from: "user",
      type: "text",
      text: "Hey, I'm looking to redesign my website.",
    },
    {
      from: "admin",
      type: "text",
      text: "Absolutely! I'd be happy to assist you.",
    },
    {
      from: "admin",
      type: "text",
      text: "What kind of design aesthetic are you aiming for?",
    },
    {
      from: "user",
      type: "text",
      text: "A clean and modern look focused on user experience.",
    },
  ]);

  /* ------------------ Auto Scroll ------------------ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ Send Text ------------------ */
  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "admin", type: "text", text: message },
    ]);
    setMessage("");
  };

  /* ------------------ Send Image / File ------------------ */
  const handleFileSend = (file: File) => {
    const url = URL.createObjectURL(file);

    setMessages((prev) => [
      ...prev,
      {
        from: "admin",
        type: file.type.startsWith("image") ? "image" : "file",
        url,
        fileName: file.name,
      },
    ]);
  };

  return (
    <div className="w-full h-[92vh] flex items-center justify-center bg-gray-100">
      <div className="flex w-[75vw] h-[75vh] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* ================= Sidebar ================= */}
        <aside className="w-1/4 border-r border-gray-100 bg-white">
          <div className="p-4">
            <input
              placeholder="Search here..."
              className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>

          <div className="px-4 text-xs font-semibold text-gray-400 mb-2">
            RECENT CHATS
          </div>

          <div className="overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                  selectedUser.id === user.id
                    ? "bg-indigo-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <img
                  src={user.avatar}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.last}</p>
                </div>
                <span className="text-xs text-gray-400">{user.time}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ================= Chat Area ================= */}
        <section className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-white shadow-md shadow-gray-100">
            <img
              src={selectedUser.avatar}
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <div>
              <p className="font-semibold text-gray-800">{selectedUser.name}</p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.from === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.from === "user" && (
                  <img
                    src={selectedUser.avatar}
                    className="w-8 h-8 rounded-full"
                    alt=""
                  />
                )}

                <div
                  className={`max-w-md px-4 py-3 text-sm rounded-2xl ${
                    msg.from === "admin"
                      ? "bg-[#053F53] text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow rounded-bl-none"
                  }`}
                >
                  {msg.type === "text" && msg.text}

                  {msg.type === "image" && (
                    <img
                      src={msg.url}
                      alt="sent"
                      className="max-w-[220px] rounded-lg"
                    />
                  )}

                  {msg.type === "file" && (
                    <a
                      href={msg.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 underline"
                    >
                      📄 {msg.fileName}
                    </a>
                  )}
                </div>

                {msg.from === "admin" && (
                  <img
                    src={adminAvatar}
                    className="w-8 h-8 rounded-full"
                    alt=""
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 bg-white flex items-center gap-3 shadow-3xl">
            {/* Attachment */}
            <label className="cursor-pointer text-xl text-gray-500 hover:text-gray-700">
              <Paperclip color="#053F53" size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSend(e.target.files[0]);
                  }
                }}
              />
            </label>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type Message here..."
              className="flex-1 px-4 py-2 text-sm rounded-lg  focus:outline-none bg-[#F3F4F6]"
            />

            <button
              onClick={sendMessage}
              className="bg-[#053F53] text-sm text-white p-2 rounded-full hover:opacity-90 transition"
            >
              <Send size={20} color="#fff" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
