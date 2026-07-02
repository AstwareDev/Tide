import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "Tide",
  description: "AI-powered Gmail inbox that's faster and calmer than Gmail itself.",
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#1669c1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          {children}
          <Toaster theme="light" position="bottom-right" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
