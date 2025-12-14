import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionLayout from "../QuestionLayout";
import ScoreDisplay from "../../ScoreDisplay";
import { useQuestionTimer } from "../useQuestionTimer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";

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
  const navigate = useNavigate();
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
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

  const toggleWord = (id: number) => {
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
    
    setScoreResult({
      overallScore: calculatedScore,
      contentScore: calculatedScore,
      feedback: calculatedScore >= 63 
        ? "Good job! You identified most of the incorrect words."
        : "Compare the transcript carefully with what you hear.",
      suggestions: calculatedScore < 63 
        ? ["Listen for slight variations in vocabulary", "Focus on nouns and verbs that might differ"]
        : [],
    });
    setShowScore(true);
  };

  const handleRetry = () => {
    setSelectedWords([]);
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
        questionType="Highlight Incorrect Words"
        onRetry={handleRetry}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={sampleQuestion.title}
      questionType="Highlight Incorrect Words"
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

        {/* Text with Clickable Words */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Click on words that differ from the recording:</p>
          <div className="flex flex-wrap gap-1 text-lg leading-relaxed">
            {sampleQuestion.words.map((word) => {
              const isSelected = selectedWords.includes(word.id);
              
              return (
                <span
                  key={word.id}
                  onClick={() => toggleWord(word.id)}
                  className={`px-1 py-0.5 rounded cursor-pointer transition-all ${
                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
                  }`}
                >
                  {word.text}
                </span>
              );
            })}
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

export default HighlightIncorrectWordsPractice;