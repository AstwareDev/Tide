import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Tide",
  description: "AI-powered Gmail inbox that's faster and calmer than Gmail itself.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
