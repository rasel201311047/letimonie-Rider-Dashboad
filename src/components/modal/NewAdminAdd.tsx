import { X } from "lucide-react";

interface DiverDocumentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewAdminAdd({
  open,

  onClose,
}: DiverDocumentModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-4xl h-[70%] max-h-[800px] rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6 ">
          <div className="w-2 h-2"></div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Add New Admin
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div>
          <div className="mb-[3%]">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>

          <div className="mb-[3%]">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>
          <div className="mb-[3%]">
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>

          <div className="mb-[3%]">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>

          <div className="mb-[3%]">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
            />
          </div>
          <button className="w-full mt-[5%] bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-2.5 rounded-md text-sm font-medium hover:opacity-90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
