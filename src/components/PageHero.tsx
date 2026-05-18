"use client";

import Image from "next/image";
import { Breadcrumb } from "./Breadcrumb";
import { Reveal } from "./Reveal";

interface PageHeroProps {
  title: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  breadcrumb?: { label: string; href?: string }[];
  variant?: "image-right" | "centered" | "banner" | "video-banner";
}

/**
 * Page hero with multiple variants matching geofit's layouts:
 * - "video-banner": full-width autoplay/looping video background, dark gradient,
 *   breadcrumb + title overlaid (matches geofit /domaines-activite/<x>/ pages)
 * - "banner": same as video-banner but with a static image
 * - "image-right": grid with title left, image right (matches savoir-faire details)
 * - "centered": centered title on white (matches list pages)
 */
export function PageHero({
  title,
  description,
  image,
  video,
  breadcrumb,
  variant = "image-right",
}: PageHeroProps) {
  // -------- VIDEO BANNER (geofit-style) --------
  if (variant === "video-banner" && video) {
    return (
      <section className="relative pt-[116px] text-white">
        <div className="relative h-[60vh] min-h-[460px] max-h-[680px] flex items-end overflow-hidden">
          <video
            poster={image || undefined}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/65" />
          <div className="container-etafat relative pb-16">
            {breadcrumb && (
              <Reveal y={12} delay={50}>
                <div className="mb-6 text-white/90">
                  <Breadcrumb items={breadcrumb} />
                </div>
              </Reveal>
            )}
            <Reveal variant="line" duration={1100} delay={150}>
              <h1
                className="text-white max-w-3xl text-4xl md:text-6xl font-semibold leading-tight"
                style={{ color: "#fff" }}
              >
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal y={16} delay={500}>
                <p className="text-white/90 mt-5 max-w-xl text-lg">{description}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    );
  }

  // -------- IMAGE BANNER --------
  if (variant === "banner" && image) {
    return (
      <section className="relative pt-[116px] text-white">
        <div className="relative h-[55vh] min-h-[420px] max-h-[640px] flex items-end overflow-hidden">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
          <div className="container-etafat relative pb-16">
            {breadcrumb && (
              <Reveal y={12} delay={50}>
                <div className="mb-6 text-white/85">
                  <Breadcrumb items={breadcrumb} />
                </div>
              </Reveal>
            )}
            <Reveal variant="line" duration={1100} delay={150}>
              <h1
                className="text-white max-w-3xl text-4xl md:text-6xl font-semibold leading-tight"
                style={{ color: "#fff" }}
              >
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal y={16} delay={500}>
                <p className="text-white/90 mt-5 max-w-xl text-lg">{description}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    );
  }

  // -------- CENTERED --------
  if (variant === "centered") {
    return (
      <section className="pt-[140px] pb-16 bg-white">
        <div className="container-etafat text-center max-w-3xl mx-auto">
          {breadcrumb && (
            <Reveal y={10}>
              <div className="mb-6 flex justify-center">
                <Breadcrumb items={breadcrumb} />
              </div>
            </Reveal>
          )}
          <Reveal variant="line" duration={1000} delay={100}>
            <h1 className="text-navy mb-5">{title}</h1>
          </Reveal>
          {description && (
            <Reveal delay={350}>
              <p className="text-body text-lg leading-relaxed">{description}</p>
            </Reveal>
          )}
        </div>
      </section>
    );
  }

  // -------- IMAGE-RIGHT (default) --------
  return (
    <section className="pt-[140px] pb-16 bg-white">
      <div className="container-etafat">
        {breadcrumb && (
          <Reveal y={10}>
            <div className="mb-8">
              <Breadcrumb items={breadcrumb} />
            </div>
          </Reveal>
        )}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Reveal variant="line" duration={1000}>
              <h1 className="text-navy mb-6">{title}</h1>
            </Reveal>
            {description && (
              <Reveal delay={250}>
                <p className="text-body text-base md:text-lg leading-relaxed">
                  {description}
                </p>
              </Reveal>
            )}
          </div>
          {image ? (
            <Reveal variant="zoom-out" duration={1100} delay={200}>
              <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  priority
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
