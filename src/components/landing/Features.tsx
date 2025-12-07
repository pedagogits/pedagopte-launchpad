import { motion } from "framer-motion";
import {
  Brain,
  Target,
  BarChart3,
  BookOpen,
  Mic,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Scoring",
    description:
      "Get instant, accurate scores on your speaking and writing tasks with our advanced AI engine.",
  },
  {
    icon: Target,
    title: "5000+ Practice Questions",
    description:
      "Access a vast library of questions covering all PTE exam sections and difficulty levels.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Track your progress with comprehensive performance analytics and personalized insights.",
  },
  {
    icon: BookOpen,
    title: "Smart Study Plans",
    description:
      "AI-generated study plans tailored to your target score and available preparation time.",
  },
  {
    icon: Mic,
    title: "Speaking Practice",
    description:
      "Practice speaking tasks with real-time pronunciation and fluency feedback.",
  },
  {
    icon: Clock,
    title: "Timed Mock Tests",
    description:
      "Simulate real exam conditions with full-length timed mock tests and section tests.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold mb-4 block">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need
            to achieve your target PTE score.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};