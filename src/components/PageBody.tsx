import { CheckIcon } from "./icons";
import { cleanParagraphs, type ScrapedItem } from "@/lib/content";

interface PageBodyProps {
  item: ScrapedItem;
}

/**
 * Renders a scraped page's body in clean ETAFAT styling.
 * Uses extracted paragraphs, lists, and secondary images.
 */
export function PageBody({ item }: PageBodyProps) {
  const hSection = item.headings.filter(
    (h) =>
      (h.level === "h2" || h.level === "h3") &&
      !h.text.includes("Previous Project") &&
      !h.text.includes("Next Project") &&
      !h.text.toLowerCase().includes("nos références") &&
      !h.text.toLowerCase().includes("vous avez une"),
  );
  const paragraphs = cleanParagraphs(item);
  return (
    <article className="bg-white py-16">
      <div className="container-etafat max-w-4xl">
        {paragraphs.slice(0, 2).map((p, i) => (
          <p key={i} className="text-body text-lg leading-relaxed mb-6">
            {p}
          </p>
        ))}

        {(() => {
          // Filter lists to drop nav-list-like content (items mentioning many menu words, very long items)
          const NAV_WORDS = ["Identité", "Agences", "Filiales", "Engagements", "Actualités", "Innovation", "Savoir-faire", "Domaines"];
          const cleanLists = item.lists
            .filter(
              (list) =>
                list.length >= 2 &&
                list.every(
                  (line) =>
                    line.length < 220 &&
                    NAV_WORDS.filter((w) => line.includes(w)).length < 3,
                ),
            )
            .slice(0, 2);
          if (cleanLists.length === 0) return null;
          return (
            <section className="mt-6">
              {cleanLists.map((list, li) => (
                <ul key={`l-${li}`} className="space-y-3 mb-8">
                  {list.map((line, i) => (
                    <li
                      key={`li-${li}-${i}`}
                      className="flex items-start gap-3 text-body leading-relaxed"
                    >
                      <span className="text-teal mt-1 shrink-0">
                        <CheckIcon width={14} height={14} />
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </section>
          );
        })()}

        {hSection.length > 0 && (
          <>
            {hSection.slice(0, 8).map((h, hi) => {
              const Tag = h.level as "h2" | "h3";
              const startIdx = 2 + hi * 2;
              return (
                <section key={`h-${hi}`} className="mt-12">
                  <Tag className={`mb-4 ${h.level === "h2" ? "text-3xl" : "text-2xl"}`}>
                    {h.text}
                  </Tag>
                  {paragraphs.slice(startIdx, startIdx + 2).map((p, pi) => (
                    <p key={`hp-${hi}-${pi}`} className="text-body leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </section>
              );
            })}
          </>
        )}
      </div>
    </article>
  );
}

