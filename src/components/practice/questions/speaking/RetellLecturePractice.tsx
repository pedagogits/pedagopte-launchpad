import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAiScoring } from "@/hooks/useAiScoring";
import { speakingQuestions } from "@/data/pteQuestions";
import ScoreDisplay from "../../ScoreDisplay";

const RetellLecturePractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [phase, setPhase] = useState<"listen" | "prepare" | "record">("listen");
  const [preparationTime, setPreparationTime] = useState(10);
  
  const questions = speakingQuestions.filter((q) => q.type === "retell-lecture");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart, start } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 40,
    autoStart: false,
    onTimeUp: () => {
      if (isRecording) stopRecording();
    },
  });

  // Preparation countdown
  useEffect(() => {
    if (phase !== "prepare") return;
    
    const timer = setInterval(() => {
      setPreparationTime((prev) => {
        if (prev <= 1) {
          setPhase("record");
          start();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, start]);

  const {
    isRecording,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    error: recordingError,
  } = useAudioRecorder();

  const { isScoring, scoreResult, scoreResponse, resetScore } = useAiScoring();

  const handlePlayLecture = () => {
    const utterance = new SpeechSynthesisUtterance(currentQuestion.content);
    utterance.rate = 0.9;
    utterance.onend = () => {
      setPhase("prepare");
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleRecord = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleSubmit = async () => {
    if (!audioUrl) return;
    
    await scoreResponse({
      questionType: "retell-lecture",
      questionText: currentQuestion.content,
      userResponse: currentQuestion.content,
    });
    setShowScore(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetRecording();
      resetScore();
      setShowScore(false);
      setPhase("listen");
      setPreparationTime(10);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetRecording();
      resetScore();
      setShowScore(false);
      setPhase("listen");
      setPreparationTime(10);
      restart();
    }
  };

  const handleRetry = () => {
    resetRecording();
    resetScore();
    setShowScore(false);
    setPhase("listen");
    setPreparationTime(10);
    restart();
  };

  if (showScore && scoreResult) {
    return (
      <ScoreDisplay
        scoreResult={scoreResult}
        questionType="Retell Lecture"
        onRetry={handleRetry}
        onNext={currentIndex < questions.length - 1 ? handleNext : undefined}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Retell Lecture"}
      questionType="Retell Lecture"
      section="speaking"
      instructions={currentQuestion?.instructions || "Listen to the lecture and retell it in your own words."}
      timeLimit={phase === "prepare" ? 10 : currentQuestion?.timeLimit || 40}
      timeRemaining={phase === "prepare" ? preparationTime : timeRemaining}
      hasAiScoring={true}
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isSubmitting={isScoring}
    >
      <div className="space-y-6">
        {phase === "listen" && (
          <Card className="p-8 bg-card border-border text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-accent" />
              </div>
              <p className="text-muted-foreground">Click to hear the lecture</p>
              <Button size="lg" onClick={handlePlayLecture} className="gap-2">
                <Volume2 className="w-5 h-5" />
                Play Lecture
              </Button>
            </div>
          </Card>
        )}

        {phase === "prepare" && (
          <Card className="p-8 bg-card border-border text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              Prepare your response
            </p>
            <p className="text-4xl font-bold text-accent">{preparationTime}s</p>
            <p className="text-sm text-muted-foreground mt-2">
              Recording will start automatically
            </p>
          </Card>
        )}

        {phase === "record" && (
          <div className="flex flex-col items-center gap-4">
            {recordingError && (
              <p className="text-sm text-destructive">{recordingError}</p>
            )}
            
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={handleRecord}
              disabled={isTimeUp}
              className="gap-2 min-w-[200px]"
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  {audioUrl ? "Record Again" : "Start Recording"}
                </>
              )}
            </Button>

            {isRecording && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
                <span className="text-sm text-muted-foreground">Recording...</span>
              </div>
            )}

            {audioUrl && !isRecording && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <audio controls src={audioUrl} className="w-full max-w-md" />
                <Button variant="ghost" size="icon" onClick={resetRecording}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </QuestionLayout>
  );
};

export default RetellLecturePractice;
