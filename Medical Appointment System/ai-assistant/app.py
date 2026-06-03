import gradio as gr
import os
from typing import List, Tuple
import json

# AI API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# System prompt for medical AI assistant
SYSTEM_PROMPT = """
You are a compassionate and knowledgeable AI Medical Assistant for MediCare AI. Your role is to:

1. Provide general health information and guidance
2. Help users understand symptoms and suggest possible conditions
3. Recommend appropriate medical specializations
4. Offer general wellness and preventive care advice
5. Answer questions about medications (general information only)

IMPORTANT GUIDELINES:
- Always include a disclaimer that you are not a doctor and users should consult healthcare professionals
- Never provide definitive medical diagnoses
- Never prescribe specific medications or treatments
- If symptoms suggest emergency conditions, advise immediate medical attention
- Be empathetic and supportive in your responses
- Use clear, non-technical language when possible
- Recommend seeing a doctor for proper diagnosis and treatment

When analyzing symptoms, structure your response to include:
1. Possible conditions (with appropriate disclaimers)
2. Recommended medical specialization
3. General home care suggestions (if appropriate)
4. Red flags that require immediate medical attention
5. Recommendation to see a healthcare provider
"""

class MedicalAIAssistant:
    def __init__(self):
        self.chat_history = []
        self.system_prompt = SYSTEM_PROMPT

    def add_system_message(self, message: str):
        """Add a system message to the conversation"""
        self.chat_history.append({"role": "system", "content": message})

    def add_user_message(self, message: str):
        """Add a user message to the conversation"""
        self.chat_history.append({"role": "user", "content": message})

    def add_assistant_message(self, message: str):
        """Add an assistant message to the conversation"""
        self.chat_history.append({"role": "assistant", "content": message})

    def get_chat_history(self) -> List[dict]:
        """Get the current chat history"""
        return self.chat_history

    def clear_history(self):
        """Clear the chat history"""
        self.chat_history = []

    def format_history_for_api(self) -> List[dict]:
        """Format chat history for API call"""
        formatted = [{"role": "system", "content": self.system_prompt}]
        formatted.extend(self.chat_history)
        return formatted

# Initialize the assistant
assistant = MedicalAIAssistant()

def generate_response_gemini(message: str, history: List[Tuple[str, str]]) -> str:
    """Generate response using Gemini API"""
    try:
        import google.generativeai as genai
        
        if not GEMINI_API_KEY:
            return "Error: Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
        
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        # Build conversation context
        conversation = assistant.system_prompt + "\n\n"
        for user_msg, assistant_msg in history:
            if user_msg:
                conversation += f"User: {user_msg}\n"
            if assistant_msg:
                conversation += f"Assistant: {assistant_msg}\n"
        conversation += f"User: {message}\nAssistant:"
        
        response = model.generate_content(conversation)
        return response.text
        
    except ImportError:
        return "Error: Google Generative AI library not installed. Run: pip install google-generativeai"
    except Exception as e:
        return f"Error generating response: {str(e)}"

def generate_response_openai(message: str, history: List[Tuple[str, str]]) -> str:
    """Generate response using OpenAI API"""
    try:
        import openai
        
        if not OPENAI_API_KEY:
            return "Error: OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Build messages
        messages = [{"role": "system", "content": assistant.system_prompt}]
        for user_msg, assistant_msg in history:
            if user_msg:
                messages.append({"role": "user", "content": user_msg})
            if assistant_msg:
                messages.append({"role": "assistant", "content": assistant_msg})
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except ImportError:
        return "Error: OpenAI library not installed. Run: pip install openai"
    except Exception as e:
        return f"Error generating response: {str(e)}"

