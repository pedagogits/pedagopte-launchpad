import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAiScoring } from "@/hooks/useAiScoring";
import { speakingQuestions } from "@/data/pteQuestions";
import ScoreDisplay from "../../ScoreDisplay";

const RespondSituationPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [preparationTime, setPreparationTime] = useState(20);
  const [isPreparation, setIsPreparation] = useState(true);
  
  const questions = speakingQuestions.filter((q) => q.type === "respond-situation");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart, start } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 40,
    autoStart: false,
    onTimeUp: () => {
      if (isRecording) stopRecording();
    },
  });

  useEffect(() => {
    if (!isPreparation) return;
    
    const timer = setInterval(() => {
      setPreparationTime((prev) => {
        if (prev <= 1) {
          setIsPreparation(false);
          start();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPreparation, start]);

  const {
    isRecording,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    error: recordingError,
  } = useAudioRecorder();

  const { isScoring, scoreResult, scoreResponse, resetScore } = useAiScoring();

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
      questionType: "respond-situation",
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
      setIsPreparation(true);
      setPreparationTime(20);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetRecording();
      resetScore();
      setShowScore(false);
      setIsPreparation(true);
      setPreparationTime(20);
      restart();
    }
  };

  const handleRetry = () => {
    resetRecording();
    resetScore();
    setShowScore(false);
    setIsPreparation(true);
    setPreparationTime(20);
    restart();
  };

  if (showScore && scoreResult) {
    return (
      <ScoreDisplay
        scoreResult={scoreResult}
        questionType="Respond to a Situation"
        onRetry={handleRetry}
        onNext={currentIndex < questions.length - 1 ? handleNext : undefined}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Respond to a Situation"}
      questionType="Respond to a Situation"
      section="speaking"
      instructions={currentQuestion?.instructions || "Respond to the situation described."}
      timeLimit={isPreparation ? 20 : currentQuestion?.timeLimit || 40}
      timeRemaining={isPreparation ? preparationTime : timeRemaining}
      hasAiScoring={true}
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isSubmitting={isScoring}
    >
      <div className="space-y-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="font-medium text-foreground mb-3">Situation:</h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {currentQuestion?.content}
          </p>
        </Card>

        {isPreparation ? (
          <div className="text-center py-4">
            <p className="text-lg font-medium text-foreground mb-2">
              Think about your response
            </p>
            <p className="text-4xl font-bold text-accent">{preparationTime}s</p>
            <p className="text-sm text-muted-foreground mt-2">
              Recording will start automatically
            </p>
          </div>
        ) : (
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

export default RespondSituationPractice;
