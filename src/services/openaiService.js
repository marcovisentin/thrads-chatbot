import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const SYSTEM_PROMPT = 'You are a helpful and friendly AI assistant. Keep responses concise and engaging. If you provide lists, make them maximum 3 items.';

export const sendMessage = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};