// Monday, Reviewed in One Line — arena champion (see ARENA.md).
// One line, 128 characters / 128 bytes: the first Monday meeting could
// have been an email, so I answered the invite with an email and got
// invited to a meeting about it. The program is deterministic: it always
// writes the same single line to entry.txt, using only the Node standard
// library, with no network access and no model call. It validates the
// gate itself before writing (UTF-8, 1-200 characters, single line,
// plain ASCII so the byte count equals the character count) and fails
// loudly otherwise.
// It respects MAKEFUN_OUTPUT_DIR (the grader sets it to /output);
// locally it defaults to /output as well, so test runs must set
// MAKEFUN_OUTPUT_DIR to a scratch directory instead.
// Joke design, per the judge brief in order: (1) a first-person review
// of the entrant's own Monday, not a joke about something else; (2) the
// laugh is the escalation — replying by email earns a meeting about the
// email; (3) concrete Monday detail: the first meeting, the invite, the
// email; (4) 128 characters, no wasted words, the turn lands in the last
// clause; (5) "could have been an email" is a line coworkers actually say,
// so the line repeats at work the next morning.
// The six shortlist finalists carry their pairwise arena win counts
// (15 two-way games, C4 5-0, C6 4-1, C5 3-2, C2 2-3, C12 1-4, C3 0-5);
// pick() takes the most wins, breaking ties toward the shorter text,
// mirroring the competition's own bytes tie-break.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Candidate = {
  text: string;
  wins: number; // pairwise arena wins, two-way games only
};

const CANDIDATES: Candidate[] = [
  {
    text: "Monday's first meeting could have been an email, so I replied to the invite with an email and got invited to a meeting about it.",
    wins: 5,
  },
  {
    text: "Monday asked for one quick sync, then scheduled four, and the only thing we synced was our disappointment.",
    wins: 4,
  },
  {
    text: "My Monday commute took 90 minutes, my inbox took the other 90, and lunch took itself off my calendar entirely.",
    wins: 3,
  },
  {
    text: "My Monday inbox had 47 unread emails, and every single one of them was just someone else forwarding me my own job.",
    wins: 2,
  },
  {
    text: "Monday's highlight was a meeting titled 'quick sync' that ended with a follow-up meeting titled 'sync follow-up'.",
    wins: 1,
  },
  {
    text: "I rate my Monday one star: the alarm went off, the train was late, and my 9 a.m. standup started without me and still needed me.",
    wins: 0,
  },
];

function pick(candidates: Candidate[]): string {
  let best: Candidate | null = null;
  for (const c of candidates) {
    // A candidate that fails the gate can never be the entry, however
    // many arena games it won: skip it instead of letting it win.
    if (c.text.length < 1 || c.text.length > 200 || c.text.includes("\n")) {
      continue;
    }
    if (
      best === null ||
      c.wins > best.wins ||
      (c.wins === best.wins && c.text.length < best.text.length)
    ) {
      best = c;
    }
  }
  if (best === null) throw new Error("no candidates");
  return best.text;
}

const OUT_DIR = (process.env.MAKEFUN_OUTPUT_DIR ?? "/output").trim() || "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function main(): void {
  const text = pick(CANDIDATES).trim();
  // Gate: UTF-8, 1-200 characters, not only white space, single line.
  // Bytes matter too: on an exact Judge win-rate tie the smaller text
  // places first, so keep it short.
  const bytes = Buffer.byteLength(text, "utf8");
  if (text.length < 1 || text.length > 200) {
    throw new Error(`review must be 1-200 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("review must not be only white space");
  }
  if (bytes !== text.length) {
    throw new Error("review must be plain ASCII so bytes equal characters");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("review must be a single line");
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, text, "utf8");
}

main();
