import { useState, useRef, useEffect } from "react";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import ScoreDisplay from "../../ScoreDisplay";

interface SelectMissingWordPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Select Missing Word",
  instructions: "Listen to the recording. At the end, a word or phrase is replaced by a beep. Select the option that best completes the recording.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  question: "The speaker was talking about environmental conservation. The final word was replaced. What word completes the sentence?",
  options: [
    { id: "a", text: "sustainability" },
    { id: "b", text: "pollution" },
    { id: "c", text: "destruction" },
    { id: "d", text: "development" },
  ],
  correctAnswer: "a",
  timeLimit: 60,
};

const SelectMissingWordPractice = ({ questionId }: SelectMissingWordPracticeProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
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

  const handleSubmit = () => {
    const calculatedScore = selectedAnswer === sampleQuestion.correctAnswer ? 90 : 0;
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedAnswer("");
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
          <p className="text-sm text-muted-foreground text-center">
            The recording ends with a beep replacing the final word
          </p>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-foreground font-medium mb-4">{sampleQuestion.question}</p>
          
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={isSubmitted}>
            <div className="grid grid-cols-2 gap-3">
              {sampleQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAnswer === option.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  } ${isSubmitted && option.id === sampleQuestion.correctAnswer ? "border-green-500 bg-green-500/10" : ""}`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
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
            disabled={!selectedAnswer || isSubmitted}
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

export default SelectMissingWordPractice;
