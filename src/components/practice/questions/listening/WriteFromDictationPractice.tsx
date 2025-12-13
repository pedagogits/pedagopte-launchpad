import { useState, useRef, useEffect } from "react";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import ScoreDisplay from "../../ScoreDisplay";

interface WriteFromDictationPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Write from Dictation",
  instructions: "Listen to the recording and type exactly what you hear. You will hear the sentence only once.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  correctSentence: "The university library will be closed for renovations during the summer break.",
  timeLimit: 60,
};

const WriteFromDictationPractice = ({ questionId }: WriteFromDictationPracticeProps) => {
  const [response, setResponse] = useState("");
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

  const calculateScore = () => {
    const correctWords = sampleQuestion.correctSentence.toLowerCase().split(/\s+/);
    const userWords = response.toLowerCase().trim().split(/\s+/);
    
    let matchCount = 0;
    correctWords.forEach(word => {
      const cleanWord = word.replace(/[.,!?]/g, "");
      const found = userWords.find(uw => uw.replace(/[.,!?]/g, "") === cleanWord);
      if (found) matchCount++;
    });
    
    return Math.round((matchCount / correctWords.length) * 90);
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
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

        {/* Input Area */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Type the sentence you heard:</p>
          <Input
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type the sentence here..."
            className="text-lg h-14"
            disabled={isSubmitted}
          />
        </div>

        {/* Show Correct Answer */}
        {isSubmitted && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Correct sentence:</p>
            <p className="text-green-500 font-medium">{sampleQuestion.correctSentence}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleRetry}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
          <Button 
            variant="hero" 
            onClick={handleSubmit}
            disabled={!response.trim() || isSubmitted}
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

export default WriteFromDictationPractice;
