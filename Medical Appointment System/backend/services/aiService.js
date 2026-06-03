import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a medical AI assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return "AI error";
  }
};