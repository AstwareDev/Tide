import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/i18n/locale-context";

export const metadata = {
  title: "Tide",
  description: "AI-powered Gmail inbox that's faster and calmer than Gmail itself.",
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  themeColor: "#1669c1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          <TooltipProvider>
            {children}
            <Toaster theme="light" position="bottom-right" richColors />
          </TooltipProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
