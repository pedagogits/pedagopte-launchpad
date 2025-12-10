import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { readingQuestions } from "@/data/pteQuestions";

const FillBlanksDragPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  
  const questions = readingQuestions.filter((q) => q.type === "fill-blanks-drag");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 120,
  });

  const options = currentQuestion?.options || [];
  const correctAnswers = (currentQuestion?.correctAnswer as string[]) || [];

  // Initialize available words
  useState(() => {
    if (availableWords.length === 0 && options.length > 0) {
      setAvailableWords([...options]);
    }
  });

  // Split content by blanks
  const contentParts = currentQuestion?.content?.split(/___\d+___/) || [];

  const handleWordClick = (word: string, blankIndex: number) => {
    if (showResults || isTimeUp) return;
    
    // If blank already has a word, return it to available
    if (answers[blankIndex]) {
      setAvailableWords((prev) => [...prev, answers[blankIndex]]);
    }
    
    setAnswers((prev) => ({ ...prev, [blankIndex]: word }));
    setAvailableWords((prev) => prev.filter((w) => w !== word));
  };

  const handleRemoveWord = (blankIndex: number) => {
    if (showResults || isTimeUp) return;
    if (answers[blankIndex]) {
      setAvailableWords((prev) => [...prev, answers[blankIndex]]);
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[blankIndex];
        return newAnswers;
      });
    }
  };

  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswers({});
      setAvailableWords([...options]);
      setShowResults(false);
      setSelectedWord(null);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswers({});
      setAvailableWords([...options]);
      setShowResults(false);
      setSelectedWord(null);
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
      title={currentQuestion?.title || "Fill in the Blanks (Drag & Drop)"}
      questionType="Reading: Fill in the Blanks"
      section="reading"
      instructions={currentQuestion?.instructions || "Drag words to fill in the blanks."}
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
        {/* Available Words */}
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Click a word, then click a blank to place it:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, index) => (
              <Badge
                key={`${word}-${index}`}
                variant={selectedWord === word ? "default" : "secondary"}
                className={`cursor-pointer text-sm py-1.5 px-3 ${
                  selectedWord === word ? "ring-2 ring-accent" : ""
                }`}
                onClick={() => setSelectedWord(word)}
              >
                {word}
              </Badge>
            ))}
            {availableWords.length === 0 && (
              <p className="text-sm text-muted-foreground">All words placed</p>
            )}
          </div>
        </Card>

        {/* Text with Blanks */}
        <Card className="p-6 bg-card border-border">
          <div className="text-lg leading-relaxed text-foreground">
            {contentParts.map((part, index) => (
              <span key={index}>
                {part}
                {index < correctAnswers.length && (
                  <span
                    className={`inline-block mx-1 min-w-[100px] px-3 py-1 rounded border-2 border-dashed cursor-pointer transition-all ${
                      showResults
                        ? answers[index] === correctAnswers[index]
                          ? "border-green-500 bg-green-500/10"
                          : "border-destructive bg-destructive/10"
                        : answers[index]
                        ? "border-accent bg-accent/10"
                        : "border-muted hover:border-accent"
                    }`}
                    onClick={() => {
                      if (selectedWord) {
                        handleWordClick(selectedWord, index);
                        setSelectedWord(null);
                      } else if (answers[index]) {
                        handleRemoveWord(index);
                      }
                    }}
                  >
                    {answers[index] || <span className="text-muted-foreground">___</span>}
                  </span>
                )}
              </span>
            ))}
          </div>
        </Card>

        {showResults && (
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold text-foreground mb-4">
              Score: {getScore()} / {correctAnswers.length} correct
            </h3>
            <div className="space-y-2 mb-4">
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setAnswers({});
                setAvailableWords([...options]);
                setShowResults(false);
                setSelectedWord(null);
                restart();
              }}>
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

export default FillBlanksDragPractice;
