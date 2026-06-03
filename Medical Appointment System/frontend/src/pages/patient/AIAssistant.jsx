
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

const AIAssistant = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage = input

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userMessage
      }
    ])

    setInput('')
    setLoading(true)

    setTimeout(() => {
      let aiResponse = ''
      const message = userMessage.toLowerCase()

if (message.includes('sleep')) {
  aiResponse =
    'To improve sleep, maintain a regular sleep schedule, avoid caffeine before bedtime, reduce screen time, and keep your bedroom dark and quiet.'
}
else if (message.includes('headache')) {
  aiResponse =
    'Headaches can result from stress, dehydration, eye strain, lack of sleep, or illness. Drink water, rest, and consult a doctor if symptoms persist.'
}
else if (message.includes('flu')) {
  aiResponse =
    'Common flu symptoms include fever, cough, sore throat, body aches, fatigue, and chills. Rest and hydration are important.'
}
else if (message.includes('fever')) {
  aiResponse =
    'A fever often indicates that your body is fighting an infection. Stay hydrated and monitor your temperature.'
}
else if (message.includes('cold')) {
  aiResponse =
    'Common cold symptoms include sneezing, runny nose, cough, congestion, and mild fatigue. Most colds improve with rest and fluids.'
}
else if (message.includes('cough')) {
  aiResponse =
    'A cough may be caused by a cold, flu, allergies, or throat irritation. Drink warm fluids and seek medical attention if it persists.'
}
else if (message.includes('diabetes')) {
  aiResponse =
    'Diabetes affects blood sugar regulation. Healthy eating, regular exercise, and following your doctor’s treatment plan are important.'
}
else if (message.includes('blood pressure')) {
  aiResponse =
    'Maintaining healthy blood pressure involves reducing salt intake, exercising regularly, managing stress, and attending routine checkups.'
}
else if (message.includes('heart')) {
  aiResponse =
    'Heart health can be improved through regular exercise, a balanced diet, avoiding smoking, and maintaining a healthy weight.'
}
else if (message.includes('weight loss')) {
  aiResponse =
    'Healthy weight loss usually involves a balanced diet, regular exercise, proper hydration, and consistent healthy habits.'
}
else if (message.includes('diet')) {
  aiResponse =
    'A healthy diet includes fruits, vegetables, whole grains, lean proteins, and adequate water intake while limiting processed foods.'
}
else if (message.includes('exercise')) {
  aiResponse =
    'Adults should aim for at least 150 minutes of moderate physical activity each week along with strength-training exercises.'
}
else if (message.includes('stress')) {
  aiResponse =
    'Stress can be reduced through relaxation techniques, exercise, proper sleep, meditation, and maintaining a healthy work-life balance.'
}
else if (message.includes('anxiety')) {
  aiResponse =
    'Anxiety may improve with deep breathing exercises, mindfulness, regular physical activity, and professional support when needed.'
}
else if (message.includes('covid')) {
  aiResponse =
    'COVID-19 symptoms may include fever, cough, fatigue, sore throat, and loss of taste or smell.'
}
else if (message.includes('water')) {
  aiResponse =
    'Most adults benefit from drinking enough water throughout the day to stay hydrated, though individual needs vary.'
}
else if (message.includes('vitamin')) {
  aiResponse =
    'Vitamins are essential nutrients that support body functions. A balanced diet is usually the best source of vitamins.'
}
else if (
  message.includes('back pain') ||
  message.includes('backpain')
) {
  aiResponse =
    'Back pain can be caused by poor posture, muscle strain, injury, or prolonged sitting. Gentle stretching, maintaining good posture, and light activity may help. Consult a doctor if pain is severe or persistent.'
}
else if (
  message.includes('vomiting') ||
  message.includes('vomit') ||
  message.includes('nausea')
) {
  aiResponse =
    'Vomiting can occur due to infections, food poisoning, motion sickness, or digestive issues. Drink small amounts of water frequently to prevent dehydration and seek medical care if symptoms are severe or prolonged.'
}
else {
  aiResponse =
    'I can help with sleep, headache, fever, flu, cough, diabetes, blood pressure, heart health, back pain, vomiting, diet, exercise, stress, anxiety, and general wellness questions.'
}
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: aiResponse
        }
      ])

      setLoading(false)
    }, 1000)
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      const recognition = new SpeechRecognition()

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = event => {
        setInput(event.results[0][0].transcript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        toast.error('Voice recognition failed')
      }

      recognition.start()
    } else {
      toast.error('Voice recognition not supported')
    }
  }

  const handleClearHistory = () => {
    setMessages([])
    toast.success('Chat history cleared')
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="w-8 h-8 text-primary-600 mr-2" />
          AI Health Assistant
        </h1>

        <button onClick={handleClearHistory}>
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 glass-card p-6 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4">

  {messages.length === 0 && (
    <div className="text-center py-10">
      <Bot className="w-12 h-12 mx-auto mb-4 text-primary-500" />

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {[
          'How can I improve sleep?',
          'Symptoms of flu',
          'How to reduce stress?',
          'Healthy diet tips',
          'What causes headaches?',
          'How to lose weight?',
          'How much water should I drink?',
          'Tips for heart health?',
          'What causes back pain?',
          'Why am I vomiting?'
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="px-4 py-2 bg-primary-100 rounded-full text-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-blue-100'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="bg-blue-100 p-4 rounded-xl w-fit">
              Thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex gap-2">
            <button
              onClick={handleVoiceInput}
              className="p-3 bg-gray-100 rounded-xl"
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a health question..."
              className="flex-1 border rounded-xl p-3"
            />

            <button
              onClick={handleSendMessage}
              className="p-3 bg-primary-600 text-white rounded-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
