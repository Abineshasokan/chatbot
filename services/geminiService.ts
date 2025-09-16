import type { Chat } from '@google/genai';

/**
 * Sends a message to the Gemini model using an existing chat session.
 * @param chat - The initialized chat session instance.
 * @param message - The user's message to send.
 * @returns The text response from the model.
 */
export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    const errorMessage = error instanceof Error ? error.toString() : "An unknown error occurred";
    
    if (errorMessage.includes('API key')) {
        throw new Error("Invalid API Key. Please check your configuration.");
    }
    
    throw new Error("Failed to get a response from the AI. This could be a network issue or an API error.");
  }
};