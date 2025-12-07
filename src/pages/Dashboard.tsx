import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FileText,
  Clock,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  ChevronDown,
  Star,
  Target,
  Trophy,
  Zap,
  Play,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "Practice", active: false },
  { icon: FileText, label: "Mock Tests", active: false, hasDropdown: true },
  { icon: Clock, label: "Test History", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Brain, label: "AI Coach", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const stats = [
  { label: "Practice Questions", value: "1,234", icon: BookOpen, color: "text-accent" },
  { label: "Mock Tests Taken", value: "18", icon: FileText, color: "text-primary" },
  { label: "Average Score", value: "72", icon: Target, color: "text-yellow-400" },
  { label: "Study Streak", value: "12 days", icon: Zap, color: "text-green-400" },
];

const quickActions = [
  { title: "Speaking Practice", desc: "Practice speaking tasks", icon: Play, color: "from-primary to-purple-500" },
  { title: "Writing Tasks", desc: "Improve your writing", icon: FileText, color: "from-accent to-cyan-500" },
  { title: "Reading Drills", desc: "Reading comprehension", icon: BookOpen, color: "from-yellow-500 to-orange-500" },
  { title: "Full Mock Test", desc: "Simulate real exam", icon: Clock, color: "from-green-500 to-emerald-500" },
];

const Dashboard = () => {
  const [examType, setExamType] = useState<"Academic" | "Core">("Academic");

  return (
    <div className="min-h-screen bg-background dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">PedagogistPTE</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Exam Type
            </span>
            <div className="mt-2 flex gap-2">
              {(["Academic", "Core"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setExamType(type)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    examType === type
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 glass border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John!</p>
            </div>
            <Button variant="hero">
              <Star className="w-4 h-4" />
              Upgrade to VIP
            </Button>
          </div>
        </header>

        <div className="p-8">
          {/* VIP Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-accent p-6 mb-8"
          >
            <div className="relative z-10">
              <span className="text-sm font-medium text-primary-foreground/80">
                Your Practice Dashboard
              </span>
              <h2 className="text-2xl font-bold text-primary-foreground mt-1">
                PedagogistPTE VIP
              </h2>
              <p className="text-primary-foreground/80 mt-2 mb-4 max-w-md">
                Get full access to all features and tools to help you prepare for
                the PTE exam.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Full Access", "AI Support", "Study Tools", "Study Report", "Personalized Feedback"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm"
                  >
                    <Star className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Get VIP Now
              </Button>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary" />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="group bg-card border border-border rounded-xl p-6 text-left hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mock Test CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Take Free Mock Test with AI Scoring
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent" />
                    AI score + personalized feedback
                  </span>
                  <span>Total 19-21 questions</span>
                  <span>Estimated time 30+ minutes</span>
                </div>
              </div>
            </div>
            <Button variant="hero" size="lg">
              Try Mini Mock Test
              <Play className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;