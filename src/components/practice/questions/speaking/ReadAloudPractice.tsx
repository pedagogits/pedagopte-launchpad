import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionLayout from "../QuestionLayout";
import { useQuestionTimer } from "../useQuestionTimer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAiScoring } from "@/hooks/useAiScoring";
import { speakingQuestions } from "@/data/pteQuestions";
import ScoreDisplay from "../../ScoreDisplay";

const ReadAloudPractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  const questions = speakingQuestions.filter((q) => q.type === "read-aloud");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 40,
    onTimeUp: () => {
      if (isRecording) stopRecording();
    },
  });

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
      questionType: "read-aloud",
      questionText: currentQuestion.content,
      userResponse: currentQuestion.content, // In real app, this would be transcribed audio
    });
    setShowScore(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetRecording();
      resetScore();
      setShowScore(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetRecording();
      resetScore();
      setShowScore(false);
      restart();
    }
  };

  const handleRetry = () => {
    resetRecording();
    resetScore();
    setShowScore(false);
    restart();
  };

  if (showScore && scoreResult) {
    return (
      <ScoreDisplay
        scoreResult={scoreResult}
        questionType="Read Aloud"
        onRetry={handleRetry}
        onNext={currentIndex < questions.length - 1 ? handleNext : undefined}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Read Aloud"}
      questionType="Read Aloud"
      section="speaking"
      instructions={currentQuestion?.instructions || "Read the text aloud."}
      timeLimit={currentQuestion?.timeLimit || 40}
      timeRemaining={timeRemaining}
      hasAiScoring={true}
      currentQuestion={currentIndex + 1}
      totalQuestions={questions.length}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
      isSubmitting={isScoring}
    >
      <div className="space-y-6">
        {/* Text to Read */}
        <Card className="p-6 bg-card border-border">
          <p className="text-lg leading-relaxed text-foreground">
            {currentQuestion?.content}
          </p>
        </Card>

        {/* Recording Controls */}
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

          {/* Audio Playback */}
          {audioUrl && !isRecording && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <audio controls src={audioUrl} className="w-full max-w-md" />
              <Button variant="ghost" size="icon" onClick={resetRecording}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </QuestionLayout>
  );
};

export default ReadAloudPractice;
