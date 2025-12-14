import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionLayout from "../QuestionLayout";
import ScoreDisplay from "../../ScoreDisplay";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

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
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
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
    const score = calculateScore();
    setScoreResult({
      overallScore: score,
      contentScore: score,
      feedback: score >= 63 
        ? "Great job! You captured most of the sentence correctly."
        : "Keep practicing your listening skills to catch all the words.",
      suggestions: score < 63 
        ? ["Focus on connecting words and prepositions", "Practice with various accents"]
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
        questionType="Write from Dictation"
        onRetry={handleRetry}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      questionType="Write from Dictation"
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

        {/* Input Area */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Type the sentence you heard:</p>
          <Input
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type the sentence here..."
            className="text-lg h-14"
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

export default WriteFromDictationPractice;