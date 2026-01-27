import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OTPPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input if value entered
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (/^\d$/.test(pasteData[i])) {
        newOtp[i] = pasteData[i];
      }
    }
    setOtp(newOtp);
    // Focus the next empty input
    const nextEmpty = newOtp.findIndex((d) => d === "");
    if (nextEmpty !== -1) {
      inputsRef.current[nextEmpty]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("OTP submitted:", otpCode);

    navigate("/ChangePasswordPage");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a 6-digit code to your registered email/phone
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center rounded-xl border border-gray-300 text-lg font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0f1d33] py-3 font-semibold text-white shadow-md transition-all hover:bg-[#0b1527] active:scale-[0.98]"
          >
            Verify OTP
          </button>

          <p className="text-center text-sm text-gray-500">
            Didn't receive code?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
