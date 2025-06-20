import eventData from "./eventData";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  addBotMessage = (text) => {
    const message = this.createChatBotMessage(text);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleListQuery = (type, message) => {
    let filtered = eventData.filter(e => e.type.toLowerCase() === type.toLowerCase());
    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const limitMatch = message.match(/top\s?(\d+)/);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 3;

    if (filtered.length === 0) {
      this.addBotMessage(`No ${type.toLowerCase()}s found.`);
      return;
    }

    const response = filtered
      .slice(0, limit)
      .map((e, i) => `${i + 1}. ${e.title} (Deadline: ${e.deadline})`)
      .join("\n");

    this.addBotMessage(`Here are the upcoming ${type.toLowerCase()}s:\n${response}`);
  };

  handleDeadlineQuery = (type) => {
    const filtered = eventData
      .filter(e => e.type.toLowerCase() === type.toLowerCase())
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (filtered.length === 0) {
      this.addBotMessage(`No ${type.toLowerCase()}s with deadlines found.`);
      return;
    }

    const response = filtered
      .slice(0, 3)
      .map(e => `${e.title}: ${e.deadline}`)
      .join("\n");

    this.addBotMessage(`Deadlines for upcoming ${type.toLowerCase()}s:\n${response}`);
  };

  handleDescriptionQuery = (message) => {
    const event = eventData.find(event =>
      message.includes(event.title.toLowerCase())
    );

    if (event) {
      this.addBotMessage(
        `${event.title} (${event.type})\nDeadline: ${event.deadline}\nDescription: ${event.description}`
      );
    } else {
      this.addBotMessage("Sorry, I couldn't find that event. Please check the name.");
    }
  };

  handleGeneralQuery = (message) => {
    this.addBotMessage("Try asking things like:\n- What are the upcoming hackathons?\n- Description of HackWithInfy?\n- What are the deadlines for internships?");
  };
}

export default ActionProvider;
