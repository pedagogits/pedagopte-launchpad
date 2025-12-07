import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionTypeCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  hasAiScoring: boolean;
  isNew?: boolean;
  color?: string;
}

const QuestionTypeCard = ({
  id,
  name,
  description,
  icon,
  hasAiScoring,
  isNew,
  color = "bg-accent",
}: QuestionTypeCardProps) => {
  return (
    <Link
      to={`/practice/${id}`}
      className="group relative flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform",
          color
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
            {name}
          </h3>
          {isNew && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500 text-white">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
      </div>

      {/* AI Score Badge */}
      {hasAiScoring && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase">AI</span>
        </div>
      )}
    </Link>
  );
};

export default QuestionTypeCard;
