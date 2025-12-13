import { useState, useRef, useEffect } from "react";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import ScoreDisplay from "../../ScoreDisplay";

interface MCMultipleListeningPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Multiple Choice - Multiple Answers",
  instructions: "Listen to the recording and select all the correct answers.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  question: "According to the speaker, which of the following are benefits of renewable energy?",
  options: [
    { id: "a", text: "Reduced greenhouse gas emissions" },
    { id: "b", text: "Lower long-term energy costs" },
    { id: "c", text: "Immediate elimination of all pollution" },
    { id: "d", text: "Energy independence for countries" },
    { id: "e", text: "No need for energy storage solutions" },
  ],
  correctAnswers: ["a", "b", "d"],
  timeLimit: 120,
};

const MCMultipleListeningPractice = ({ questionId }: MCMultipleListeningPracticeProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
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

  const toggleAnswer = (id: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const correct = sampleQuestion.correctAnswers.filter(a => selectedAnswers.includes(a)).length;
    const incorrect = selectedAnswers.filter(a => !sampleQuestion.correctAnswers.includes(a)).length;
    const calculatedScore = Math.max(0, (correct - incorrect) / sampleQuestion.correctAnswers.length * 90);
    setScore(Math.round(calculatedScore));
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedAnswers([]);
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

        {/* Question */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-foreground font-medium mb-4">{sampleQuestion.question}</p>
          
          <div className="space-y-3">
            {sampleQuestion.options.map((option) => (
              <div
                key={option.id}
                onClick={() => toggleAnswer(option.id)}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAnswers.includes(option.id)
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                } ${isSubmitted && sampleQuestion.correctAnswers.includes(option.id) ? "border-green-500 bg-green-500/10" : ""}`}
              >
                <Checkbox 
                  checked={selectedAnswers.includes(option.id)}
                  disabled={isSubmitted}
                />
                <span className="text-foreground">{option.text}</span>
              </div>
            ))}
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
            disabled={selectedAnswers.length === 0 || isSubmitted}
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

export default MCMultipleListeningPractice;
