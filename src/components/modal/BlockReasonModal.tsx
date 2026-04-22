import React, { useState } from "react";
import { X, ShieldOff, Loader2, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockReasonModalProps {
  open: boolean;
  driverName: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

// ─── Preset Reasons ───────────────────────────────────────────────────────────

const PRESET_REASONS = [
  "Violation of terms of service",
  "Multiple passenger complaints",
  "Fraudulent activity detected",
  "Reckless driving reported",
  "Fake documentation submitted",
  "Unresponsive / inactive account",
];

// ─── Component ────────────────────────────────────────────────────────────────

export const BlockReasonModal: React.FC<BlockReasonModalProps> = ({
  open,
  driverName,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = reason.trim().length >= 10;

  const handleClose = () => {
    if (isLoading) return;
    setReason("");
    setTouched(false);
    onClose();
  };

  const handleConfirm = () => {
    setTouched(true);
    if (!isValid) return;
    onConfirm(reason.trim());
  };

  const handlePreset = (preset: string) => {
    setReason(preset);
    setTouched(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white w-[90%] max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <ShieldOff size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Block Driver
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{driverName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* ── Warning Banner ───────────────────────────────────────────────── */}
        <div className="mx-6 mt-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle
            size={18}
            className="text-amber-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-amber-800 leading-relaxed">
            Blocking this driver will immediately suspend their access to the
            platform. Please provide a clear reason before proceeding.
          </p>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-6 space-y-5">
          {/* Preset Chips */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              Quick Reasons
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50 ${
                    reason === preset
                      ? "bg-[#053F53] text-white border-[#053F53] shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#053F53] hover:text-[#053F53]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Block Reason
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setTouched(false);
              }}
              onBlur={() => setTouched(true)}
              disabled={isLoading}
              rows={4}
              placeholder="Describe the reason for blocking this driver in detail…"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 resize-none transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-gray-50 ${
                touched && !isValid
                  ? "border-red-400 focus:ring-red-300/30 bg-red-50"
                  : "border-gray-300 focus:ring-[#053F53]/25 focus:border-[#053F53]"
              }`}
            />
            <div className="flex items-center justify-between mt-1.5">
              {touched && !isValid ? (
                <p className="text-xs text-red-500">
                  Please enter at least 10 characters.
                </p>
              ) : (
                <span />
              )}
              <p
                className={`text-xs ml-auto ${
                  reason.length < 10 ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {reason.length} chars
              </p>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || (touched && !isValid)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Blocking…
                </>
              ) : (
                <>
                  <ShieldOff size={16} />
                  Block Driver
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
