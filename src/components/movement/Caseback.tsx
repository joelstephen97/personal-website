import pkg from "../../../package.json";
import { cn } from "@/lib/cn";

export interface CasebackProps {
  build?: { sha?: string; date?: string };
  className?: string;
}

/** Strips a leading semver range operator (`^1.2.3` -> `1.2.3`). */
function stripCaret(version: string): string {
  return version.replace(/^[\^~]/, "");
}

/** `1.2.3` -> `1.2`. */
function majorMinor(version: string): string {
  const [major, minor] = stripCaret(version).split(".");
  return minor ? `${major}.${minor}` : (major ?? version);
}

/**
 * Server-rendered engraved plate: build/version metadata styled like the
 * caseback of a watch. Reads framework versions straight from
 * `package.json` at build time.
 */
export function Caseback({ build, className }: CasebackProps) {
  const sha = (build?.sha ?? "").slice(0, 7);
  const date = build?.date;
  const year = new Date().getFullYear();
  const nextVersion = majorMinor(pkg.dependencies.next);
  const reactVersion = majorMinor(pkg.dependencies.react);

  return (
    <div className={cn("border-t border-champagne-line pt-6", className)}>
      <div className="mb-2 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-3.5 shrink-0"
          style={{ boxShadow: "inset 0 0 0 1px var(--metal-champagne-line)" }}
        />
        <p className="label engraved text-fg-3">
          <strong className="text-fg-2">Joel Stephen</strong> · est. 2019
        </p>
      </div>
      <p className="label engraved text-fg-3">
        assembled in <strong className="text-fg-2">Abu Dhabi</strong>
      </p>
      <p className="label engraved text-fg-3">
        movement <strong className="text-fg-2">Next {nextVersion}</strong> · React{" "}
        <strong className="text-fg-2">{reactVersion}</strong>
      </p>
      {sha && (
        <p className="engraved font-mono text-[11px] text-fg-3">
          build <span className="text-fg-2">{sha}</span>
          {date && <> · {date}</>}
        </p>
      )}
      <p className="label engraved text-fg-3">© {year}</p>
    </div>
  );
}
