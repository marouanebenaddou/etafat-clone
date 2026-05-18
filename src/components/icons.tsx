import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LogoIcon({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 142 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ETAFAT"
      className={className}
      {...props}
    >
      <text
        x="0"
        y="28"
        fontFamily="Figtree, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-1"
      >
        etafat
      </text>
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="20" height="2" rx="1" fill="currentColor" />
      <rect y="5" width="20" height="2" rx="1" fill="currentColor" />
      <rect y="10" width="20" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14.5 14.5L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2 7h10m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 8.5l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.7 3.6 12 3.6 12 3.6s-7.7 0-9.5.5c-1 .3-1.8 1.1-2 2.1C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1 1.8 2 2.1 1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5c1-.3 1.8-1.1 2-2.1.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 12l9-9 9 9M5 10v10h14V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CookieIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14M16 2c1 2.5 3 4.5 5.5 5.5C24 8.5 26 10.5 27 13c1 2.5 3 4.5 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="13" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
      <circle cx="22" cy="13" r="1.2" fill="currentColor" />
      <circle cx="12" cy="22" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* Domain icons (used in homepage grid) */
export function EnergyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="14" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 4v2M14 14v2M8 10h2M18 10h2M10 6l1.4 1.4M16.6 6L18 7.4M10 14l1.4-1.4M16.6 14L18 12.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 34l8-6 6 4 8-6 8 6 6-3v9H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="4" y1="42" x2="44" y2="42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="8" width="28" height="34" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10" y1="16" x2="38" y2="16" stroke="currentColor" strokeWidth="1.2" />
      <line x1="10" y1="24" x2="38" y2="24" stroke="currentColor" strokeWidth="1.2" />
      <line x1="10" y1="32" x2="38" y2="32" stroke="currentColor" strokeWidth="1.2" />
      <line x1="18" y1="8" x2="18" y2="42" stroke="currentColor" strokeWidth="1.2" />
      <line x1="24" y1="8" x2="24" y2="42" stroke="currentColor" strokeWidth="1.2" />
      <line x1="30" y1="8" x2="30" y2="42" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function BridgeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 28C12 14 36 14 44 28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10" y1="28" x2="10" y2="32" stroke="currentColor" strokeWidth="1.4" />
      <line x1="18" y1="22" x2="18" y2="32" stroke="currentColor" strokeWidth="1.4" />
      <line x1="24" y1="20" x2="24" y2="32" stroke="currentColor" strokeWidth="1.4" />
      <line x1="30" y1="22" x2="30" y2="32" stroke="currentColor" strokeWidth="1.4" />
      <line x1="38" y1="28" x2="38" y2="32" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="12" y="22" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 22v-6a8 8 0 0116 0v6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="30" r="2" fill="currentColor" />
      <line x1="24" y1="30" x2="24" y2="36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FactoryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 42V22l10 6V22l10 6V14l16 8v20H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="14" y="30" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
      <rect x="24" y="30" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
      <rect x="34" y="30" width="4" height="6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M24 4C16 4 10 10 10 18c0 10 14 24 14 24s14-14 14-24c0-8-6-14-14-14z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth="1.6" />
      <line x1="8" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function GearsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="18" cy="18" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M18 6v2M18 28v2M6 18h2M28 18h2M9.5 9.5l1.4 1.4M25.1 25.1l1.4 1.4M9.5 26.5l1.4-1.4M25.1 10.9l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="33" cy="33" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M33 25v2M33 39v2M25 33h2M39 33h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function CertificateIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="6" width="28" height="32" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="20" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 30h8M14 34h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 38l-3 6 4-2 4 2-3-6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 24l6 6 12-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
