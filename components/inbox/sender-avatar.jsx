"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { gravatarUrl, avatarColor } from "@/lib/gravatar";

function initials(from) {
  const name = (from || "").split("<")[0].trim();
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

// Cascades through candidate image sources, advancing whenever one fails to
// load, and falling back to initials once all are exhausted. `avatarUrl`
// (resolved server-side) is the People API contact photo or, failing that, the
// sender's HTTP-verified domain favicon; Gravatar is the final image attempt.
// The domain favicon is deliberately NOT included here — Google serves a
// generic globe with a 404 status that browsers render anyway, so it can only
// be trusted after the server checks its status (see lib/google/people.js).
export function SenderAvatar({ avatarUrl, from, pending, senderName, className = "h-9 w-9" }) {
  const candidates = pending ? [] : [avatarUrl, gravatarUrl(from)].filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [avatarUrl, from, pending]);

  const src = candidates[index];

  return (
    <Avatar className={`ring-1 ring-border ${className}`}>
      {src && (
        <AvatarImage
          key={src}
          src={src}
          alt=""
          onLoadingStatusChange={(status) => {
            if (status === "error") setIndex((i) => i + 1);
          }}
        />
      )}
      <AvatarFallback style={{ backgroundColor: avatarColor(senderName || from), color: "#fff" }}>
        {initials(from)}
      </AvatarFallback>
    </Avatar>
  );
}
