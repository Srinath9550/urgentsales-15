import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onOtpSubmit: (otp: string) => void;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  onOtpSubmit,
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    let newOtp = [...otp];

    if (value.length > 1) {
      // If pasting multiple digits
      const digits = value.split("").slice(0, length - index);

      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });

      // Move focus to the next empty input or the last input
      const nextIndex = Math.min(index + digits.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    } else {
      // Single digit input
      newOtp[index] = value;

      // Auto-focus next input
      if (value && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    setOtp(newOtp);
    
    // Check if OTP is complete with the new values
    const isComplete = newOtp.every(digit => digit !== "");
    if (isComplete) {
      const completeOtp = newOtp.join("");
      console.log("OTP complete:", completeOtp);
      onOtpSubmit(completeOtp);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1]?.focus();
      }

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }

    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow key
    if (
      e.key === "ArrowRight" &&
      index < length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) return; // Only allow digits

    const digits = pastedData.split("").slice(0, length - index);

    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (index + i < length) {
        newOtp[index + i] = digit;
      }
    });

    setOtp(newOtp);

    // Move focus to the next empty input or the last input
    const nextIndex = Math.min(index + digits.length, length - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex]?.focus();
    }

    // Check if OTP is complete after paste
    const isComplete = newOtp.every(digit => digit !== "");
    if (isComplete) {
      console.log("OTP complete (after paste):", newOtp.join(""));
      onOtpSubmit(newOtp.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-xl font-semibold rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all",
            disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        />
      ))}
    </div>
  );
}
