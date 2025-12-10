import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, ArrowRight } from "lucide-react";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { readingQuestions } from "@/data/pteQuestions";

const ReorderParagraphsPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [orderedItems, setOrderedItems] = useState<number[]>([]);
  const [availableItems, setAvailableItems] = useState<number[]>([]);
  
  const questions = readingQuestions.filter((q) => q.type === "reorder-paragraphs");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 120,
  });

  // Parse paragraphs from JSON content
  const paragraphs: string[] = currentQuestion?.content ? JSON.parse(currentQuestion.content) : [];
  const correctOrder = (currentQuestion?.correctAnswer as number[]) || [];

  // Initialize available items if empty
  useState(() => {
    if (availableItems.length === 0 && paragraphs.length > 0) {
      // Shuffle paragraphs
      const shuffled = [...Array(paragraphs.length).keys()].sort(() => Math.random() - 0.5);
      setAvailableItems(shuffled);
    }
  });

  const handleSelectItem = (index: number) => {
    if (showResults || isTimeUp) return;
    setAvailableItems((prev) => prev.filter((i) => i !== index));
    setOrderedItems((prev) => [...prev, index]);
  };

  const handleRemoveItem = (position: number) => {
    if (showResults || isTimeUp) return;
    const item = orderedItems[position];
    setOrderedItems((prev) => prev.filter((_, i) => i !== position));
    setAvailableItems((prev) => [...prev, item]);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const shuffled = [...Array(paragraphs.length).keys()].sort(() => Math.random() - 0.5);
      setAvailableItems(shuffled);
      setOrderedItems([]);
      setShowResults(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const shuffled = [...Array(paragraphs.length).keys()].sort(() => Math.random() - 0.5);
      setAvailableItems(shuffled);
      setOrderedItems([]);
      setShowResults(false);
      restart();
    }
  };

  const getScore = () => {
    let score = 0;
    for (let i = 0; i < orderedItems.length - 1; i++) {
      const currentPos = correctOrder.indexOf(orderedItems[i]);
      const nextPos = correctOrder.indexOf(orderedItems[i + 1]);
      if (nextPos === currentPos + 1) score++;
    }
    return score;
  };

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Re-order Paragraphs"}
      questionType="Re-order Paragraphs"
      section="reading"
      instructions={currentQuestion?.instructions || "Arrange the paragraphs in the correct order."}
      timeLimit={currentQuestion?.timeLimit || 120}
      timeRemaining={timeRemaining}
      hasAiScoring={false}
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Paragraphs */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground mb-3">Source (click to add):</h3>
          {availableItems.map((index) => (
            <Card
              key={index}
              className="p-4 bg-card border-border cursor-pointer hover:border-accent transition-colors"
              onClick={() => handleSelectItem(index)}
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">{paragraphs[index]}</p>
              </div>
            </Card>
          ))}
          {availableItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              All paragraphs arranged
            </p>
          )}
        </div>

        {/* Ordered Paragraphs */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground mb-3">Your Order (click to remove):</h3>
          {orderedItems.map((index, position) => (
            <Card
              key={`ordered-${position}`}
              className={`p-4 cursor-pointer transition-colors ${
                showResults
                  ? correctOrder[position] === index
                    ? "border-green-500 bg-green-500/10"
                    : "border-destructive bg-destructive/10"
                  : "border-accent bg-accent/10 hover:bg-accent/20"
              }`}
              onClick={() => handleRemoveItem(position)}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                  {position + 1}
                </span>
                <p className="text-sm text-foreground">{paragraphs[index]}</p>
              </div>
            </Card>
          ))}
          {orderedItems.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Click paragraphs on the left to add them here
              </p>
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <Card className="p-6 bg-card border-border mt-6">
          <h3 className="font-semibold text-foreground mb-4">
            Score: {getScore()} / {paragraphs.length - 1} pairs correct
          </h3>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Correct order:</p>
            <div className="flex flex-wrap gap-2">
              {correctOrder.map((index, pos) => (
                <span key={pos} className="flex items-center gap-1 text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
                    {pos + 1}
                  </span>
                  {pos < correctOrder.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              const shuffled = [...Array(paragraphs.length).keys()].sort(() => Math.random() - 0.5);
              setAvailableItems(shuffled);
              setOrderedItems([]);
              setShowResults(false);
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
    </QuestionLayout>
  );
};

export default ReorderParagraphsPractice;
