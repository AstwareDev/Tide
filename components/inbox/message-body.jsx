"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tags that could execute code, escape the sandboxed iframe, exfiltrate data,
// or otherwise don't belong in a rendered email body. Inline `style` and even
// `<style>` blocks are fine here — the HTML is rendered inside a sandboxed
// iframe with its own document, so any CSS stays scoped to that frame.
const FORBID_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "link",
  "base",
  "meta",
];

let dompurifyPromise = null;
function loadDOMPurify() {
  if (!dompurifyPromise) {
    dompurifyPromise = import("dompurify").then((mod) => mod.default || mod);
  }
  return dompurifyPromise;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const URL_RE = /\bhttps?:\/\/[^\s<>"]+[^\s<>".,;:)]/g;
const EMAIL_RE = /\b[\w.+-]+@[\w-]+\.[a-zA-Z0-9.-]+\b/g;

function autolink(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(URL_RE, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
    .replace(EMAIL_RE, (email) => `<a href="mailto:${email}">${email}</a>`);
}

function PlainTextBody({ text }) {
  const html = useMemo(() => autolink(text || ""), [text]);
  return (
    <div
      className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function HtmlMessageBody({ html }) {
  const [sanitized, setSanitized] = useState(null);
  const [blockedCount, setBlockedCount] = useState(0);
  const [imagesAllowed, setImagesAllowed] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(120);
  const iframeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadDOMPurify().then((DOMPurify) => {
      if (cancelled) return;

      // Force every link to open in a new tab rather than navigating the
      // sandboxed frame (which has no history/back button of its own).
      DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if (node.tagName === "A") {
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener noreferrer");
        }
      });

      const clean = DOMPurify.sanitize(html, {
        FORBID_TAGS,
        WHOLE_DOCUMENT: false,
      });

      DOMPurify.removeHook("afterSanitizeAttributes");
      setSanitized(clean);
    });
    return () => {
      cancelled = true;
    };
  }, [html]);

  // Block remote images by default (tracking pixels, load-on-open receipts —
  // the same reason Gmail shows an "Images are not displayed" bar) until the
  // user opts in.
  const finalHtml = useMemo(() => {
    if (sanitized === null) return null;
    const doc = new DOMParser().parseFromString(sanitized, "text/html");
    let blocked = 0;
    doc.querySelectorAll("img[src]").forEach((img) => {
      const src = img.getAttribute("src") || "";
      const isRemote = /^(https?:)?\/\//i.test(src);
      if (isRemote && !imagesAllowed) {
        img.setAttribute("data-blocked-src", src);
        img.removeAttribute("src");
        img.style.border = "1px dashed var(--border, #dde6f0)";
        img.style.background = "#f3f7fb";
        blocked += 1;
      }
    });
    setBlockedCount(blocked);
    const base = `<!doctype html><html><head><base target="_blank"><style>
      html,body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f1e30;word-wrap:break-word;}
      img{max-width:100%;}
      a{color:#1669c1;}
    </style></head><body>${doc.body.innerHTML}</body></html>`;
    return base;
  }, [sanitized, imagesAllowed]);

  const measure = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const height = doc.documentElement.scrollHeight;
    if (height > 0) setIframeHeight(height + 8);
  };

  return (
    <div>
      {blockedCount > 0 && !imagesAllowed && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-accent px-3 py-2 text-xs text-muted-foreground">
          <ImageOff size={13} className="shrink-0" />
          <span className="flex-1">Images are not displayed.</span>
          <Button size="sm" variant="outline" className="h-6 text-[11px]" onClick={() => setImagesAllowed(true)}>
            Display images below
          </Button>
        </div>
      )}
      {finalHtml === null ? (
        <div className="h-16 animate-pulse rounded-lg bg-accent" />
      ) : (
        <iframe
          ref={iframeRef}
          title="Message content"
          sandbox="allow-same-origin allow-popups"
          srcDoc={finalHtml}
          onLoad={measure}
          style={{ height: iframeHeight, width: "100%", border: "none", display: "block" }}
        />
      )}
    </div>
  );
}

export function MessageBody({ body, bodyType }) {
  if (bodyType === "html") return <HtmlMessageBody html={body} />;
  return <PlainTextBody text={body} />;
}
