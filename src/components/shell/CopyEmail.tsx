"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export interface CopyEmailProps {
  className?: string;
}

/** Copies the site email to the clipboard; shows "Copied" for 2s. */
export function CopyEmail({ className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      track("email_copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("link-draw w-fit text-left text-sm text-link", className)}
    >
      {copied ? "Copied" : site.email}
    </button>
  );
}
