class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowercase = message.toLowerCase();

    if (
      lowercase.includes("description of") ||
      lowercase.includes("describe") ||
      lowercase.includes("tell me about")
    ) {
      this.actionProvider.handleDescriptionQuery(lowercase);
    }

    else if (lowercase.includes("job")) {
      if (lowercase.includes("deadline")) {
        this.actionProvider.handleDeadlineQuery("Job");
      } else {
        this.actionProvider.handleListQuery("Job", lowercase);
      }
    }

    else if (lowercase.includes("hackathon")) {
      if (lowercase.includes("deadline")) {
        this.actionProvider.handleDeadlineQuery("Hackathon");
      } else {
        this.actionProvider.handleListQuery("Hackathon", lowercase);
      }
    }

    else if (
      lowercase.includes("internship") ||
      lowercase.includes("college event") ||
      lowercase.includes("college")
    ) {
      if (lowercase.includes("deadline")) {
        this.actionProvider.handleDeadlineQuery("College Event");
      } else {
        this.actionProvider.handleListQuery("College Event", lowercase);
      }
    }

    else {
      this.actionProvider.handleGeneralQuery(message);
    }
  }
}

export default MessageParser;
