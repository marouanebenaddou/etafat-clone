import Image from "next/image";
import { Breadcrumb } from "./Breadcrumb";

interface PageHeroProps {
  title: string;
  description?: string;
  image?: string | null;
  breadcrumb?: { label: string; href?: string }[];
  variant?: "image-right" | "centered" | "banner";
}

export function PageHero({
  title,
  description,
  image,
  breadcrumb,
  variant = "image-right",
}: PageHeroProps) {
  if (variant === "banner" && image) {
    return (
      <section className="relative pt-[116px] text-white">
        <div className="relative h-[55vh] min-h-[420px] max-h-[640px] flex items-end">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
          <div className="container-etafat relative pb-16">
            {breadcrumb && (
              <div className="mb-6 text-white/85">
                <Breadcrumb items={breadcrumb} />
              </div>
            )}
            <h1 className="text-white max-w-3xl text-4xl md:text-6xl font-semibold leading-tight" style={{ color: "#fff" }}>
              {title}
            </h1>
            {description && (
              <p className="text-white/90 mt-5 max-w-xl text-lg">{description}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <section className="pt-[140px] pb-16 bg-white">
        <div className="container-etafat text-center max-w-3xl mx-auto">
          {breadcrumb && (
            <div className="mb-6 flex justify-center">
              <Breadcrumb items={breadcrumb} />
            </div>
          )}
          <h1 className="text-navy mb-5">{title}</h1>
          {description && (
            <p className="text-body text-lg leading-relaxed">{description}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[140px] pb-16 bg-white">
      <div className="container-etafat">
        {breadcrumb && (
          <div className="mb-8">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="text-navy mb-6">{title}</h1>
            {description && (
              <p className="text-body text-base md:text-lg leading-relaxed">{description}</p>
            )}
          </div>
          {image ? (
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
          ) : null}
        </div>
      </div>
    </section>
  );
}
