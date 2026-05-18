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
                <br />7 Rue Alfred Kastler
                <br />44307 NANTES
                <br />FRANCE
              </p>
            </div>
            <div>
              <h3 className="text-navy font-semibold mb-3 text-xl">Téléphone</h3>
              <p className="text-body text-sm">+33 (0)2 40 16 22 22</p>
            </div>
            <div>
              <h3 className="text-navy font-semibold mb-3 text-xl">Suivez-nous</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/company/etafat-expert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[#00669d] text-[#00669d] hover:bg-[#00669d] hover:text-white flex items-center justify-center transition-colors"
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