def generate_response_fallback(message: str, history: List[Tuple[str, str]]) -> str:
    """Fallback response when no AI API is configured"""
    responses = [
        "I understand you're asking about health concerns. While I can provide general information, I recommend consulting with a healthcare professional for personalized medical advice.",
        "That's an important health question. For accurate diagnosis and treatment, please schedule an appointment with one of our qualified doctors through the MediCare AI platform.",
        "I can help with general health information, but for specific medical concerns, it's best to consult with a doctor who can evaluate your condition properly.",
    ]
    
    # Simple keyword matching for basic responses
    message_lower = message.lower()
    
    if "headache" in message_lower:
        return """Headaches can have many causes including stress, dehydration, lack of sleep, or more serious conditions. 

**Possible causes:**
- Tension headaches (stress, poor posture)
- Migraines
- Dehydration
- Eye strain
- Lack of sleep

**Recommendations:**
- Rest in a quiet, dark room
- Stay hydrated
- Apply cold or warm compress
- Consider over-the-counter pain relievers (follow dosage instructions)

**When to see a doctor:**
- Severe or sudden headache
- Headache with fever, stiff neck, or confusion
- Headache after head injury
- Frequent headaches that interfere with daily life

⚠️ **Disclaimer:** This is general information only. Please consult a healthcare professional for proper diagnosis and treatment."""
    
    elif "fever" in message_lower:
        return """Fever is a sign that your body is fighting an infection or illness.

**Common causes:**
- Viral infections (cold, flu)
- Bacterial infections
- Inflammatory conditions
- Heat exhaustion

**Home care:**
- Rest and stay hydrated
- Take acetaminophen or ibuprofen (follow dosage instructions)
- Use a lukewarm sponge bath
- Wear light clothing

**When to seek immediate medical attention:**
- Fever above 103°F (39.4°C) in adults
- Fever with severe headache, stiff neck, or confusion
- Fever lasting more than 3 days
- Fever in infants under 3 months old

⚠️ **Disclaimer:** This is general information only. Please consult a healthcare professional for proper diagnosis and treatment."""
    
    elif "appointment" in message_lower or "book" in message_lower:
        return """To book an appointment with one of our qualified doctors:

1. Log in to your MediCare AI account
2. Navigate to the "Book Appointment" section
3. Select your preferred specialization
4. Choose a doctor and available time slot
5. Confirm your appointment

Our doctors specialize in:
- General Medicine
- Cardiology
- Dermatology
- Neurology
- Orthopedics
- Pediatrics
- And more...

If you need immediate assistance, please call our emergency helpline."""
    
    return responses[len(history) % len(responses)]

def chat_interface(message: str, history: List[Tuple[str, str]]) -> Tuple[str, List[Tuple[str, str]]]:
    """Main chat interface function"""
    # Determine which API to use
    if GEMINI_API_KEY:
        response = generate_response_gemini(message, history)
    elif OPENAI_API_KEY:
        response = generate_response_openai(message, history)
    else:
        response = generate_response_fallback(message, history)
    
    # Update history
    history.append((message, response))
    
    return "", history

def symptom_checker(symptoms: str) -> str:
    """AI-powered symptom checker"""
    if not symptoms:
        return "Please describe your symptoms."
    
    prompt = f"""
Based on the following symptoms: {symptoms}

Please provide:
1. Possible conditions (with appropriate disclaimers)
2. Recommended medical specialization to consult
3. General home care suggestions
4. Red flags that require immediate medical attention
5. Recommendation to see a healthcare provider

Format your response clearly with headings.
"""
    
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            return response.text
        except:
            pass
    
    elif OPENAI_API_KEY:
        try:
            import openai
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
                max_tokens=600
            )
            return response.choices[0].message.content
        except:
            pass
    
    # Fallback response
    return f"""
**Symptom Analysis for: {symptoms}**

Based on the symptoms described, here are some general considerations:

**Possible Conditions:**
- Various conditions could cause these symptoms
- A proper medical evaluation is needed for accurate diagnosis

**Recommended Specialization:**
- General Physician (for initial evaluation)
- They can refer you to specialists if needed

**General Suggestions:**
- Rest and stay hydrated
- Monitor your symptoms
- Keep a symptom diary

**Red Flags - Seek Immediate Care If:**
- Symptoms worsen rapidly
- You experience severe pain
- You have difficulty breathing
- You have high fever with confusion

**Recommendation:**
Please schedule an appointment with a doctor for proper evaluation and diagnosis.

⚠️ **Disclaimer:** This is general information only and not a substitute for professional medical advice, diagnosis, or treatment.
"""

