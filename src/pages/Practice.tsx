import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, PenLine, BookOpen, Headphones, CheckCircle } from "lucide-react";
import PromoBanner from "@/components/practice/PromoBanner";
import PracticeSidebar from "@/components/practice/PracticeSidebar";
import QuestionTypeCard from "@/components/practice/QuestionTypeCard";
import { questionTypeInfo } from "@/data/pteQuestions";

const sections = [
  { id: "speaking", label: "Speaking", icon: Mic },
  { id: "writing", label: "Writing", icon: PenLine },
  { id: "reading", label: "Reading", icon: BookOpen },
  { id: "listening", label: "Listening", icon: Headphones },
];

const questionTypes = {
  speaking: [
    { id: "read-aloud", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-accent" },
    { id: "repeat-sentence", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-accent" },
    { id: "describe-image", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-amber-500" },
    { id: "retell-lecture", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-amber-500" },
    { id: "answer-short-question", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-green-500" },
    { id: "respond-situation", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-rose-500", isNew: true },
    { id: "summarize-discussion", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-rose-500", isNew: true },
  ],
  writing: [
    { id: "summarize-written-text", icon: <PenLine className="w-6 h-6 text-white" />, color: "bg-blue-500" },
    { id: "essay", icon: <PenLine className="w-6 h-6 text-white" />, color: "bg-blue-500" },
  ],
  reading: [
    { id: "fill-blanks-dropdown", icon: <BookOpen className="w-6 h-6 text-white" />, color: "bg-purple-500" },
    { id: "mc-multiple-reading", icon: <BookOpen className="w-6 h-6 text-white" />, color: "bg-purple-500" },
    { id: "reorder-paragraphs", icon: <BookOpen className="w-6 h-6 text-white" />, color: "bg-purple-500" },
    { id: "fill-blanks-drag", icon: <BookOpen className="w-6 h-6 text-white" />, color: "bg-purple-500" },
    { id: "mc-single-reading", icon: <BookOpen className="w-6 h-6 text-white" />, color: "bg-purple-500" },
  ],
  listening: [
    { id: "summarize-spoken-text", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "mc-multiple-listening", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "fill-blanks-listening", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "highlight-correct-summary", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "mc-single-listening", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "select-missing-word", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "highlight-incorrect-words", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
    { id: "write-from-dictation", icon: <Headphones className="w-6 h-6 text-white" />, color: "bg-teal-500" },
  ],
};

const Practice = () => {
  const [examType, setExamType] = useState<"Academic" | "Core">("Academic");
  const [activeSection, setActiveSection] = useState("speaking");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PromoBanner />
      <div className="flex flex-1">
        <PracticeSidebar examType={examType} onExamTypeChange={setExamType} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span>Dashboard</span>
              <span>›</span>
              <span>Practice</span>
              <span>›</span>
              <span>{examType}</span>
              <span>›</span>
              <span className="text-foreground capitalize">{activeSection}</span>
            </div>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                PTE {examType}: {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Practice Questions
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome to PedagogistPTE's PTE practice test hub. Prepare for the PTE {examType} with targeted online PTE practice tests across all sections.
              </p>
            </motion.div>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-8 border-b border-border">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                    activeSection === section.id
                      ? "text-accent border-accent"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>

            {/* Question Type Cards */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-4 mb-8"
            >
              {questionTypes[activeSection as keyof typeof questionTypes].map((qt) => {
                const info = questionTypeInfo[qt.id];
                return (
                  <QuestionTypeCard
                    key={qt.id}
                    id={qt.id}
                    name={info.name}
                    description={info.description}
                    icon={qt.icon}
                    hasAiScoring={info.hasAiScoring}
                    isNew={"isNew" in qt ? qt.isNew : false}
                    color={qt.color}
                  />
                );
              })}
            </motion.div>

            {/* Practice Tips */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((section) => (
                <div key={section.id} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">PTE {section.label} Practice</h4>
                    <p className="text-sm text-muted-foreground">Practice {section.label.toLowerCase()} tasks to build confidence.</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-8">
              Prepare for <span className="text-accent font-medium">PTE Core</span> or <span className="text-accent font-medium">PTE Academic</span> with our free practice tests. Start now and get ready for success!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Practice;
