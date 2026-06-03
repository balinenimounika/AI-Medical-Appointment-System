const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ================= ANALYZE SYMPTOMS =================

const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        message: 'Symptoms are required',
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content:
            'You are a professional medical AI assistant.',
        },
        {
          role: 'user',
          content: `
            Analyze these symptoms:
            ${symptoms}

            Give:
            - possible diseases
            - recommended doctor
            - precautions
          `,
        },
      ],

      temperature: 0.7,
    });

    const response =
      completion.choices[0].message.content;

    res.json({
      success: true,
      analysis: response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= AI CHAT =================

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: 'Message is required',
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'system',
          content:
            'You are a helpful medical AI assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],

      temperature: 0.7,
    });

    const aiResponse =
      completion.choices[0].message.content;

    res.json({
      success: true,
      response: aiResponse,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= CHAT HISTORY =================

const getChatHistory = async (req, res) => {
  res.json({
    message: 'Chat history feature coming soon',
  });
};

// ================= GET SESSION =================

const getChatSession = async (req, res) => {
  res.json({
    message: 'Chat session feature coming soon',
  });
};

// ================= DELETE SESSION =================

const deleteChatSession = async (req, res) => {
  res.json({
    message: 'Delete session feature coming soon',
  });
};

module.exports = {
  analyzeSymptoms,
  sendMessage,
  getChatHistory,
  getChatSession,
  deleteChatSession,
};