import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the AI scoring?",
    answer:
      "Our AI scoring system is trained on millions of real PTE responses and achieves 95%+ correlation with official PTE scores. It provides detailed feedback on pronunciation, fluency, grammar, and content.",
  },
  {
    question: "Can I access the platform on mobile devices?",
    answer:
      "Yes! PedagogistPTE is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers. You can practice anytime, anywhere.",
  },
  {
    question: "How many mock tests are included?",
    answer:
      "Free users get 1 mock test. Pro subscribers get unlimited access to over 200 full-length mock tests that simulate real PTE exam conditions with AI scoring.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with our platform, you can request a full refund within 7 days of your purchase.",
  },
  {
    question: "How long does it take to see score improvement?",
    answer:
      "Most students see significant improvement within 2-4 weeks of consistent practice. Our AI-generated study plans help optimize your preparation time for maximum results.",
  },
  {
    question: "Do you offer discounts for students?",
    answer:
      "Yes! We offer special discounts for students with a valid .edu email address. Contact our support team to get your student discount code.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold mb-4 block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking
            for, feel free to contact our support team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};