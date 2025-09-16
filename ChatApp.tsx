
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Sender, ChartDataPoint } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { sendMessageToGemini } from './services/geminiService';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import StateBrowserModal from './components/StateBrowserModal';
import Sidebar from './components/Sidebar';

interface ChatAppProps {
    onLogout: () => void;
}

const getGreeting = (language: string): string => {
    switch (language) {
      case 'English':
        return 'Hello';
      case 'हिन्दी':
        return 'नमस्ते';
      case 'বাংলা':
        return 'নমস্কার';
      case 'తెలుగు':
        return 'నమస్కారం';
      case 'मराठी':
        return 'नमस्कार';
      case 'தமிழ்':
        return 'வணக்கம்';
      case 'ગુજરાતી':
        return 'નમસ્તે';
      case 'ಕನ್ನಡ':
        return 'ನಮಸ್ಕಾರ';
      case 'ଓଡ଼ିଆ':
        return 'ନମସ୍କାର';
      case 'മലയാളം':
        return 'നമസ്കാരം';
      case 'ਪੰਜਾਬੀ':
        return 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ';
      default:
        return 'Hello';
    }
};

const getSystemInstruction = (language: string) => `You are 'NeerAI', an expert AI assistant from the Indian Ministry of Jal Shakti. Your sole purpose is to provide accurate and easy-to-understand information about groundwater levels across all states and union territories of India.

**Response Language: You must respond exclusively in ${language}.**

**Single State Queries:**
When a user asks about a single, specific state, you MUST:
1.  Provide a concise textual summary covering:
    *   **Freshwater (Potable) Levels:** General status (e.g., stable, declining, critical), key facts, and any major government schemes related to it.
    *   **Saltwater Intrusion:** Mention if this is a significant issue, especially for coastal states, and describe the extent of the problem.
2.  **Generate a JSON object for a line chart showing the average annual groundwater level for the past 5 years.** The "name" field should be the year (e.g., "2020", "2021"), and "level" should be the groundwater level in meters below ground level (mbgl).

**Regional Queries:**
Users can ask about regions (e.g., "North India", "Southern states"). You should recognize North, South, East, West, Central, and North-East India and provide a brief summary for the states in that region. Do not generate a chart for regional queries unless specifically asked.

**Historical Data:**
If a user specifically asks for data for a different year or a range of years (e.g., "groundwater in Punjab in 2015" or "data for Gujarat from 2010 to 2015"), provide the available historical data for that period, overriding the default 5-year trend.

**State Comparison:**
If the user asks to compare two or more states (e.g., "Compare Punjab and Haryana"), you must:
1.  Provide a textual summary comparing the key groundwater metrics for each state.
2.  Generate a JSON object for a multi-line comparison chart. The "name" field is the time period, and each subsequent key should be the state's name with its corresponding level. You MUST include a "comparisonStates" array listing the states being compared.

**Data Exploration & Suggestions:**
After providing the main response and any chart data, you MUST include a \`suggestions\` array in your JSON output. This array should contain 4-5 relevant, short follow-up questions to encourage deeper exploration. The suggestions should be diverse and cover different aspects. Examples include:
- Temporal questions (e.g., "Show data for 2018", "What was the trend 10 years ago?").
- Comparative questions (e.g., "Compare with [Neighboring State]", "How does this compare to the national average?").
- Explanatory questions (e.g., "Why is the level declining?", "What government schemes are in place?").
- Solution-oriented questions (e.g., "What are the solutions for this issue?").

**Data Visualization (JSON format):**
- **For single-state 5-year trend (DEFAULT):**
\`\`\`json
{
  "chartData": [
    {"name": "2019", "level": 14.8},
    {"name": "2020", "level": 15.1},
    {"name": "2021", "level": 15.0},
    {"name": "2022", "level": 15.2},
    {"name": "2023", "level": 15.5}
  ],
  "suggestions": ["Show data since 2010", "Compare with Rajasthan", "Why did the level increase in 2023?"]
}
\`\`\`
- **For multi-state comparisons:**
\`\`\`json
{
  "chartData": [
    {"name": "2022", "Punjab": 15.2, "Haryana": 18.1},
    {"name": "2023", "Punjab": 15.5, "Haryana": 18.3}
  ],
  "comparisonStates": ["Punjab", "Haryana"],
  "suggestions": ["Add Rajasthan to the comparison", "Show data from 2020", "Which state has a better trend?"]
}
\`\`\`
**CRITICAL DATA FORMATTING RULE:** The "level" value (or the state name value in comparisons) in the "chartData" JSON object MUST ALWAYS be a numerical value representing meters below ground level (mbgl). Do NOT use descriptive strings like "stable" or "declining" in the chart data. Provide only numbers. If you do not have a precise number, provide a reasonable, representative numerical estimate based on the qualitative data you have. Under no circumstances should you state that the data is "descriptive rather than precise."

Always provide a textual summary alongside any JSON data.

Your tone should be authoritative yet helpful. Use clear language and avoid overly technical jargon. Format your text responses using markdown for readability (e.g., bold headings, bullet points). Always base your answers on the most recent available data. Do not answer questions outside the scope of Indian groundwater. If a user asks an unrelated question, politely steer them back to the topic.`;


