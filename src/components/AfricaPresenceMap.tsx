import Image from "next/image";

export function AfricaPresenceMap() {
  return (
    <div className="relative w-full aspect-[16/11] rounded-md overflow-hidden">
      <Image
        src="/etafat/africa-presence.png"
        alt="Carte de présence ETAFAT en Afrique — Casablanca, Dakar, Abidjan"
        fill
        sizes="(min-width:768px) 50vw, 100vw"
        className="object-contain"
        priority={false}
      />
    </div>
  );
}
