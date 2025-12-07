import { useState, useEffect } from "react";
import { X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 4, hours: 6, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-purple-600 via-primary to-purple-600 text-primary-foreground py-2.5 px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary-foreground/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              Launch Sale
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
              <span className="font-semibold text-lg hidden sm:inline">Special Launch Offer</span>
              <span className="text-primary-foreground/80 hidden md:inline">
                Get 50% off on VIP plans
              </span>
            </div>

            <div className="flex items-center gap-1">
              <TimeBlock value={formatNumber(timeLeft.days)} label="Day" />
              <span className="text-xl font-bold">:</span>
              <TimeBlock value={formatNumber(timeLeft.hours)} label="Hour" />
              <span className="text-xl font-bold">:</span>
              <TimeBlock value={formatNumber(timeLeft.minutes)} label="Min" />
              <span className="text-xl font-bold">:</span>
              <TimeBlock value={formatNumber(timeLeft.seconds)} label="Sec" />
            </div>

            <Button
              size="sm"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              Activate Offer
            </Button>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const TimeBlock = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-primary-foreground/20 rounded px-2 py-1 min-w-[36px] text-center">
      <span className="font-bold text-lg">{value}</span>
    </div>
    <span className="text-[10px] text-primary-foreground/70 uppercase">{label}</span>
  </div>
);

export default PromoBanner;
