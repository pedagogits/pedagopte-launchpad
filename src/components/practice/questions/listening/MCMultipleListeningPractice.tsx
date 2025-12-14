import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionLayout from "../QuestionLayout";
import ScoreDisplay from "../../ScoreDisplay";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

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
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
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

  const toggleAnswer = (id: string) => {
    setSelectedAnswers(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const correct = sampleQuestion.correctAnswers.filter(a => selectedAnswers.includes(a)).length;
    const incorrect = selectedAnswers.filter(a => !sampleQuestion.correctAnswers.includes(a)).length;
    const calculatedScore = Math.max(0, Math.round((correct - incorrect) / sampleQuestion.correctAnswers.length * 90));
    
    setScoreResult({
      overallScore: calculatedScore,
      contentScore: calculatedScore,
      feedback: calculatedScore >= 63 
        ? "Excellent! You identified most of the correct answers."
        : "Review the recording carefully to identify all correct options.",
      suggestions: calculatedScore < 63 
        ? ["Listen for specific keywords mentioned by the speaker", "Eliminate obviously incorrect options first"]
        : [],
    });
    setShowScore(true);
  };

  const handleRetry = () => {
    setSelectedAnswers([]);
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
        questionType="MC Multiple Listening"
        onRetry={handleRetry}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      questionType="MC Multiple Answers"
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
                }`}
              >
                <Checkbox 
                  checked={selectedAnswers.includes(option.id)}
                />
                <span className="text-foreground">{option.text}</span>
              </div>
            ))}
          </div>
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

export default MCMultipleListeningPractice;