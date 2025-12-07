import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScoreResult {
  overallScore: number;
  contentScore: number;
  pronunciationScore?: number;
  fluencyScore?: number;
  grammarScore?: number;
  spellingScore?: number;
  feedback: string;
  suggestions: string[];
}

interface UseAiScoringReturn {
  isScoring: boolean;
  scoreResult: ScoreResult | null;
  scoreResponse: (params: {
    questionType: string;
    questionText: string;
    userResponse: string;
    audioTranscript?: string;
  }) => Promise<void>;
  resetScore: () => void;
}

export const useAiScoring = (): UseAiScoringReturn => {
  const [isScoring, setIsScoring] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const { toast } = useToast();

  const scoreResponse = async ({
    questionType,
    questionText,
    userResponse,
    audioTranscript,
  }: {
    questionType: string;
    questionText: string;
    userResponse: string;
    audioTranscript?: string;
  }) => {
    setIsScoring(true);
    try {
      const { data, error } = await supabase.functions.invoke("score-response", {
        body: {
          questionType,
          questionText,
          userResponse,
          audioTranscript,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setScoreResult(data);
      toast({
        title: "Scoring Complete",
        description: `Your score: ${data.overallScore}/90`,
      });
    } catch (err) {
      console.error("Scoring error:", err);
      toast({
        title: "Scoring Failed",
        description: err instanceof Error ? err.message : "Failed to score your response",
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };

  const resetScore = () => {
    setScoreResult(null);
  };

  return {
    isScoring,
    scoreResult,
    scoreResponse,
    resetScore,
  };
};
