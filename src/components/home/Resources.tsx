import { FileText, Video, BookOpen, Download, FolderOpen, GraduationCap, FileSpreadsheet, Presentation, ArrowRight, ExternalLink } from "lucide-react";

const resources = [
  { 
    id: 1,
    title: "HR Policy Templates", 
    description: "Ready-to-use policy documents",
    type: "Templates", 
    count: 24, 
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  { 
    id: 2,
    title: "Training Videos", 
    description: "On-demand learning content",
    type: "Videos", 
    count: 15, 
    icon: Video,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  { 
    id: 3,
    title: "Best Practices Guide", 
    description: "Industry standards & frameworks",
    type: "Guides", 
    count: 12, 
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  { 
    id: 4,
    title: "Compliance Checklists", 
    description: "Regulatory compliance tools",
    type: "Checklists", 
    count: 18, 
    icon: FileSpreadsheet,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  { 
    id: 5,
    title: "Presentation Decks", 
    description: "Executive presentations",
    type: "Presentations", 
    count: 9, 
    icon: Presentation,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  { 
    id: 6,
    title: "Learning Courses", 
    description: "Professional development",
    type: "Courses", 
    count: 6, 
    icon: GraduationCap,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
];

export function Resources() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Resource Library</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 group">
          Browse All 
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <div 
              key={resource.id} 
              className="bg-card border border-border rounded-xl p-3 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${resource.bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className={`w-5 h-5 ${resource.color}`} />
              </div>
              <h4 className="text-xs font-semibold text-foreground mb-0.5 line-clamp-1">{resource.title}</h4>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mb-2">{resource.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-primary">{resource.count} items</span>
                <Download className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
