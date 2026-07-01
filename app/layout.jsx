import "./globals.css";
import { Toaster } from "sonner";

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
        {children}
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  );
}
