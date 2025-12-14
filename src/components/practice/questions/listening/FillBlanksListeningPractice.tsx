import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionLayout from "../QuestionLayout";
import ScoreDisplay from "../../ScoreDisplay";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

interface FillBlanksListeningPracticeProps {
  questionId?: string;
}

const sampleQuestion = {
  title: "Fill in the Blanks",
  instructions: "Listen to the recording and type the missing words in the blanks. Each blank represents one word.",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  textWithBlanks: "The research team conducted a comprehensive ___1___ of the environmental factors affecting marine life. They found that ocean ___2___ has increased significantly over the past decade. The study ___3___ that immediate action is required to protect endangered species.",
  correctAnswers: ["study", "temperature", "suggests"],
  timeLimit: 120,
};

const FillBlanksListeningPractice = ({ questionId }: FillBlanksListeningPracticeProps) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<string[]>(Array(sampleQuestion.correctAnswers.length).fill(""));
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

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const correct = answers.filter((answer, index) => 
      answer.toLowerCase().trim() === sampleQuestion.correctAnswers[index].toLowerCase()
    ).length;
    const calculatedScore = Math.round((correct / sampleQuestion.correctAnswers.length) * 90);
    
    setScoreResult({
      overallScore: calculatedScore,
      contentScore: calculatedScore,
      feedback: calculatedScore >= 63 
        ? "Well done! You identified most of the missing words correctly."
        : "Practice listening for specific words and their context.",
      suggestions: calculatedScore < 63 
        ? ["Focus on keywords that carry important meaning", "Listen multiple times if allowed"]
        : [],
    });
    setShowScore(true);
  };

  const handleRetry = () => {
    setAnswers(Array(sampleQuestion.correctAnswers.length).fill(""));
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
        questionType="Fill Blanks Listening"
        onRetry={handleRetry}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  const renderTextWithBlanks = () => {
    const parts = sampleQuestion.textWithBlanks.split(/(___\d+___)/);
    return parts.map((part, index) => {
      const match = part.match(/___(\d+)___/);
      if (match) {
        const blankIndex = parseInt(match[1]) - 1;
        
        return (
          <span key={index} className="inline-block mx-1">
            <Input
              value={answers[blankIndex]}
              onChange={(e) => updateAnswer(blankIndex, e.target.value)}
              className="w-32 inline-block h-8 text-center"
              placeholder={`Blank ${blankIndex + 1}`}
            />
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      questionType="Fill in the Blanks"
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

        {/* Text with Blanks */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-foreground leading-relaxed text-lg">
            {renderTextWithBlanks()}
          </p>
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

export default FillBlanksListeningPractice;