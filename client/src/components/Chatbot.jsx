import React, { useEffect, useState } from "react";
import { FaHeadset, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-slow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    const configScript = document.createElement("script");
    configScript.innerHTML = `
  window.chatbaseConfig = {
    chatbotId: "ASh0eRhuLgocIU5ngGy9D",
    customColors: {
      brandColor: "#8B4513",
      conversationColor: "#FFFFFF",
      textColor: "#000000"
    },
    buttonStyle: {
      display: "none",
      visibility: "hidden"
    }
  };
`;

    document.body.appendChild(configScript);

    // Add more comprehensive style rules to hide the default button
    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
      .chatbase-bubble, 
      #chatbase-bubble-button,
      .chatbase-bubble-button,
      [id*="chatbase-bubble"] { 
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(buttonStyle);

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.setAttribute("chatbotId", "ASh0eRhuLgocIU5ngGy9D");
    document.body.appendChild(script);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] bg-gradient-to-br from-[#FF8C00] to-[#FF4500] text-white p-4 rounded-full hover:from-[#FF4500] hover:to-[#FF8C00] shadow-lg transition-all duration-500 ease-in-out text-2xl flex items-center justify-center w-14 h-14 md:w-16 md:h-16 hover:scale-110 hover:shadow-xl hover:shadow-orange-200/50 animate-pulse-slow"
      >
        {isOpen ? <FaTimes /> : <FaHeadset />}
      </button>

      <div
        id="chatbot-container"
        style={{ display: isOpen ? "block" : "none" }}
        className="fixed bottom-20 right-2 md:right-4 z-[9998] w-[calc(100%-1rem)] md:w-[420px] h-[80vh] md:h-[600px] max-h-[600px] shadow-2xl rounded-xl overflow-hidden border border-gray-300 bg-white transition-all duration-300 ease-in-out mx-2 md:mx-0"
      >
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/ASh0eRhuLgocIU5ngGy9D"
          title="Chatbot"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </>
  );
};

export default Chatbot;
