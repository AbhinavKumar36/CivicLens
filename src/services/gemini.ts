import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ISSUE_REPORT_SYSTEM_PROMPT } from "../constants/prompts";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Context-aware Mock Chat Session Fallback to prevent demo failure without a real API key
class MockChatSession {
  private history: any[] = [];
  private systemInstruction: string;
  private responseCount: number = 0;

  constructor(systemInstruction: string) {
    this.systemInstruction = systemInstruction;
  }

  async sendMessage(messageText: string) {
    const text = messageText.toLowerCase();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (this.systemInstruction.includes("Issue Intake Assistant")) {
      this.responseCount++;
      
      // If they provide a detailed issue description or on the 2nd/3rd prompt, conclude reporting
      if (text.includes("pothole") || text.includes("leak") || text.includes("spill") || text.includes("broken") || text.includes("road") || this.responseCount >= 2) {
        let category = "Infrastructure";
        let department = "Public Works";
        let priority = "Medium";
        let severity = "Moderate";
        let summary = messageText;

        if (text.includes("waste") || text.includes("garbage") || text.includes("trash") || text.includes("sewer") || text.includes("smell")) {
          category = "Sanitation";
          department = "Health & Sanitation";
          priority = "Medium";
          severity = "Moderate";
        } else if (text.includes("flood") || text.includes("burst") || text.includes("rupture")) {
          category = "Water & Power";
          department = "Utilities";
          priority = "Critical";
          severity = "Severe";
        } else if (text.includes("accident") || text.includes("crash") || text.includes("fire")) {
          category = "Public Safety";
          department = "Public Safety";
          priority = "Critical";
          severity = "Severe";
        }

        return {
          response: {
            text: () => JSON.stringify({
              type: "REPORT_READY",
              data: {
                category,
                priority,
                department,
                severity,
                summary,
                estimated_resolution_time: priority === "Critical" ? "12 Hours" : "48 Hours"
              }
            })
          }
        };
      } else {
        return {
          response: {
            text: () => "I've noted that description. Could you provide a bit more detail about the exact location, and if there are any immediate hazards or safety concerns?"
          }
        };
      }
    } else {
      // General QA Chatbot
      let reply = "";
      if (text.includes("permit") || text.includes("license")) {
        reply = "To apply for a permit or pet license, please navigate to the **Services Hub** and click 'Apply for Building Permit' or 'Renew Pet License'. The digital wizard will check your eligibility and handle uploads.";
      } else if (text.includes("tax") || text.includes("bill") || text.includes("pay")) {
        reply = "You can pay utility balances or property tax invoices directly under the **Quick Actions** section on the main Dashboard. Payments are processed instantly.";
      } else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        reply = "Hello! I am your CivicLens AI Municipal Assistant. I can help you report local infrastructure issues, find services, or check transit schedules. What can I assist you with today?";
      } else if (text.includes("map") || text.includes("construction")) {
        reply = "You can view active municipal road closures, transit delays, and infrastructure incidents live on the **Map Dashboard** page.";
      } else {
        reply = `I understand you are asking about "${messageText}". You can search for official permits and utility bills inside the **Services Hub**, view live city issues on the **Map Dashboard**, or write to us in the **Support** page under secondary options.`;
      }

      return {
        response: {
          text: () => reply
        }
      };
    }
  }

  async *sendMessageStream(messageText: string) {
    const text = messageText.toLowerCase();
    let reply = "";

    if (text.includes("permit") || text.includes("license")) {
      reply = "To apply for a permit or pet license, please navigate to the **Services Hub** and click 'Apply for Building Permit' or 'Renew Pet License'. The digital wizard will check your eligibility and handle uploads.";
    } else if (text.includes("tax") || text.includes("bill") || text.includes("pay")) {
      reply = "You can pay utility balances or property tax invoices directly under the **Quick Actions** section on the main Dashboard. Payments are processed instantly.";
    } else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      reply = "Hello! I am your CivicLens AI Municipal Assistant. I can help you report local infrastructure issues, find services, or check transit schedules. What can I assist you with today?";
    } else if (text.includes("map") || text.includes("construction")) {
      reply = "You can view active municipal road closures, transit delays, and infrastructure incidents live on the **Map Dashboard** page.";
    } else {
      reply = `I understand you are asking about "${messageText}". You can search for official permits and utility bills inside the **Services Hub**, view live city issues on the **Map Dashboard**, or write to us in the **Support** page under secondary options.`;
    }

    const chunks = reply.split(" ");
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 50));
      yield {
        text: () => chunk + " "
      };
    }
  }
}

