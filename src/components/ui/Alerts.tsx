import { useEffect, useState } from "react";
import { DangerCircle } from '@solar-icons/react';

interface AlertProps {
  type: 'error' | 'warning';
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Alert({
  type,
  title,
  description,
  isVisible,
  onClose,
  duration = 2500
}: AlertProps) {

  const [isMounted, setIsMounted] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      const timerIn = setTimeout(() => {
        setIsFadingIn(true);
      }, 50);
      return () => clearTimeout(timerIn);
    } else {
      setIsFadingIn(false);
      const timerOut = setTimeout(() => {
        setIsMounted(false);
      }, 500);
      return () => clearTimeout(timerOut);
    }
  }, [isVisible]);

  useEffect(() => {
    let autoCloseTimer: NodeJS.Timeout;
    if (isVisible && duration > 0) {
      autoCloseTimer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => clearTimeout(autoCloseTimer);
  }, [isVisible, duration, onClose]);

  if (!isMounted) return null;

  const styles = {
    error: {
      border: 'border-uaq-danger',
      text: 'text-uaq-danger',
      icon: <DangerCircle className="h-6 w-6 text-uaq-danger mr-4" />,
    },
    warning: {
      border: 'border-uaq-warning',
      text: 'text-uaq-warning',
      icon: <DangerCircle className="h-6 w-6 text-uaq-warning mr-4" />,
    },
  };

  const { border, text, icon } = styles[type];

  const animationClasses = isFadingIn
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-8";

  return (
    <div
      className={`fixed bottom-10 left-0 right-0 z-50 flex justify-center px-4
        transition-all duration-500 ease-in-out transform ${animationClasses}`}
    >
      <div className={`m-5 p-4 ${border} border-2 rounded-xl flex items-center bg-zinc-50 max-w-xl shadow-lg`}>
        {icon}
        <div className="flex flex-col gap-3 items-start">
          <span className={`font-bold text-left ${text}`}>{title}</span>
          <p className={`text-left ${text}`}>{description}</p>
        </div>
      </div>
    </div>
  );
}