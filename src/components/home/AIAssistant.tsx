import { useState } from "react";
import { Bot, Send, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const quickPrompts = [
  { id: 1, label: "Summarize pending tasks", prompt: "Show me a summary of all pending tasks" },
  { id: 2, label: "What's overdue?", prompt: "What items are overdue across all modules?" },
  { id: 3, label: "Create a report", prompt: "Generate a weekly progress report" },
  { id: 4, label: "Show analytics", prompt: "Show me key analytics and trends" },
];

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I understand you want help with that. This is a demo response. In production, I would analyze your data and provide actionable insights."
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-1.5">
              AchievHR Assistant
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <p className="text-xs text-muted-foreground">AI-powered help at your fingertips</p>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="h-40 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Hi! I can help you navigate and manage your HR strategies. Try a quick action below or ask me anything.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Thinking...</span>
          </div>
        )}
      </div>
      
      {/* Quick Prompts */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.slice(0, 2).map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSend(prompt.prompt)}
              className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            >
              {prompt.label}
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask me anything..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
