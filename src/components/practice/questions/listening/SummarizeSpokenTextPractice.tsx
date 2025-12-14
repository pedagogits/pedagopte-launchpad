import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionLayout from "../QuestionLayout";
import ScoreDisplay from "../../ScoreDisplay";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

interface SummarizeSpokenTextPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Summarize Spoken Text",
  instructions: "Listen to the audio and write a summary of what you heard. You have 10 minutes to complete your response. Your response should be 50-70 words.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  timeLimit: 600,
};

const SummarizeSpokenTextPractice = ({ questionId }: SummarizeSpokenTextPracticeProps) => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    overallScore: number;
    contentScore: number;
    grammarScore?: number;
    spellingScore?: number;
    feedback: string;
    suggestions: string[];
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { timeRemaining, reset } = useQuestionTimer({
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
    setScoreResult({
      overallScore: mockScore,
      contentScore: mockScore,
      grammarScore: Math.floor(mockScore * 0.9),
      spellingScore: Math.floor(mockScore * 0.95),
      feedback: mockScore >= 63 
        ? "Good summary! You captured the main points effectively."
        : "Try to include more key points from the recording.",
      suggestions: mockScore < 63 
        ? ["Include the main topic in your opening sentence", "Summarize key supporting details"]
        : [],
    });
    setShowScore(true);
  };

  const handleRetry = () => {
    setResponse("");
    setShowScore(false);
    setScoreResult(null);
    setHasPlayed(false);
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    reset();
  };

  if (showScore && scoreResult) {
    return (
      <ScoreDisplay
        scoreResult={scoreResult}
        questionType="Summarize Spoken Text"
        onRetry={handleRetry}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      questionType="Summarize Spoken Text"
      section="listening"
      instructions={sampleQuestion.instructions}
      timeLimit={sampleQuestion.timeLimit}
      timeRemaining={timeRemaining}
      hasAiScoring={true}
      currentQuestion={1}
      totalQuestions={1}
      onSubmit={handleSubmit}
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
          />
        </div>

        {/* Actions */}
        <div className="flex justify-start">
          <Button variant="outline" onClick={handleRetry}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    </QuestionLayout>
  );
};

export default SummarizeSpokenTextPractice;