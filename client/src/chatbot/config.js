import { createChatBotMessage } from "react-chatbot-kit";


const config = {
  botName: "NovaBot",
  initialMessages: [
    createChatBotMessage("Hey! I'm NovaBot 👋 Ask me about jobs, internships, or hackathons.")
  ],
  customComponents: {},
  state: {},
  customStyles: {
    botMessageBox: { backgroundColor: "#0b5ed7" },
    chatButton: { backgroundColor: "#0b5ed7" },
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#1e90ff",
    },
    chatButton: {
      backgroundColor: "#1e90ff",
    },
    userMessageBox: {
      backgroundColor: "#2563eb",
    },
  },
};

export default config;