const ChatApp: React.FC<ChatAppProps> = ({ onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 'initial-message',
        text: "Initializing NeerAI...",
        sender: Sender.Bot,
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(async () => {
    setIsChatInitialized(false);
    setMessages([
        {
            id: 'initial-message',
            text: "Starting a new chat session...",
            sender: Sender.Bot,
        }
    ]);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured for this application.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = getSystemInstruction(language);
      
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
        },
      });
      
      setIsChatInitialized(true);
      const greeting = getGreeting(language);
      setMessages([
        {
          id: 'initial-message-success',
          text: `${greeting}! I am NeerAI. Ask me about India's groundwater to see a 5-year trend.\n\nYou can also ask about regions (e.g., 'North India') or compare states (e.g., 'Compare groundwater in Punjab and Haryana').`,
          sender: Sender.Bot,
        },
      ]);
    } catch (e) {
      console.error("Initialization failed:", e);
      setIsChatInitialized(false);
      setMessages([
          {
            id: 'initial-message-error',
            text: "Sorry, I'm having trouble connecting to the AI service. The chatbot is currently unavailable. Please try refreshing the page later.",
            sender: Sender.Bot,
          }
      ]);
    }
  }, [language]);
  
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleClearChat = () => {
    // "New Chat" button action, no confirmation needed.
    initializeChat();
  };

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim() || isLoading || !isChatInitialized) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: Sender.User,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const botResponseText = await sendMessageToGemini(chatRef.current, inputText);
      
      let chartData: ChartDataPoint[] | undefined = undefined;
      let comparisonStates: string[] | undefined = undefined;
      let suggestions: string[] | undefined = undefined;
      let cleanText = botResponseText;

      const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
      const jsonMatch = botResponseText.match(jsonRegex);

      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedJson = JSON.parse(jsonMatch[1]);
          cleanText = botResponseText.replace(jsonRegex, '').trim();
          
          if (parsedJson.chartData && Array.isArray(parsedJson.chartData)) {
            chartData = parsedJson.chartData;
          }
          if (parsedJson.comparisonStates && Array.isArray(parsedJson.comparisonStates)) {
              comparisonStates = parsedJson.comparisonStates;
          }
          if (parsedJson.suggestions && Array.isArray(parsedJson.suggestions)) {
              suggestions = parsedJson.suggestions;
          }
        } catch (e) {
          console.error("Failed to parse JSON from response:", e);
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: cleanText,
        sender: Sender.Bot,
        chartData,
        comparisonStates,
        suggestions,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Sorry, I couldn't fetch a response. ${errorMessage}`);
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I'm having trouble connecting. Please check your connection and try again.`,
        sender: Sender.Bot,
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchStateData = (stateName: string) => {
    if (!stateName || isLoading || !isChatInitialized) return;
    handleSendMessage(`Provide a detailed summary of groundwater levels in ${stateName}.`);
  };
  
  const handleStateSelect = (stateName: string) => {
    setIsStateModalOpen(false);
    handleFetchStateData(stateName);
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-300">
       <Sidebar
        selectedLanguage={language}
        onLanguageChange={handleLanguageChange}
        onClearChat={handleClearChat}
        onBrowseClick={() => setIsStateModalOpen(true)}
        onLogout={onLogout}
       />
       <div className="flex flex-col flex-1 h-screen">
          <Header
            onClearChat={handleClearChat}
            onBrowseClick={() => setIsStateModalOpen(true)}
            onLogout={onLogout}
          />
          <main className="flex flex-col flex-1 overflow-hidden bg-[color:var(--color-bg-light-indigo)]/50 backdrop-blur-md">
            <div className="flex-1 overflow-hidden">
                <ChatWindow messages={messages} isLoading={isLoading} onSuggestionClick={handleSendMessage} />
            </div>
            <div className="border-t border-[color:var(--color-accent-teal)]/20 bg-[color:var(--color-bg-light-indigo)]/70">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    disabled={!isChatInitialized}
                />
                {error && <p className="text-center text-red-500 text-sm p-2">{error}</p>}
            </div>
          </main>
       </div>
       <StateBrowserModal
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        onSelectState={handleStateSelect}
       />
    </div>
  );
};

export default ChatApp;