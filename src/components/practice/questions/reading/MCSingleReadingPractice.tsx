import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { readingQuestions } from "@/data/pteQuestions";

const MCSingleReadingPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  
  const questions = readingQuestions.filter((q) => q.type === "mc-single-reading");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 90,
  });

  const options = currentQuestion?.options || [];
  const correctAnswerIndex = ((currentQuestion?.correctAnswer as number[]) || [0])[0];

  // Split content to get passage and question
  const [passage, question] = currentQuestion?.content?.split("\n\nQuestion:") || ["", ""];

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
      setShowResults(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer("");
      setShowResults(false);
      restart();
    }
  };

  const isCorrect = parseInt(selectedAnswer) === correctAnswerIndex;

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Multiple Choice (Single Answer)"}
      questionType="Multiple Choice, Single Answer"
      section="reading"
      instructions={currentQuestion?.instructions || "Select the correct answer."}
      timeLimit={currentQuestion?.timeLimit || 90}
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
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={showResults || isTimeUp}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                showResults
                  ? index === correctAnswerIndex
                    ? "border-green-500 bg-green-500/10"
                    : parseInt(selectedAnswer) === index
                    ? "border-destructive bg-destructive/10"
                    : "border-border bg-card"
                  : parseInt(selectedAnswer) === index
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/50"
              }`}
              onClick={() => !showResults && !isTimeUp && setSelectedAnswer(index.toString())}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showResults && (
          <Card className="p-6 bg-card border-border">
            <h3 className={`font-semibold mb-4 ${isCorrect ? "text-green-500" : "text-destructive"}`}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </h3>
            {!isCorrect && (
              <p className="text-sm text-muted-foreground mb-4">
                Correct answer: {options[correctAnswerIndex]}
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setSelectedAnswer(""); setShowResults(false); restart(); }}>
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

export default MCSingleReadingPractice;
