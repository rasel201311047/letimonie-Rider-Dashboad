import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function NotificationPage() {
  const [audience, setAudience] = useState("All");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ audience, title, message });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Create New Notification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
            >
              <option>All</option>
              <option>Rider</option>
              <option>Driver</option>
            </select>
          </div>

          {/* Notification Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              placeholder="Enter notification title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              rows={6}
              placeholder="Write your notification message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#053F53] to-[#0470949f] py-3 text-sm font-medium text-white hover:opacity-90 transition"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
}
