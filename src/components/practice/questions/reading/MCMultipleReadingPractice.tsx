import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { readingQuestions } from "@/data/pteQuestions";

const MCMultipleReadingPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  
  const questions = readingQuestions.filter((q) => q.type === "mc-multiple-reading");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 120,
  });

  const options = currentQuestion?.options || [];
  const correctAnswers = (currentQuestion?.correctAnswer as number[]) || [];

  // Split content to get passage and question
  const [passage, question] = currentQuestion?.content?.split("\n\nQuestion:") || ["", ""];

  const handleToggleAnswer = (index: number) => {
    setSelectedAnswers((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswers([]);
      setShowResults(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswers([]);
      setShowResults(false);
      restart();
    }
  };

  const getScore = () => {
    const correctSelected = selectedAnswers.filter((a) => correctAnswers.includes(a)).length;
    const incorrectSelected = selectedAnswers.filter((a) => !correctAnswers.includes(a)).length;
    return Math.max(0, correctSelected - incorrectSelected);
  };

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Multiple Choice (Multiple Answers)"}
      questionType="Multiple Choice, Multiple Answers"
      section="reading"
      instructions={currentQuestion?.instructions || "Select all correct answers."}
      timeLimit={currentQuestion?.timeLimit || 120}
      timeRemaining={timeRemaining}
      hasAiScoring={false}
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        {/* Passage */}
        <Card className="p-6 bg-card border-border">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {passage}
          </p>
        </Card>

        {/* Question */}
        {question && (
          <p className="font-medium text-foreground">{question.trim()}</p>
        )}

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                showResults
                  ? correctAnswers.includes(index)
                    ? "border-green-500 bg-green-500/10"
                    : selectedAnswers.includes(index)
                    ? "border-destructive bg-destructive/10"
                    : "border-border bg-card"
                  : selectedAnswers.includes(index)
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/50"
              }`}
              onClick={() => !showResults && !isTimeUp && handleToggleAnswer(index)}
            >
              <Checkbox
                checked={selectedAnswers.includes(index)}
                disabled={showResults || isTimeUp}
              />
              <span className="text-foreground">{option}</span>
            </div>
          ))}
        </div>

        {showResults && (
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">
              Score: {getScore()} / {correctAnswers.length}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Correct answers: {correctAnswers.map((i) => options[i]).join(", ")}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setSelectedAnswers([]); setShowResults(false); restart(); }}>
                Try Again
              </Button>
              <Button onClick={() => navigate("/practice")}>
                Back to Practice
              </Button>
            </div>
          </Card>
        )}
      </div>
    </QuestionLayout>
  );
};

export default MCMultipleReadingPractice;
