const CHAINGPT_API_URL = 'https://api.chaingpt.org/chat/stream';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const fetchAIResponse = async (question: string, chatHistory: ChatMessage[] = []) => {
  const apiKey = import.meta.env.VITE_CHAINGPT_API_KEY;

  if (!apiKey) {
    return "AI Assistant: Please configure your ChainGPT API Key in .env file.";
  }

  try {
    // Formatting history for ChainGPT if needed, 
    // but the basic API uses "question" and "chatHistory": "on/off"
    // For this prototype, we'll use a session-based approach or simplified context.
    
    const response = await fetch(CHAINGPT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "general_assistant",
        question: question,
        chatHistory: chatHistory.length > 0 ? "on" : "off",
        // sdkUniqueId: "ghostpay-session-1" // Would be dynamic in production
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.answer || data.response || "No response from AI.";
  } catch (error) {
    console.error("ChainGPT Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};
