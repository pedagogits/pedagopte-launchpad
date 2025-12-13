import { useState, useRef, useEffect } from "react";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import ScoreDisplay from "../../ScoreDisplay";

interface HighlightIncorrectWordsPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Highlight Incorrect Words",
  instructions: "Listen to the recording and click on the words that differ from what you hear. The text contains some errors.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  words: [
    { id: 0, text: "The", isIncorrect: false },
    { id: 1, text: "research", isIncorrect: false },
    { id: 2, text: "team", isIncorrect: false },
    { id: 3, text: "discovered", isIncorrect: true, correctWord: "found" },
    { id: 4, text: "that", isIncorrect: false },
    { id: 5, text: "ocean", isIncorrect: false },
    { id: 6, text: "temperatures", isIncorrect: false },
    { id: 7, text: "have", isIncorrect: false },
    { id: 8, text: "decreased", isIncorrect: true, correctWord: "increased" },
    { id: 9, text: "significantly", isIncorrect: false },
    { id: 10, text: "over", isIncorrect: false },
    { id: 11, text: "the", isIncorrect: false },
    { id: 12, text: "past", isIncorrect: false },
    { id: 13, text: "century.", isIncorrect: true, correctWord: "decade." },
    { id: 14, text: "This", isIncorrect: false },
    { id: 15, text: "affects", isIncorrect: false },
    { id: 16, text: "marine", isIncorrect: false },
    { id: 17, text: "life", isIncorrect: false },
    { id: 18, text: "globally.", isIncorrect: false },
  ],
  timeLimit: 120,
};

const HighlightIncorrectWordsPractice = ({ questionId }: HighlightIncorrectWordsPracticeProps) => {
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { timeRemaining, formatTime, resetTimer } = useQuestionTimer({
    initialTime: sampleQuestion.timeLimit,
    autoStart: hasPlayed,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setAudioProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasPlayed(true);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleWord = (id: number) => {
    if (isSubmitted) return;
    setSelectedWords(prev => 
      prev.includes(id) 
        ? prev.filter(w => w !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const incorrectWordIds = sampleQuestion.words.filter(w => w.isIncorrect).map(w => w.id);
    const correctSelections = selectedWords.filter(id => incorrectWordIds.includes(id)).length;
    const wrongSelections = selectedWords.filter(id => !incorrectWordIds.includes(id)).length;
    const calculatedScore = Math.max(0, Math.round(((correctSelections - wrongSelections) / incorrectWordIds.length) * 90));
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedWords([]);
    setScore(null);
    setIsSubmitted(false);
    setHasPlayed(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    resetTimer();
  };

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      instructions={sampleQuestion.instructions}
      timeRemaining={formatTime(timeRemaining)}
      currentQuestion={1}
      totalQuestions={1}
    >
      <div className="space-y-6">
        <audio ref={audioRef} src={sampleQuestion.audioUrl} preload="metadata" />
        
        {/* Audio Player */}
        <div className="bg-secondary rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlay}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              disabled={hasPlayed && !isPlaying}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <div className="flex-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Text with Clickable Words */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Click on words that differ from the recording:</p>
          <div className="flex flex-wrap gap-1 text-lg leading-relaxed">
            {sampleQuestion.words.map((word) => {
              const isSelected = selectedWords.includes(word.id);
              const showCorrect = isSubmitted && word.isIncorrect;
              const showWrong = isSubmitted && isSelected && !word.isIncorrect;
              
              return (
                <span
                  key={word.id}
                  onClick={() => toggleWord(word.id)}
                  className={`px-1 py-0.5 rounded cursor-pointer transition-all ${
                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
                  } ${showCorrect ? "bg-green-500/20 text-green-500 line-through" : ""} 
                  ${showWrong ? "bg-destructive/20 text-destructive" : ""}`}
                >
                  {word.text}
                  {showCorrect && word.correctWord && (
                    <span className="text-green-500 ml-1 no-underline">({word.correctWord})</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleRetry}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button 
            variant="hero" 
            onClick={handleSubmit}
            disabled={isSubmitted}
          >
            Submit Answer
          </Button>
        </div>

        {isSubmitted && score !== null && (
          <ScoreDisplay score={score} maxScore={90} showFeedback />
        )}
      </div>
    </QuestionLayout>
  );
};

export default HighlightIncorrectWordsPractice;
