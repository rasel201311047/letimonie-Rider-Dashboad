import { useState } from "react";

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}

interface NotificationModalProps {
  opennotification: boolean;
  onCloseotification: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function NotificationModal({
  opennotification,
  onCloseotification,
}: NotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  if (!opennotification) return null;
  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* ── Panel ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          style={{
            pointerEvents: "auto",
            animation: "slideUp 0.25s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#053F53] to-[#047094]">
                <BellIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-gray-900">
                  Send Notification
                </h2>
                <p className="text-xs text-gray-400">
                  Push a message to your users
                </p>
              </div>
            </div>
            <button
              onClick={onCloseotification}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* ── Title ── */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                Notification Title
              </label>
              <input
                type="text"
                placeholder="Enter notification title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-[#047094] focus:outline-none focus:ring-2 focus:ring-[#047094]/20"
              />
              <p className="mt-1 text-right text-[11px] text-gray-300">
                {title.length}/80
              </p>
            </div>

            {/* ── Message ── */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                Message Content
              </label>
              <textarea
                rows={4}
                placeholder="Write your notification message here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-[#047094] focus:outline-none focus:ring-2 focus:ring-[#047094]/20"
              />
              <p className="mt-1 text-right text-[11px] text-gray-300">
                {message.length}/500
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center ">
            <button
              type="button"
              //   onClick={handleSubmit}
              //   disabled={isSubmitDisabled}
              className={` w-[80%] mb-4   rounded-xl bg-gradient-to-r py-2 from-[#053F53] to-[#047094]  text-sm font-medium text-white transition  }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>
  );
}