class FallbackChatSession {
  private systemInstruction: string;
  private history: any[] = [];
  private currentMode: "3.5" | "2.5" | "mock" = "3.5";
  private session35: any = null;
  private session25: any = null;
  private mockSession: MockChatSession;

  constructor(systemInstruction: string) {
    this.systemInstruction = systemInstruction;
    this.mockSession = new MockChatSession(systemInstruction);

    if (API_KEY && API_KEY !== "your_api_key_here") {
      try {
        const model35 = genAI.getGenerativeModel({ 
          model: "gemini-3.5-flash",
          systemInstruction,
          safetySettings
        });
        this.session35 = model35.startChat({
          history: [],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        });

        const model25 = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          systemInstruction,
          safetySettings
        });
        this.session25 = model25.startChat({
          history: [],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        });
      } catch (err) {
        console.warn("Failed to initialize remote models, falling back to mock");
        this.currentMode = "mock";
      }
    } else {
      this.currentMode = "mock";
    }
  }

  async sendMessage(messageText: string): Promise<any> {
    if (this.currentMode === "3.5" && this.session35) {
      try {
        console.log("Attempting Gemini 3.5 Flash...");
        const result = await this.session35.sendMessage(messageText);
        this.syncHistory();
        return result;
      } catch (error) {
        console.warn("Gemini 3.5 Flash failed, falling back to 2.5 Flash...", error);
        this.currentMode = "2.5";
      }
    }

    if (this.currentMode === "2.5" && this.session25) {
      try {
        console.log("Attempting Gemini 2.5 Flash...");
        const result = await this.session25.sendMessage(messageText);
        this.syncHistory();
        return result;
      } catch (error) {
        console.warn("Gemini 2.5 Flash failed, falling back to Offline Mock...", error);
        this.currentMode = "mock";
      }
    }

    console.log("Using Offline Mock Fallback...");
    return this.mockSession.sendMessage(messageText);
  }

  private async *_getStream(messageText: string): AsyncGenerator<any, void, unknown> {
    if (this.currentMode === "3.5" && this.session35) {
      try {
        console.log("Attempting Gemini 3.5 Flash (Stream)...");
        const result = await this.session35.sendMessageStream(messageText);
        for await (const chunk of result.stream) {
          yield chunk;
        }
        this.syncHistory();
        return;
      } catch (error) {
        console.warn("Gemini 3.5 Flash Stream failed, falling back to 2.5 Flash...", error);
        this.currentMode = "2.5";
      }
    }

    if (this.currentMode === "2.5" && this.session25) {
      try {
        console.log("Attempting Gemini 2.5 Flash (Stream)...");
        const result = await this.session25.sendMessageStream(messageText);
        for await (const chunk of result.stream) {
          yield chunk;
        }
        this.syncHistory();
        return;
      } catch (error) {
        console.warn("Gemini 2.5 Flash Stream failed, falling back to Offline Mock...", error);
        this.currentMode = "mock";
      }
    }

    console.log("Using Offline Mock Fallback (Stream)...");
    const stream = this.mockSession.sendMessageStream(messageText);
    for await (const chunk of stream) {
      yield chunk;
    }
  }

  async sendMessageStream(messageText: string): Promise<{ stream: AsyncGenerator<any, void, unknown> }> {
    return { stream: this._getStream(messageText) };
  }

  getCurrentMode(): string {
    return this.currentMode;
  }

  // To keep history somewhat synced if we fail midway, though the actual SDK manages its own array.
  // We'll rely on the fact that if a request fails, it probably didn't get added to history.
  private async syncHistory() {
    try {
      if (this.currentMode === "3.5" && this.session35 && this.session25) {
        const hist = await this.session35.getHistory();
        // SDK doesn't expose setHistory easily, but we can reconstruct if needed.
        // For fallback simplicity, we assume if 3.5 fails on first try we just start 2.5 clean.
      }
    } catch(e) {}
  }
}

export const getGeminiChatSession = (systemInstruction: string) => {
  return new FallbackChatSession(systemInstruction);
};

export const startReportingSession = () => {
  return getGeminiChatSession(ISSUE_REPORT_SYSTEM_PROMPT);
};
