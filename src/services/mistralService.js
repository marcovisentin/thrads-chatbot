import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.REACT_APP_MISTRAL_API_KEY;
if (!apiKey) {
  throw new Error("MISTRAL_API_KEY environment variable not set. Please add it to your .env file.");
}

const client = new Mistral({ apiKey });

const SYSTEM_PROMPT = 'You are a helpful and friendly AI assistant. Keep responses concise.';

export const sendMessage = async (messages) => {
    try {
      const response = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7
      });
      return response.choices[0].message;
    } catch (error) {
      console.error('Error during Mistral chat completion:', error);
      throw error;
    }
  };