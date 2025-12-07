import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  FileEdit,
  Book,
  Wand2,
  MessageCircle,
  BookMarked,
  Users,
  Headphones,
  HelpCircle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  examType: "Academic" | "Core";
  onExamTypeChange: (type: "Academic" | "Core") => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Practice", path: "/practice", active: true },
  {
    icon: FileText,
    label: "Mock Tests",
    path: "/mock-tests",
    hasDropdown: true,
    subItems: [
      { label: "Full Tests", path: "/mock-tests/full" },
      { label: "Section Tests", path: "/mock-tests/section" },
      { label: "Test History", path: "/mock-tests/history" },
    ],
  },
  { icon: FileEdit, label: "Templates", path: "/templates" },
  { icon: Book, label: "Study Center", path: "/study-center" },
  { icon: Wand2, label: "Smart Prep", path: "/smart-prep" },
  { icon: MessageCircle, label: "AI Coach", path: "/ai-coach" },
  { icon: BookMarked, label: "Vocab Books", path: "/vocab" },
  { icon: Users, label: "Shadowing", path: "/shadowing" },
  { icon: Headphones, label: "PedagogistPTE MP3", path: "/mp3" },
  { icon: HelpCircle, label: "Support", path: "/support" },
];

const PracticeSidebar = ({ examType, onExamTypeChange }: SidebarProps) => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>("Mock Tests");

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">PedagogistPTE</span>
        </Link>
      </div>

      {/* Exam Type Selector */}
      <div className="p-4 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Exam Type
        </span>
        <div className="mt-2 flex gap-2">
          {(["Academic", "Core"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onExamTypeChange(type)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                examType === type
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.label}>
            <Link
              to={item.path}
              onClick={(e) => {
                if (item.hasDropdown) {
                  e.preventDefault();
                  setExpandedItem(expandedItem === item.label ? null : item.label);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors",
                location.pathname === item.path || item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.hasDropdown && (
                expandedItem === item.label ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )
              )}
            </Link>

            {/* Subitems */}
            {item.subItems && expandedItem === item.label && (
              <div className="ml-6 mb-2">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.label}
                    to={sub.path}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* VIP CTA */}
      <div className="p-4 border-t border-border">
        <Link
          to="/pricing"
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Flame className="w-5 h-5" />
          Get VIP
        </Link>
      </div>
    </aside>
  );
};

export default PracticeSidebar;
