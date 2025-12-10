import { motion } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreResult {
  overallScore: number;
  contentScore: number;
  pronunciationScore?: number;
  fluencyScore?: number;
  grammarScore?: number;
  spellingScore?: number;
  feedback: string;
  suggestions: string[];
}

interface ScoreDisplayProps {
  scoreResult: ScoreResult;
  questionType: string;
  onRetry: () => void;
  onNext?: () => void;
  onBackToPractice: () => void;
}

const ScoreDisplay = ({
  scoreResult,
  questionType,
  onRetry,
  onNext,
  onBackToPractice,
}: ScoreDisplayProps) => {
  const scorePercentage = (scoreResult.overallScore / 90) * 100;
  const isGoodScore = scorePercentage >= 70;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 bg-card border-border">
          {/* Score Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isGoodScore ? "bg-green-500/20" : "bg-amber-500/20"
            }`}>
              {isGoodScore ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-amber-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {questionType} Complete
            </h2>
            <p className="text-muted-foreground">Here's your performance breakdown</p>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-foreground mb-2">
              {scoreResult.overallScore}<span className="text-2xl text-muted-foreground">/90</span>
            </div>
            <Progress value={scorePercentage} className="h-3 max-w-xs mx-auto" />
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">Content</p>
              <p className="text-xl font-semibold text-foreground">{scoreResult.contentScore}/90</p>
            </div>
            {scoreResult.pronunciationScore !== undefined && (
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">Pronunciation</p>
                <p className="text-xl font-semibold text-foreground">{scoreResult.pronunciationScore}/90</p>
              </div>
            )}
            {scoreResult.fluencyScore !== undefined && (
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">Fluency</p>
                <p className="text-xl font-semibold text-foreground">{scoreResult.fluencyScore}/90</p>
              </div>
            )}
            {scoreResult.grammarScore !== undefined && (
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">Grammar</p>
                <p className="text-xl font-semibold text-foreground">{scoreResult.grammarScore}/90</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <h3 className="font-medium text-foreground mb-2">Feedback</h3>
            <p className="text-muted-foreground">{scoreResult.feedback}</p>
          </div>

          {/* Suggestions */}
          {scoreResult.suggestions.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium text-foreground mb-2">Suggestions</h3>
              <ul className="space-y-2">
                {scoreResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={onBackToPractice} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Practice
            </Button>
            {onNext && (
              <Button onClick={onNext} className="gap-2">
                Next Question
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScoreDisplay;
