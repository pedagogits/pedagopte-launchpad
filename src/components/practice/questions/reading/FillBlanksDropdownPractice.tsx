import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { readingQuestions } from "@/data/pteQuestions";

const FillBlanksDropdownPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const questions = readingQuestions.filter((q) => q.type === "fill-blanks-dropdown");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 120,
  });

  // Parse options for each blank
  const options = currentQuestion?.options?.map((opt) => opt.split("|")) || [];
  const correctAnswers = currentQuestion?.correctAnswer as string[] || [];

  // Split content by blanks
  const contentParts = currentQuestion?.content?.split(/___\d+___/) || [];

  const handleAnswerChange = (blankIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankIndex]: value }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswers({});
      setShowResults(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswers({});
      setShowResults(false);
      restart();
    }
  };

  const getScore = () => {
    let correct = 0;
    correctAnswers.forEach((answer, index) => {
      if (answers[index] === answer) correct++;
    });
    return correct;
  };

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Fill in the Blanks"}
      questionType="Reading & Writing: Fill in the Blanks"
      section="reading"
      instructions={currentQuestion?.instructions || "Select the appropriate word for each blank."}
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
        <Card className="p-6 bg-card border-border">
          <div className="text-lg leading-relaxed text-foreground">
            {contentParts.map((part, index) => (
              <span key={index}>
                {part}
                {index < options.length && (
                  <span className="inline-block mx-1 align-middle">
                    <Select
                      value={answers[index] || ""}
                      onValueChange={(value) => handleAnswerChange(index, value)}
                      disabled={showResults || isTimeUp}
                    >
                      <SelectTrigger className={`w-[140px] inline-flex ${
                        showResults
                          ? answers[index] === correctAnswers[index]
                            ? "border-green-500 bg-green-500/10"
                            : "border-destructive bg-destructive/10"
                          : ""
                      }`}>
                        <SelectValue placeholder={`Blank ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options[index]?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </span>
                )}
              </span>
            ))}
          </div>
        </Card>

        {showResults && (
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">
              Results: {getScore()} / {correctAnswers.length} correct
            </h3>
            <div className="space-y-2">
              {correctAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded ${
                    answers[index] === answer ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"
                  }`}>
                    Blank {index + 1}:
                  </span>
                  <span className="text-muted-foreground">Your answer: {answers[index] || "—"}</span>
                  {answers[index] !== answer && (
                    <span className="text-green-500">Correct: {answer}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => { setAnswers({}); setShowResults(false); restart(); }}>
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

export default FillBlanksDropdownPractice;
