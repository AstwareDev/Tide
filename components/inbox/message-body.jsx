"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

  const finalHtml = useMemo(() => {
    if (sanitized === null) return null;
    return `<!doctype html><html><head><base target="_blank"><style>
      html,body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f1e30;word-wrap:break-word;}
      img{max-width:100%;}
      a{color:#1669c1;}
    </style></head><body>${sanitized}</body></html>`;
  }, [sanitized]);

  const measure = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const height = doc.documentElement.scrollHeight;
    if (height > 0) setIframeHeight(height + 8);
  };

  return (
    <div>
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
