import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, BookOpen, Lightbulb, Bell, FileText } from "lucide-react";

const newsItems = [
  {
    id: 1,
    type: "announcement",
    icon: Bell,
    title: "New Governance Module Released",
    description: "Enhanced compliance tracking and automated policy workflows now available.",
    date: "2 hours ago",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    type: "tip",
    icon: Lightbulb,
    title: "Pro Tip: Keyboard Shortcuts",
    description: "Press Ctrl+K to quickly search and navigate across all modules.",
    date: "Yesterday",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 3,
    type: "resource",
    icon: BookOpen,
    title: "Strategy Planning Guide",
    description: "Download our comprehensive guide to strategic HR planning.",
    date: "3 days ago",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 4,
    type: "update",
    icon: FileText,
    title: "Analytics Dashboard Update",
    description: "New visualization options and export features added to reports.",
    date: "1 week ago",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 5,
    type: "announcement",
    icon: Bell,
    title: "Upcoming Maintenance",
    description: "Scheduled maintenance on Dec 20th, 2AM-4AM UTC.",
    date: "1 week ago",
    color: "from-red-500 to-pink-500",
  },
];

export const NewsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">News & Resources</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {newsItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-64 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.type}
                      </span>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
