import { GROQ_API_KEY } from '../config';

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export const generatePitch = async (messages, instructions) => {
  try {
    const systemMessage = {
      role: 'system',
      content: `You are a professional pitch writer specializing in creating compelling 6-minute business pitches. 
      Your task is to analyze the conversation history and create a structured pitch that can be delivered in exactly 6 minutes.
      
      ${instructions}
      
      Important: Format the pitch with clear section headers and timing indicators. Each section should be clearly marked with its duration.
      Make the pitch engaging and professional, suitable for a business presentation.`
    };

    // Format the conversation history
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2-70b-4096', // Using Llama 2 70B model
        messages: [systemMessage, ...conversationHistory],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate pitch');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating pitch:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, instructions } = req.body;
    const pitch = await generatePitch(messages, instructions);
    
    return res.status(200).json({ 
      pitch,
      timestamp: new Date().toISOString(),
      model: 'llama2-70b-4096'
    });
  } catch (error) {
    console.error('Error in generate-pitch handler:', error);
    return res.status(500).json({ error: 'Failed to generate pitch' });
  }
} 