import React, { useEffect } from "react";

interface ChatbotProps {
  // Any props the chatbot might need
}

const Chatbot: React.FC<ChatbotProps> = () => {
  useEffect(() => {
    // Load Botpress webchat scripts
    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    injectScript.async = true;
    document.body.appendChild(injectScript);

    const botpressScript = document.createElement("script");
    botpressScript.src =
      "https://files.bpcontent.cloud/2025/04/02/13/20250402130450-XLZQ0XHH.js";
    botpressScript.async = true;
    document.body.appendChild(botpressScript);

    // Clean up on component unmount
    return () => {
      document.body.removeChild(injectScript);
      if (document.body.contains(botpressScript)) {
        document.body.removeChild(botpressScript);
      }
    };
  }, []);

  return null; // The chatbot is injected directly into the body
};

export default Chatbot;
