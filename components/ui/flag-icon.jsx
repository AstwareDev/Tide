import { cn } from "@/lib/utils";

// Simplified but recognizable vector flags, inlined as SVG so the language
// switcher never depends on external image assets or network requests.
const FLAGS = {
  en: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#00247d" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#cf142b" strokeWidth="3" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#cf142b" strokeWidth="8" />
    </svg>
  ),
  ru: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#ffffff" />
      <rect y="13.33" width="60" height="13.33" fill="#0039a6" />
      <rect y="26.67" width="60" height="13.33" fill="#d52b1e" />
    </svg>
  ),
  hy: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#d90012" />
      <rect y="13.33" width="60" height="13.33" fill="#0033a0" />
      <rect y="26.67" width="60" height="13.33" fill="#f2a800" />
    </svg>
  ),
};

export function FlagIcon({ code, className }) {
  const flag = FLAGS[code] || FLAGS.en;
  return (
    <span className={cn("inline-block overflow-hidden rounded-[3px] ring-1 ring-black/10 shrink-0", className)}>
      <svg viewBox="0 0 60 40" className="h-full w-full block" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {flag.props.children}
      </svg>
    </span>
  );
}
