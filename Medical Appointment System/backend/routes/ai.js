const express = require('express');
const router = express.Router();
const axios = require('axios');
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const ChatHistory = require('../models/ChatHistory');
const { protect } = require('../middleware/auth');

// @route   POST /api/ai/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ user: req.user.id });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        user: req.user.id,
        messages: [],
        context: context || ''
      });
    }
    console.log("GROQ KEY:", process.env.GROQ_API_KEY);
    // Add user message to history
    chatHistory.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    // Call AI API (Gemini, OpenAI, or Groq)
    let aiResponse;
    
    if (process.env.GEMINI_API_KEY) {
      aiResponse = await callGeminiAPI(message, chatHistory.messages);
    } else if (process.env.OPENAI_API_KEY) {
      aiResponse = await callOpenAIAPI(message, chatHistory.messages);
    } else if (process.env.GROQ_API_KEY) {
      aiResponse = await callGroqAPI(message, chatHistory.messages);
    } else {
      // Fallback response
      aiResponse = "I'm sorry, but the AI service is not configured. Please contact the administrator.";
    }
    
    // Add AI response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });
    
    await chatHistory.save();
    
    res.status(200).json({
      success: true,
      response: aiResponse,
      history: chatHistory.messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/ai/symptom-checker
// @desc    AI symptom checker
// @access  Private
router.post('/symptom-checker', protect, async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    const prompt = `Based on the following symptoms: ${symptoms.join(', ')}, provide:
1. Possible conditions
2. Recommended medical specialization
3. Urgency level
4. General health recommendations

Note: This is not a medical diagnosis. Please consult a doctor for proper diagnosis.`;
    
    let aiResponse;
    
    if (process.env.GEMINI_API_KEY) {
      aiResponse = await callGeminiAPI(prompt, []);
    } else if (process.env.OPENAI_API_KEY) {
      aiResponse = await callOpenAIAPI(prompt, []);
    } else {
      aiResponse = "AI service not configured";
    }
    
    res.status(200).json({
      success: true,
      analysis: aiResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/ai/history
// @desc    Get chat history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      history: chatHistory ? chatHistory.messages : []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/ai/history
// @desc    Clear chat history
// @access  Private
router.delete('/history', protect, async (req, res) => {
  try {
    await ChatHistory.deleteOne({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to call Gemini API
async function callGeminiAPI(message, history) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "Sorry, I'm having trouble connecting to the AI service.";
  }
}

// Helper function to call OpenAI API
async function callOpenAIAPI(message, history) {
  try {
    const messages = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Sorry, I'm having trouble connecting to the AI service.";
  }
}

// Helper function to call Groq API
async function callGroqAPI(message, history) {
  try {
    const messages = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        ...messages,
        { role: "user", content: message }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    return "Sorry, I'm having trouble connecting to the AI service.";
  }
}

module.exports = router;
