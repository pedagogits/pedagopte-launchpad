import { useParams, Navigate } from "react-router-dom";
import {
  ReadAloudPractice,
  RepeatSentencePractice,
  DescribeImagePractice,
  RetellLecturePractice,
  AnswerShortQuestionPractice,
  RespondSituationPractice,
  SummarizeDiscussionPractice,
  SummarizeWrittenTextPractice,
  EssayPractice,
  FillBlanksDropdownPractice,
  MCMultipleReadingPractice,
  ReorderParagraphsPractice,
  FillBlanksDragPractice,
  MCSingleReadingPractice,
} from "@/components/practice/questions";

// Map question type IDs to their practice components
const questionTypeComponents: Record<string, React.ComponentType> = {
  // Speaking (7)
  "read-aloud": ReadAloudPractice,
  "repeat-sentence": RepeatSentencePractice,
  "describe-image": DescribeImagePractice,
  "retell-lecture": RetellLecturePractice,
  "answer-short-question": AnswerShortQuestionPractice,
  "respond-situation": RespondSituationPractice,
  "summarize-discussion": SummarizeDiscussionPractice,
  
  // Writing (2)
  "summarize-written-text": SummarizeWrittenTextPractice,
  "essay": EssayPractice,
  
  // Reading (5)
  "fill-blanks-dropdown": FillBlanksDropdownPractice,
  "mc-multiple-reading": MCMultipleReadingPractice,
  "reorder-paragraphs": ReorderParagraphsPractice,
  "fill-blanks-drag": FillBlanksDragPractice,
  "mc-single-reading": MCSingleReadingPractice,
  
  // Listening (8) - Placeholder components
  "summarize-spoken-text": SummarizeWrittenTextPractice, // Similar to writing
  "mc-multiple-listening": MCMultipleReadingPractice,
  "fill-blanks-listening": FillBlanksDropdownPractice,
  "highlight-correct-summary": MCSingleReadingPractice,
  "mc-single-listening": MCSingleReadingPractice,
  "select-missing-word": MCSingleReadingPractice,
  "highlight-incorrect-words": FillBlanksDropdownPractice,
  "write-from-dictation": SummarizeWrittenTextPractice,
};

const PracticeQuestion = () => {
  const { questionType } = useParams<{ questionType: string }>();
  
  if (!questionType || !questionTypeComponents[questionType]) {
    return <Navigate to="/practice" replace />;
  }
  
  const Component = questionTypeComponents[questionType];
  return <Component />;
};

export default PracticeQuestion;
