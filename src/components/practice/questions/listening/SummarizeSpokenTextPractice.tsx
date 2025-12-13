import { useState, useRef, useEffect } from "react";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import ScoreDisplay from "../../ScoreDisplay";

interface SummarizeSpokenTextPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Summarize Spoken Text",
  instructions: "Listen to the audio and write a summary of what you heard. You have 10 minutes to complete your response. Your response should be 50-70 words.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  transcript: "Climate change is affecting agricultural patterns worldwide. Scientists have observed that rising temperatures are causing shifts in growing seasons and affecting crop yields. Farmers are adapting by changing planting schedules and adopting drought-resistant varieties.",
  timeLimit: 600,
};

const SummarizeSpokenTextPractice = ({ questionId }: SummarizeSpokenTextPracticeProps) => {
  const [response, setResponse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { timeRemaining, isExpired, formatTime, resetTimer } = useQuestionTimer({
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

  const wordCount = response.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSubmit = () => {
    const mockScore = Math.min(90, Math.max(40, 50 + wordCount));
    setScore(mockScore);
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setResponse("");
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
          {hasPlayed && (
            <p className="text-sm text-muted-foreground text-center">
              Audio playback complete. You may only listen once.
            </p>
          )}
        </div>

        {/* Writing Area */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Summary</span>
            <span className={`${wordCount < 50 || wordCount > 70 ? "text-destructive" : "text-accent"}`}>
              {wordCount}/50-70 words
            </span>
          </div>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Start writing your summary here..."
            className="min-h-[200px] bg-secondary border-border"
            disabled={isSubmitted}
          />
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
            disabled={wordCount < 10 || isSubmitted}
          >
            Submit Answer
          </Button>
        </div>

        {/* Score Display */}
        {isSubmitted && score !== null && (
          <ScoreDisplay score={score} maxScore={90} showFeedback />
        )}
      </div>
    </QuestionLayout>
  );
};

export default SummarizeSpokenTextPractice;
