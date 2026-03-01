import { Lightbulb, TrendingUp, Users, Award, Clock, ArrowRight, Play, BookOpen, Target } from "lucide-react";

const getInitials = (name: string) => {
  const parts = name.replace(/^Dr\.\s*/i, '').split(' ');
  return parts.slice(0, 2).map(n => n[0]).join('').toUpperCase();
};

const horizontalCards = [
  { 
    id: 1,
    title: "The Future of HR: AI-Driven Decision Making", 
    author: "Sarah Chen", 
    role: "Chief People Officer",
    date: "Dec 15, 2024", 
    readTime: "8 min read",
    category: "AI & Innovation",
    icon: Lightbulb,
    excerpt: "Explore how artificial intelligence is reshaping human resources and enabling data-driven workforce strategies."
  },
  { 
    id: 2,
    title: "Building Resilient Workforce Strategies for 2025", 
    author: "Mike Johnson", 
    role: "HR Strategy Lead",
    date: "Dec 12, 2024", 
    readTime: "6 min read",
    category: "Strategy",
    icon: Target,
    excerpt: "Learn how to build adaptive workforce strategies that thrive in uncertainty and drive organizational success."
  },
  { 
    id: 3,
    title: "The Science of Employee Engagement",
    author: "Jane Smith",
    role: "Engagement Specialist",
    date: "Dec 5, 2024",
    readTime: "12 min",
    category: "Engagement",
    videoUrl: "https://www.youtube.com/watch?v=IBHjUVFhFjA",
    excerpt: "Watch our deep dive into the psychology behind employee engagement and practical implementation strategies."
  },
];

const verticalCards = [
  { 
    id: 4,
    title: "Employee Experience in the Hybrid Era", 
    author: "John Doe", 
    role: "Employee Experience Director",
    date: "Dec 10, 2024", 
    readTime: "5 min read",
    category: "Culture",
    icon: Users,
  },
  { 
    id: 5,
    title: "Mastering Performance Management",
    author: "David Kim",
    role: "Performance Coach",
    date: "Dec 8, 2024",
    readTime: "7 min read",
    category: "Performance",
    icon: Award,
  },
  { 
    id: 6,
    title: "HR Analytics: From Data to Insights",
    author: "Sarah Johnson",
    role: "Analytics Manager",
    date: "Dec 3, 2024",
    readTime: "6 min read",
    category: "Analytics",
    icon: BookOpen,
  },
];

export function ThoughtLeadership() {
  const Icon1 = horizontalCards[0].icon;
  const Icon2 = horizontalCards[1].icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Thought Leadership</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 group">
          View All 
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Left Section - 3 Horizontal Cards */}
        <div className="col-span-12 md:col-span-9 grid grid-cols-3 gap-3">
          {/* Card 1 - Featured Style */}
          <div className="bg-primary/5 border border-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all flex flex-col h-[220px]">
            <div className="h-16 bg-primary/10 relative overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon1 className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 text-[9px] font-semibold bg-primary text-primary-foreground rounded-full">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-2.5 flex flex-col flex-1">
              <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full w-fit">
                {horizontalCards[0].category}
              </span>
              <h4 className="text-xs font-semibold text-foreground mt-1.5 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {horizontalCards[0].title}
              </h4>
              <p className="text-[9px] text-muted-foreground line-clamp-2 mb-auto">{horizontalCards[0].excerpt}</p>
              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                    {getInitials(horizontalCards[0].author)}
                  </div>
                  <div>
                    <p className="text-[9px] font-medium text-foreground">{horizontalCards[0].author}</p>
                    <p className="text-[8px] text-muted-foreground">{horizontalCards[0].date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  {horizontalCards[0].readTime}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Same Style */}
          <div className="bg-primary/5 border border-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all flex flex-col h-[220px]">
            <div className="h-16 bg-primary/10 relative overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon2 className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 text-[9px] font-semibold bg-primary text-primary-foreground rounded-full">
                  Trending
                </span>
              </div>
            </div>
            <div className="p-2.5 flex flex-col flex-1">
              <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full w-fit">
                {horizontalCards[1].category}
              </span>
              <h4 className="text-xs font-semibold text-foreground mt-1.5 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {horizontalCards[1].title}
              </h4>
              <p className="text-[9px] text-muted-foreground line-clamp-2 mb-auto">{horizontalCards[1].excerpt}</p>
              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                    {getInitials(horizontalCards[1].author)}
                  </div>
                  <div>
                    <p className="text-[9px] font-medium text-foreground">{horizontalCards[1].author}</p>
                    <p className="text-[8px] text-muted-foreground">{horizontalCards[1].date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  {horizontalCards[1].readTime}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Video Card - Light Pink */}
          <a 
            href={horizontalCards[2].videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-50 border border-pink-200/50 rounded-xl overflow-hidden group cursor-pointer hover:border-pink-300 transition-all flex flex-col h-[220px]"
          >
            <div className="h-16 bg-pink-100/50 relative overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-pink-600 fill-pink-600 ml-0.5" />
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 text-[9px] font-semibold bg-pink-500 text-white rounded-full flex items-center gap-1">
                  <Play className="w-2 h-2 fill-current" /> Video
                </span>
              </div>
            </div>
            <div className="p-2.5 flex flex-col flex-1">
              <span className="text-[9px] font-medium text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded-full w-fit">
                {horizontalCards[2].category}
              </span>
              <h4 className="text-xs font-semibold text-foreground mt-1.5 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors">
                {horizontalCards[2].title}
              </h4>
              <p className="text-[9px] text-muted-foreground line-clamp-2 mb-auto">{horizontalCards[2].excerpt}</p>
              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-pink-200/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-[8px] font-bold text-pink-600">
                    {getInitials(horizontalCards[2].author)}
                  </div>
                  <div>
                    <p className="text-[9px] font-medium text-foreground">{horizontalCards[2].author}</p>
                    <p className="text-[8px] text-muted-foreground">{horizontalCards[2].date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  {horizontalCards[2].readTime}
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Right Section - 3 Vertical Icon Cards */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-2 h-[220px]">
          {verticalCards.map((article) => {
            const Icon = article.icon;
            return (
              <div 
                key={article.id}
                className="bg-card border border-border rounded-xl p-2.5 group cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all flex-1 flex flex-col justify-between"
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[8px] text-muted-foreground">{article.author}</p>
                  <p className="text-[8px] text-muted-foreground">{article.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}