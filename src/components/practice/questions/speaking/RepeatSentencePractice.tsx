import { useState } from "react";
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

const RepeatSentencePractice = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  
  const questions = speakingQuestions.filter((q) => q.type === "repeat-sentence");
  const currentQuestion = questions[currentIndex] || questions[0];
  
  const { timeRemaining, isTimeUp, restart, start, pause } = useQuestionTimer({
    initialTime: currentQuestion?.timeLimit || 15,
    autoStart: false,
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

  const handlePlaySentence = () => {
    // In real implementation, this would play audio
    const utterance = new SpeechSynthesisUtterance(currentQuestion.content);
    utterance.onend = () => {
      setHasPlayedAudio(true);
      start();
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
      questionType: "repeat-sentence",
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
      setHasPlayedAudio(false);
      restart();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetRecording();
      resetScore();
      setShowScore(false);
      setHasPlayedAudio(false);
      restart();
    }
  };

  const handleRetry = () => {
    resetRecording();
    resetScore();
    setShowScore(false);
    setHasPlayedAudio(false);
    restart();
  };

  if (showScore && scoreResult) {
    return (
      <ScoreDisplay
        scoreResult={scoreResult}
        questionType="Repeat Sentence"
        onRetry={handleRetry}
        onNext={currentIndex < questions.length - 1 ? handleNext : undefined}
        onBackToPractice={() => navigate("/practice")}
      />
    );
  }

  return (
    <QuestionLayout
      title={currentQuestion?.title || "Repeat Sentence"}
      questionType="Repeat Sentence"
      section="speaking"
      instructions={currentQuestion?.instructions || "Listen and repeat the sentence."}
      timeLimit={currentQuestion?.timeLimit || 15}
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
        {/* Play Audio Button */}
        <Card className="p-6 bg-card border-border text-center">
          {!hasPlayedAudio ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Click to hear the sentence</p>
              <Button size="lg" onClick={handlePlaySentence} className="gap-2">
                <Volume2 className="w-5 h-5" />
                Play Sentence
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Now repeat the sentence you heard
            </p>
          )}
        </Card>

        {/* Recording Controls */}
        {hasPlayedAudio && (
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

export default RepeatSentencePractice;
