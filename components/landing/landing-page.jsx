import Link from "next/link";
import { Mail, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Zap, text: "Passive agents run in the background, no babysitting" },
  { icon: Mail, text: "Labels, archives, and deletes based on rules you define" },
  { icon: ShieldCheck, text: "Your email is only sent to your AI provider for classification" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/tide.png" alt="Tide" className="w-full h-full object-cover" />
          </div>
          <span className="text-foreground font-semibold tracking-tight">Tide</span>
        </div>
        <Button asChild size="sm">
          <Link href="/login">Get Started</Link>
        </Button>
      </header>

      <main className="flex flex-col items-center px-6 pt-20 pb-24 text-center max-w-3xl mx-auto">
        <h1 className="text-foreground text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
          Let AI keep your inbox clean
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
          Tide connects to your Gmail and runs AI agents that automatically label, archive, and delete the noise — so
          your inbox stays organized without you lifting a finger.
        </p>

        <Button asChild size="lg" className="mb-16">
          <Link href="/login" className="gap-2">
            Use the App
            <ArrowRight size={16} />
          </Link>
        </Button>

        <div className="grid sm:grid-cols-3 gap-6 w-full text-left">
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-start gap-3 p-5 rounded-xl border border-border bg-card">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
