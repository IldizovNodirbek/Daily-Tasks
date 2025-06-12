import React, { useEffect, useState } from "react";
 import { MdOutlineCancel } from "react-icons/md";

const NotificationBox = ({ message, type = "info", onClose }) => {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!isVisible || !message) return null;

  const typeStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm p-4 border-l-4 rounded-md shadow-md ${typeStyles[type]} transition-opacity duration-300`}
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="ml-4 text-sm font-semibold"
        >
          <MdOutlineCancel className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
