import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { useAiScoring } from "@/hooks/useAiScoring";
import { writingQuestions } from "@/data/pteQuestions";
import ScoreDisplay from "../../ScoreDisplay";

const SummarizeWrittenTextPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [response, setResponse] = useState("");
  
  const questions = writingQuestions.filter((q) => q.type === "summarize-written-text");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 600,
  });

  const { isScoring, scoreResult, scoreResponse, resetScore } = useAiScoring();

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    await scoreResponse({
      questionType: "summarize-written-text",
      questionText: currentQuestion.content,
      userResponse: response,
    });
    setShowScore(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResponse("");
      resetScore();
      setShowScore(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResponse("");
      resetScore();
      setShowScore(false);
      restart();
    }
  };

  const handleRetry = () => {
    setResponse("");
    resetScore();
    setShowScore(false);
    restart();
  };

  if (showScore && scoreResult) {
    return (
      <ScoreDisplay
        scoreResult={scoreResult}
        questionType="Summarize Written Text"
        onRetry={handleRetry}
        onNext={currentIndex < questions.length - 1 ? handleNext : undefined}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Summarize Written Text"}
      questionType="Summarize Written Text"
      section="writing"
      instructions={currentQuestion?.instructions || "Summarize the text in one sentence."}
      timeLimit={currentQuestion?.timeLimit || 600}
      timeRemaining={timeRemaining}
      hasAiScoring={true}
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isSubmitting={isScoring}
    >
      <div className="space-y-6">
        {/* Source Text */}
        <Card className="p-6 bg-card border-border">
          <h3 className="font-medium text-foreground mb-3">Read the following passage:</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {currentQuestion?.content}
          </p>
        </Card>

        {/* Response Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Your summary (one sentence, 5-75 words):
            </label>
            <span className={`text-sm ${wordCount < 5 || wordCount > 75 ? "text-destructive" : "text-muted-foreground"}`}>
              {wordCount} words
            </span>
          </div>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your summary in a single sentence..."
            className="min-h-[150px] resize-none"
            disabled={isTimeUp}
          />
          <p className="text-xs text-muted-foreground">
            Tip: Use a single sentence with a main clause and appropriate connecting words.
          </p>
        </div>
      </div>
    </QuestionLayout>
  );
};

export default SummarizeWrittenTextPractice;
