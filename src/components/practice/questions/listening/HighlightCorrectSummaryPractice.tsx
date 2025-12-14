import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionLayout from "../QuestionLayout";
import ScoreDisplay from "../../ScoreDisplay";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

interface HighlightCorrectSummaryPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Highlight Correct Summary",
  instructions: "Listen to the recording and select the paragraph that best summarizes what you heard.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  options: [
    { 
      id: "a", 
      text: "The speaker discusses the importance of urban planning in modern cities, emphasizing the need for green spaces and sustainable transportation systems." 
    },
    { 
      id: "b", 
      text: "The lecture focuses on agricultural practices and their impact on rural communities, highlighting the challenges faced by small-scale farmers." 
    },
    { 
      id: "c", 
      text: "The presentation covers the history of architecture from ancient times to the modern era, with particular focus on Gothic and Renaissance periods." 
    },
    { 
      id: "d", 
      text: "The speaker analyzes economic trends in developing nations, discussing the relationship between trade policies and economic growth." 
    },
  ],
  correctAnswer: "a",
  timeLimit: 120,
};

const HighlightCorrectSummaryPractice = ({ questionId }: HighlightCorrectSummaryPracticeProps) => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    overallScore: number;
    contentScore: number;
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

  const handleSubmit = () => {
    const calculatedScore = selectedAnswer === sampleQuestion.correctAnswer ? 90 : 0;
    
    setScoreResult({
      overallScore: calculatedScore,
      contentScore: calculatedScore,
      feedback: calculatedScore === 90 
        ? "Excellent! You correctly identified the summary that matches the recording."
        : "The correct summary was option A. Listen for key themes and main ideas.",
      suggestions: calculatedScore === 0 
        ? ["Focus on the main topic, not minor details", "Eliminate summaries that contradict the recording"]
        : [],
    });
    setShowScore(true);
  };

  const handleRetry = () => {
    setSelectedAnswer("");
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
        questionType="Highlight Correct Summary"
        onRetry={handleRetry}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      questionType="Highlight Correct Summary"
      section="listening"
      instructions={sampleQuestion.instructions}
      timeLimit={sampleQuestion.timeLimit}
      timeRemaining={timeRemaining}
      hasAiScoring={false}
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
        </div>

        {/* Summary Options */}
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
          <div className="space-y-3">
            {sampleQuestion.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label htmlFor={option.id} className="cursor-pointer flex-1 text-foreground">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

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

export default HighlightCorrectSummaryPractice;