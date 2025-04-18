// src/components/Chatbot.js
import React, { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const configScript = document.createElement("script");
    configScript.innerHTML = `
  window.chatbaseConfig = {
    chatbotId: "ASh0eRhuLgocIU5ngGy9D",
    customColors: {
      brandColor: "#8B4513",
      conversationColor: "#FFFFFF",
      textColor: "#000000"
    },
    button: {
      toggle: () => {
        const chatbotContainer = document.getElementById("chatbot-container");
        if (chatbotContainer.style.display === "block") {
          chatbotContainer.style.display = "none";
        }
        // Else, do nothing – prevents opening it from the Chatbase button
      }
    }
  };
`;

    document.body.appendChild(configScript);

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.setAttribute("chatbotId", "ASh0eRhuLgocIU5ngGy9D");
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="chatbot-container"
      style={{ display: "none" }}
      className="fixed bottom-16 right-4 z-50 w-[350px] h-[450px] shadow-xl rounded-xl overflow-hidden border border-gray-300 bg-white"
    >
      <button
        onClick={() => {
          const chatbotContainer = document.getElementById("chatbot-container");
          chatbotContainer.style.display = "none";
        }}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
      >
        X
      </button>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/ASh0eRhuLgocIU5ngGy9D"
        title="Chatbot"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default Chatbot;
