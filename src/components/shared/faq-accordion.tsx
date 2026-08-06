import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/lib/types";

/**
 * FAQ accordion — PRD §11.10.
 *
 * The shadcn accordion is built on Radix, so keyboard operation and the
 * expanded/collapsed announcement required by PRD §20.2 come for free.
 */
export function FaqAccordion({
  faqs,
  className,
}: {
  faqs: Faq[];
  className?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <Accordion type="single" collapsible className={className}>
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="border-b border-rhf-border last:border-b-0"
        >
          <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold text-rhf-charcoal hover:text-rhf-deep-orange hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