# Create the Gradio interface
with gr.Blocks(theme=gr.themes.Soft(primary_hue="blue")) as demo:
    gr.Markdown("""
    # 🏥 MediCare AI - Medical Assistant
    
    Welcome to your AI-powered health assistant! I'm here to help with general health information, 
    symptom analysis, and guidance on when to seek medical care.
    
    ⚠️ **Important:** I am an AI assistant, not a doctor. Always consult healthcare professionals for medical advice.
    """)
    
    with gr.Tabs():
        # Chat Tab
        with gr.Tab("💬 Chat with AI Assistant"):
            chatbot = gr.Chatbot(
                label="Medical Chat",
                height=500,
                show_copy_button=True,
                bubble_full_width=False
            )
            msg = gr.Textbox(
                label="Your Message",
                placeholder="Ask me about your health concerns...",
                lines=2
            )
            with gr.Row():
                submit = gr.Button("Send", variant="primary")
                clear = gr.Button("Clear Chat", variant="secondary")
            
            msg.submit(chat_interface, [msg, chatbot], [msg, chatbot])
            submit.click(chat_interface, [msg, chatbot], [msg, chatbot])
            clear.click(lambda: ([], ""), outputs=[chatbot, msg])
            
            gr.Examples(
                examples=[
                    "I have a persistent headache for 3 days",
                    "What are the symptoms of flu?",
                    "How can I improve my sleep quality?",
                    "I'm feeling dizzy and nauseous",
                    "What should I do for a minor burn?"
                ],
                inputs=msg
            )
        
        # Symptom Checker Tab
        with gr.Tab("🔍 Symptom Checker"):
            gr.Markdown("""
            ### AI-Powered Symptom Analysis
            
            Describe your symptoms and get AI-powered insights about possible conditions, 
            recommended specializations, and general care suggestions.
            """)
            
            symptom_input = gr.Textbox(
                label="Describe Your Symptoms",
                placeholder="e.g., headache, fever, fatigue, body aches...",
                lines=4
            )
            symptom_output = gr.Markdown(label="Analysis Result")
            symptom_button = gr.Button("Analyze Symptoms", variant="primary")
            
            symptom_button.click(symptom_checker, symptom_input, symptom_output)
            
            gr.Examples(
                examples=[
                    "Severe headache with sensitivity to light and nausea",
                    "Chest pain and shortness of breath",
                    "Fever, cough, and body aches",
                    "Stomach pain and nausea"
                ],
                inputs=symptom_input
            )
        
        # Emergency Info Tab
        with gr.Tab("🚨 Emergency Information"):
            gr.Markdown("""
            ### When to Seek Emergency Care
            
            Call emergency services (911 or your local emergency number) immediately if you experience:
            
            - Chest pain or pressure
            - Difficulty breathing or shortness of breath
            - Sudden severe headache
            - Slurred speech or difficulty speaking
            - Weakness or numbness on one side of the body
            - Loss of consciousness
            - Severe burns
            - Deep wounds or heavy bleeding
            - High fever with stiff neck
            - Severe allergic reaction (difficulty breathing, swelling)
            
            ### Emergency Contacts
            
            - **Emergency Services:** 911 (US) / 112 (Europe)
            - **Poison Control:** 1-800-222-1222 (US)
            - **Suicide Prevention Hotline:** 988 (US)
            
            ⚠️ **If you're unsure whether your condition is an emergency, err on the side of caution and seek immediate medical attention.**
            """)
    
    gr.Markdown("""
    ---
    
    **Disclaimer:** This AI assistant provides general health information only and is not a substitute 
    for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician 
    or other qualified health provider with any questions you may have regarding a medical condition.
    
    © 2024 MediCare AI - All Rights Reserved
    """)

if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )
