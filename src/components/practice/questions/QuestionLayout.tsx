import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuestionLayoutProps {
  title: string;
  questionType: string;
  section: string;
  instructions: string;
  timeLimit: number;
  timeRemaining: number;
  hasAiScoring: boolean;
  currentQuestion: number;
  totalQuestions: number;
  children: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

const QuestionLayout = ({
  title,
  questionType,
  section,
  instructions,
  timeLimit,
  timeRemaining,
  hasAiScoring,
  currentQuestion,
  totalQuestions,
  children,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
}: QuestionLayoutProps) => {
  const navigate = useNavigate();
  const progress = ((timeLimit - timeRemaining) / timeLimit) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/practice")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/practice" className="hover:text-foreground transition-colors">
                    Practice
                  </Link>
                  <span>›</span>
                  <span className="capitalize">{section}</span>
                  <span>›</span>
                  <span className="text-foreground">{questionType}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {hasAiScoring && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs font-medium">AI Scoring</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={timeRemaining < 30 ? "text-destructive font-medium" : "text-foreground"}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <Progress value={progress} className="h-1 mt-3" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-accent/20 text-accent capitalize">
                {section}
              </span>
              <span className="text-xs text-muted-foreground">
                Question {currentQuestion} of {totalQuestions}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{instructions}</p>
          </div>

          {/* Question Content */}
          <div className="mb-8">
            {children}
          </div>
        </motion.div>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentQuestion === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i + 1 === currentQuestion
                      ? "bg-accent"
                      : i + 1 < currentQuestion
                      ? "bg-accent/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {currentQuestion === totalQuestions ? (
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button onClick={onNext} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuestionLayout;
