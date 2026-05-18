import Link from "next/link";
import { LogoIcon, LinkedInIcon, YoutubeIcon } from "./icons";
import { Pill } from "./Pill";

export function SiteFooter() {
  return (
    <footer className="bg-[#313c4e] text-white pt-20 pb-8">
      <div className="container-etafat">
        <div className="mb-12">
          <LogoIcon className="h-10 w-auto text-white" />
          <p
            className="mt-4 text-white text-lg md:text-xl"
            style={{ fontFamily: "var(--font-figtree)", fontWeight: 500 }}
          >
            Donnons du pouvoir à vos données
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-10 md:gap-12 pb-10">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4" style={{ color: "#fff" }}>
              À propos
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Le Groupe ETAFAT apporte son savoir-faire dans l&apos;acquisition et l&apos;exploitation
              de la donnée géospatiale afin d&apos;en assurer sa compréhension et sa valorisation.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/etafat-expert"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-[#2ab5b4] text-[#2ab5b4] hover:bg-[#2ab5b4] hover:text-white flex items-center justify-center transition-colors"
              >
                <LinkedInIcon width={16} height={16} />
              </a>
              <a
                href="https://www.youtube.com/@etafatgroup"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-[#2ab5b4] text-[#2ab5b4] hover:bg-[#2ab5b4] hover:text-white flex items-center justify-center transition-colors"
              >
                <YoutubeIcon width={18} height={18} />
              </a>
              <Pill href="/savoir-faire/" variant="outline-teal" arrow="right">
                Nos savoir-faire
              </Pill>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4" style={{ color: "#fff" }}>
              Le Groupe
            </h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li><Link href="/identite/" className="hover:text-[#2ab5b4]">Identité</Link></li>
              <li><Link href="/filiales/" className="hover:text-[#2ab5b4]">Filiales</Link></li>
              <li><Link href="/engagements/" className="hover:text-[#2ab5b4]">Engagements</Link></li>
              <li><Link href="/actualites/" className="hover:text-[#2ab5b4]">Actualités</Link></li>
              <li><Link href="/nous-rejoindre/" className="hover:text-[#2ab5b4]">Nous rejoindre</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4" style={{ color: "#fff" }}>
              Notre offre
            </h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li><Link href="/domaines-activite/" className="hover:text-[#2ab5b4]">Domaines d&apos;activité</Link></li>
              <li><Link href="/savoir-faire/" className="hover:text-[#2ab5b4]">Savoir-faire</Link></li>
              <li><Link href="/references/" className="hover:text-[#2ab5b4]">Références</Link></li>
              <li><Link href="/innovation/" className="hover:text-[#2ab5b4]">Innovation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4" style={{ color: "#fff" }}>
              Contact
            </h3>
            <p className="text-white/80 text-sm mb-5 leading-relaxed">
              7 Rue Alfred Kastler, 44307<br />NANTES
            </p>
            <div className="flex flex-col gap-3 items-start">
              <Pill href="/agences/" variant="outline-teal" arrow="right">Nos agences</Pill>
              <Pill href="/contact/" variant="outline-teal" arrow="right">Nous contacter</Pill>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
          <p className="text-white/60">© 2025 Tous droits réservés ETAFAT</p>
          <ul className="flex flex-wrap gap-6 text-white/70">
            <li><Link href="/mentions-legales/" className="hover:text-[#2ab5b4]">Mentions légales</Link></li>
            <li><Link href="/politique-confidentialite/" className="hover:text-[#2ab5b4]">Politique de confidentialité</Link></li>
            <li><Link href="/plan-du-site/" className="hover:text-[#2ab5b4]">Plan du site</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
