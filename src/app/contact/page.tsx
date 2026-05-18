import { PageHero } from "@/components/PageHero";
import { miscPageBySlug } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous contacter - ETAFAT",
  description: "Contactez le Groupe ETAFAT pour vos projets géospatiaux.",
};

export default function ContactPage() {
  const page = miscPageBySlug("contact");
  return (
    <>
      <PageHero
        title="Nous contacter"
        description={
          page?.paragraphs[0] ||
          "Une question, un projet ? Nous vous répondons sous les meilleurs délais."
        }
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Nous contacter" }]}
        variant="centered"
      />

      <section className="bg-white pb-24 pt-8">
        <div className="container-etafat grid md:grid-cols-2 gap-12 max-w-5xl">
          <form className="space-y-5">
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Nom complet *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-md focus:border-[#00669d] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-md focus:border-[#00669d] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Société</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-md focus:border-[#00669d] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Sujet *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-md focus:border-[#00669d] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Votre message *</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-md focus:border-[#00669d] focus:outline-none transition resize-none"
              />
            </div>
            <button type="submit" className="pill pill-teal">
              Envoyer
            </button>
          </form>

          <aside className="space-y-8">
            <div>
              <h3 className="text-navy font-semibold mb-3 text-xl">Siège social</h3>
              <p className="text-body text-sm leading-relaxed">
                ETAFAT
                <br />Lot 57, Lotissement Salaj
                <br />Aïn Diab — 20180
                <br />Casablanca, Maroc
              </p>
            </div>
            <div>
              <h3 className="text-navy font-semibold mb-3 text-xl">Téléphone</h3>
              <p className="text-body text-sm">
                <a href="tel:+212522798700" className="hover:text-[#00669d]">
                  +212 5 22 79 87 00
                </a>
                {" / "}
                <a href="tel:+212522798701" className="hover:text-[#00669d]">01</a>
                {" / "}
                <a href="tel:+212522798702" className="hover:text-[#00669d]">02</a>
              </p>
            </div>
            <div>
              <h3 className="text-navy font-semibold mb-3 text-xl">Email</h3>
              <p className="text-body text-sm">
                <a href="mailto:etafat@etafat.ma" className="hover:text-[#00669d]">
                  etafat@etafat.ma
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-navy font-semibold mb-3 text-xl">Suivez-nous</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/company/etafat"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn ETAFAT"
                  className="w-11 h-11 rounded-full border border-[#00669d] text-[#00669d] hover:bg-[#00669d] hover:text-white flex items-center justify-center transition-colors font-semibold"
                >
                  in
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
