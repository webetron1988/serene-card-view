import { useState } from "react";
import { Bot, Send, Loader2, Zap, Brain, MessageSquare, TrendingUp, Users, FileText, Lightbulb, ChevronRight, ExternalLink } from "lucide-react";

const quickActions = [
  { id: 1, label: "Summarize Tasks", icon: FileText, description: "Get overview of pending work", prompt: "Show me a summary of all pending tasks" },
  { id: 2, label: "Analyze Trends", icon: TrendingUp, description: "Review performance metrics", prompt: "Show me key analytics and trends" },
  { id: 3, label: "Team Insights", icon: Users, description: "Workforce analytics", prompt: "Give me insights about team performance" },
  { id: 4, label: "Smart Suggestions", icon: Lightbulb, description: "AI recommendations", prompt: "What are your recommendations for improving HR efficiency?" },
  { id: 5, label: "Generate Report", icon: FileText, description: "Create HR reports", prompt: "Generate a comprehensive HR report" },
  { id: 6, label: "Policy Review", icon: Brain, description: "Compliance check", prompt: "Review current HR policies for compliance" },
  { id: 7, label: "Workforce Planning", icon: Users, description: "Strategic planning", prompt: "Help me with workforce planning strategies" },
  { id: 8, label: "Performance Analysis", icon: TrendingUp, description: "Team performance", prompt: "Analyze team performance metrics" },
];

const capabilities = [
  { icon: Brain, label: "Smart Analysis", description: "Deep insights from your data" },
  { icon: Zap, label: "Instant Reports", description: "Generate reports in seconds" },
  { icon: MessageSquare, label: "Natural Chat", description: "Ask anything in plain English" },
];

export function AIAssistantSection() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [activeAction, setActiveAction] = useState<number | null>(null);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsTyping(true);
    setActiveAction(null);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I understand you want help with that. This is a demo response. In production, I would analyze your data and provide actionable insights tailored to your HR needs."
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">AI Assistant</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 group">
          Explore Assistant
          <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Chat Interface */}
        <div className="col-span-12 lg:col-span-7 bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border border-border rounded-xl overflow-hidden">
          {/* Chat Header with KRIS Bot */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 px-4 py-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-background rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">KRIS</p>
                  <p className="text-[10px] text-muted-foreground">Your HR Intelligence Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {capabilities.map((cap, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-background rounded-full border border-border">
                    <cap.icon className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-medium text-muted-foreground">{cap.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="h-56 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-3">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">Hi, I'm KRIS!</p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Your AI-powered HR assistant. I can analyze data, generate reports, and provide strategic recommendations.
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
                <span className="text-xs">Analyzing...</span>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-3 border-t border-border/50 bg-background/50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask anything about your HR data..."
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-5 flex flex-col">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    setActiveAction(action.id);
                    handleSend(action.prompt);
                  }}
                  className={`
                    text-left p-3 rounded-xl border transition-all group
                    ${activeAction === action.id 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-card border-border hover:border-primary/30 hover:bg-primary/5'
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                      ${activeAction === action.id ? 'bg-primary/20' : 'bg-muted group-hover:bg-primary/10'}
                    `}>
                      <Icon className={`w-4 h-4 ${activeAction === action.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                        {action.label}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}