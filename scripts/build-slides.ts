import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";

const repoRoot = process.argv[2];
if (!repoRoot) {
  console.error("usage: tsx scripts/build-slides.ts <repo-root>");
  process.exit(1);
}

const videosDir = path.join(repoRoot, "videos");
const outputFile = path.join(repoRoot, "slides.pptx");

// ─── Language metadata ──────────────────────────────────────────────────────
// Add an entry here when a language's final/ beats are built.

type TextRun = { text: string; color?: string; bold?: boolean; mono?: boolean };

interface LangMeta {
  displayName: string;
  titleNotes: string;
  videoNotes: string[];       // one entry per video beat, in order
  explanation: TextRun[][];   // one inner array per line — colored code annotation
  explanationDetail: string;  // plain-prose mechanism + consequence, read by the audience
  explanationNotes: string;   // spoken headline — the slide carries the rest
}

const ACCENT   = "FF5555"; // red  — the "oh no" colour (explanation slides)
const SEVEN_CLR = "CC0000"; // dark red — the SEVEN punchline overlay
const FN_CLR   = "8BE9FD"; // cyan — function names
const DIM_CLR  = "AAAAAA"; // grey — punctuation / filler

const LANG_META: Record<string, LangMeta> = {
  javascript: {
    displayName: "JavaScript",
    titleNotes:
      "JavaScript runs in every web browser on earth. It's the reason " +
      "websites do anything at all. It was also, famously, designed in ten days.",
    videoNotes: [
      "So let's start with a simple data conversion. We start with a string " +
        "containing the 1 character and we cast it to the number 1. Works perfectly.",
      "Now let's try three.\n[pause — let the audience read the command]",
      "Well, it still got the first one right.",
    ],
    explanation: [
      [
        { text: "map",     color: FN_CLR,  bold: true, mono: true },
        { text: " passes: fn(value, ",    color: DIM_CLR, mono: true },
        { text: "index",   color: ACCENT,  bold: true, mono: true },
        { text: ", array)", color: DIM_CLR, mono: true },
      ],
      [
        { text: "parseInt", color: FN_CLR, bold: true, mono: true },
        { text: " reads:  (string, ",     color: DIM_CLR, mono: true },
        { text: "radix",   color: ACCENT,  bold: true, mono: true },
        { text: ")",       color: DIM_CLR, mono: true },
      ],
    ],
    explanationDetail:
      "map calls fn(value, index, array) — 3 args. parseInt only wants " +
      "(string, radix). The index leaks in as the radix: base-1 doesn't " +
      "exist, and \"3\" isn't valid in base-2.",
    explanationNotes: "The array index leaks in as parseInt's radix argument.",
  },

  python: {
    displayName: "Python",
    titleNotes:
      "Python is what everyone learns to code with now. It's in data science, " +
      "machine learning, automation — it's everywhere. But every programmer " +
      "knows that the absolute dumbest thing you can do in Python is:",
    videoNotes: [
      "OK. I kid. I don't love python, but I know a lot of programmers do.",
      "So in python, we're going to look at exception handling. Our reraise " +
        "function raises an exception. It propagates up correctly. That's " +
        "exactly how exceptions are supposed to work.",
      "finally_return also raises an exception.\n[pause]",
      "But the exception is gone.",
    ],
    explanation: [
      [
        { text: "finally", color: FN_CLR, bold: true, mono: true },
        { text: ":  always runs — even with exception pending", color: DIM_CLR, mono: true },
      ],
      [
        { text: "return", color: ACCENT, bold: true, mono: true },
        { text: " in finally discards the pending exception", color: DIM_CLR, mono: true },
      ],
    ],
    explanationDetail:
      "finally always runs, even with an exception in flight. A return " +
      "inside it discards that exception on the way out — no warning, no " +
      "traceback.",
    explanationNotes: "return in finally discards the exception. No warning, no traceback.",
  },

  rust: {
    displayName: "Rust",
    titleNotes:
      "Rust is designed for memory safety. It is intended to be 'correct by " +
      "construction' at compile time. But it's syntax can be a bit obtuse " +
      "even to the most experienced of programmers.",
    videoNotes: [
      "Here, we've got a simple rust program where we define a vector, we " +
        "borrow (or 'check out') the vector to read the data, and then we try " +
        "to add a new value BEFORE the reader 'checks in' the vector data. A " +
        "big memory 'no-no' to write to something someone else has checked out.",
      "And rust is supposed to catch any memory errors at compile time, but " +
        "this compiles fine. OK. So let's run it.",
      "Panics. Rust lost it's compile time memory safety.",
    ],
    explanation: [
      [
        { text: "compile-time", color: "50FA7B", bold: true, mono: true },
        { text: "  →  ", color: DIM_CLR, mono: true },
        { text: "✓", color: "50FA7B", bold: true },
        { text: "  (borrow checker approved)", color: DIM_CLR, mono: true },
      ],
      [
        { text: "runtime", color: ACCENT, bold: true, mono: true },
        { text: "      →  ", color: DIM_CLR, mono: true },
        { text: "BorrowMutError", color: ACCENT, bold: true, mono: true },
      ],
    ],
    explanationDetail:
      "RefCell moves borrow-checking from compile time to runtime — the " +
      "programmer tells Rust 'don't worry, I've got this,' and the compiler " +
      "steps back.",
    explanationNotes: "RefCell defers the borrow check from compile time to runtime.",
  },

  typescript: {
    displayName: "TypeScript",
    titleNotes:
      "Next we have JavaScript's big brother, TypeScript. Typescript is " +
      "basically JavaScript with a type-checker bolted on. Its entire " +
      "purpose is to catch mistakes before your code runs.",
    videoNotes: [
      "So we start by defining a new Type and a Function that uses that " +
        "Type. And as expected, when I pass in an object with an extra " +
        "property to it, TypeScript catches it. Great. That's the whole pitch.",
      "But what happens if I assign that exact same value to a variable " +
        "first.\n[pause]",
      "TypeScript says that it's A-OK now. Perfect.",
    ],
    explanation: [
      [
        { text: "getX", color: FN_CLR, bold: true, mono: true },
        { text: "({ x:1, ",  color: DIM_CLR, mono: true },
        { text: "y:2",       color: ACCENT,  bold: true, mono: true },
        { text: " })  →  ",  color: DIM_CLR, mono: true },
        { text: "error",     color: ACCENT,  bold: true, mono: true },
      ],
      [
        { text: "const p = {…};  ", color: DIM_CLR, mono: true },
        { text: "getX", color: FN_CLR, bold: true, mono: true },
        { text: "(p)  →  ", color: DIM_CLR, mono: true },
        { text: "1", color: FN_CLR, bold: true, mono: true },
      ],
    ],
    explanationDetail:
      "Fresh object literals get strict excess-property checking. Variables " +
      "get \"widened\" — TypeScript forgets the extra property once it's " +
      "stored.",
    explanationNotes: "Fresh literals get checked strictly; variables get widened.",
  },

  sql: {
    displayName: "SQL",
    titleNotes:
      "SQL is everybody's favorite declarative language. You don't tell it " +
      "how to do it's job, you just tell it what job you want it to do.",
    videoNotes: [
      "In this example, we start with a simple employee table with an id, a " +
        "name, and the id of their manager.",
      "And say we want to find every employee who is not a manager. A quick " +
        "glance at the manager_id column says the managers are ids 1, 2 and " +
        "3 and Dave and Eve are the ICs. It checks out.",
      "Now what happens when we add new managers? We have to keep our list " +
        "of manager ids updated manually. So instead of a hardcoded list, " +
        "I'll replace it with a query that fetches the manager IDs from the " +
        "table itself, and I should get the same answer.\n[pause]",
      "But I don't.",
    ],
    explanation: [
      [
        { text: "id ≠ 1  ", color: DIM_CLR, mono: true },
        { text: "AND", color: ACCENT, bold: true, mono: true },
        { text: "  id ≠ 2  ", color: DIM_CLR, mono: true },
        { text: "AND", color: ACCENT, bold: true, mono: true },
        { text: "  id ≠ ", color: DIM_CLR, mono: true },
        { text: "NULL", color: ACCENT, bold: true, mono: true },
      ],
      [
        { text: "id ≠ NULL", color: DIM_CLR, mono: true },
        { text: "  →  ", color: DIM_CLR, mono: true },
        { text: "UNKNOWN", color: ACCENT, bold: true, mono: true },
        { text: "  (not FALSE)", color: DIM_CLR, mono: true },
      ],
    ],
    explanationDetail:
      "Alice (the CEO) has manager_id = NULL. NOT IN expands to id≠1 AND " +
      "id≠2 AND id≠NULL — and anything compared to NULL is UNKNOWN, not " +
      "false. WHERE can never be true. Zero rows.",
    explanationNotes: "One NULL in the subquery poisons the whole NOT IN.",
  },

  php: {
    displayName: "PHP",
    titleNotes:
      "PHP powers something like 75% of the web. WordPress runs on PHP. \n\n" +
      "Whether that's comforting or alarming, I'll leave to you.",
    videoNotes: [
      "I'm building a PHP array: a group of key and value pairs. I have " +
        "four entries: true, 1, 1.9, and \"1\". Four different keys.",
      "So, I've stored all four values, let's take a look at what I've " +
        "got.\n[pause]",
      "One.",
    ],
    explanation: [
      [
        { text: "true",  color: ACCENT, bold: true, mono: true },
        { text: "  →  1    ",          color: DIM_CLR, mono: true },
        { text: "1.9",   color: ACCENT, bold: true, mono: true },
        { text: "  →  1",             color: DIM_CLR, mono: true },
      ],
      [
        { text: '"1"',   color: ACCENT, bold: true, mono: true },
        { text: "  →  1    ",          color: DIM_CLR, mono: true },
        { text: "1",     color: ACCENT, bold: true, mono: true },
        { text: "  →  1",             color: DIM_CLR, mono: true },
      ],
    ],
    explanationDetail:
      "PHP casts array keys: bools and floats become ints, numeric strings " +
      "become numbers. All four keys land on 1 — last write wins.",
    explanationNotes: "PHP casts every one of those keys down to the same int.",
  },

  terraform: {
    displayName: "Terraform",
    titleNotes:
      "Terraform is a DevOps tool; it lets you describe your infrastructure " +
      "as code. Instead of clicking around in AWS console, you write a file " +
      "that says:",
    videoNotes: [
      "\"I want three servers, call them pluto, mars, and jupiter.\" Then " +
        "you apply and boom, three servers created, each with a unique id.",
      "But on second thought, I only wanted my servers named after \"real " +
        "planets\", so let's try again with just \"mars and jupiter\" and " +
        "we'll see how terraform handles this.\n[pause]",
      "It wants to update two servers and destroy one.",
    ],
    explanation: [
      [
        { text: "count", color: FN_CLR, bold: true, mono: true },
        { text: "[0] [1] [2]", color: DIM_CLR, mono: true },
        { text: "  →  index = identity", color: DIM_CLR, mono: true },
      ],
      [
        { text: "remove", color: ACCENT, bold: true, mono: true },
        { text: " item[0]", color: DIM_CLR, mono: true },
        { text: "  →  ", color: DIM_CLR, mono: true },
        { text: "[1]→[0]", color: ACCENT, bold: true, mono: true },
        { text: ", ", color: DIM_CLR, mono: true },
        { text: "[2]→[1]", color: ACCENT, bold: true, mono: true },
        { text: " — cascade", color: DIM_CLR, mono: true },
      ],
    ],
    explanationDetail:
      "count uses list position as identity, not the name. Remove index 0 " +
      "and everything after it slides down — Terraform reads that as " +
      "updates, and the vacated last slot as a destroy.",
    explanationNotes: "count treats list position as identity, not the name.",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Largest font size (pt) that keeps a single word on one line in a
// 13.33"-wide slide using SF Pro Display bold (~0.65 pt-per-pt char width).
function titleFontSize(name: string): number {
  const slideWidthPt = 960; // 13.33" × 72 pt/in
  const fill = 0.92; // use 92% of width
  const charWidthFactor = 0.65;
  const size = Math.floor((slideWidthPt * fill) / (name.length * charWidthFactor));
  return Math.min(size, 200); // cap for very short names (PHP, SQL, Rust)
}

function runsToTextProps(runs: TextRun[]): PptxGenJS.TextProps[] {
  return runs.map((r) => ({
    text: r.text,
    options: {
      ...(r.color    ? { color: r.color }                    : {}),
      ...(r.bold     ? { bold: true }                         : {}),
      ...(r.mono     ? { fontFace: "Menlo" }                     : {}),
    },
  }));
}

// ─── Video inventory ──────────────────────────────────────────────────────────

const allVideos = fs
  .readdirSync(videosDir)
  .filter((f) => f.endsWith(".mp4"))
  .sort();

if (allVideos.length === 0) {
  console.error(`no MP4s found in ${videosDir} — run 'make capture' first`);
  process.exit(1);
}

// Group by language slug (format: NN-<lang>-NN-<beat>.mp4)
const langOrder: string[] = [];
const videosByLang: Record<string, string[]> = {};

for (const filename of allVideos) {
  const m = filename.match(/^\d+-([a-z]+)-/);
  if (!m) continue;
  const lang = m[1];
  if (!videosByLang[lang]) {
    langOrder.push(lang);
    videosByLang[lang] = [];
  }
  videosByLang[lang].push(filename);
}

// ─── Build deck ───────────────────────────────────────────────────────────────

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33" × 7.5" (16:9)

const BG = "000000";
const FG = "FFFFFF";
const MONO = "Courier New";

// ─── Shared slide layout helpers ─────────────────────────────────────────────
// Three-section title layout so intro and epilogue have identical structure.
// Sections: top line (smaller, wraps), middle word (huge), bottom line (medium).
const FONT = "Helvetica Neue";
const titleSection = (
  slide: PptxGenJS.Slide,
  y: string, h: string, text: string | PptxGenJS.TextProps[],
  fontSize: number,
  color: string = FG
) => {
  const opts: PptxGenJS.TextPropsOptions = {
    x: 0, y, w: "100%", h,
    align: "center", valign: "middle",
    color, bold: true, fontFace: FONT,
    fontSize,
  };
  if (typeof text === "string") {
    slide.addText(text, opts);
  } else {
    slide.addText(text, opts);
  }
};

const titleFooter = (slide: PptxGenJS.Slide) =>
  slide.addText("David Haye", {
    x: 0, y: "88%", w: "100%", h: "10%",
    align: "center", valign: "middle",
    color: "888888", fontSize: 28, fontFace: FONT,
  });

// Shared helper: builds the title text. EVERY is all-caps for emphasis;
// colour stays white — the red reveal is SEVEN on the epilogue slide.
const addTitleText = (slide: PptxGenJS.Slide) =>
  slide.addText(
    "The Dumbest Thing You\nCan Do in EVERY\nProgramming\nLanguage",
    {
      x: 0, y: 0, w: "100%", h: "86%",
      align: "center", valign: "middle",
      color: FG, bold: true, fontFace: FONT,
      fontSize: 80,
    }
  );

// Joke slide: the deck's literal first slide is called "Title Slide" —
// the bit before the bit. Same footer/layout style as the real intro below.
const jokeTitle = pptx.addSlide();
jokeTitle.background = { color: BG };
jokeTitle.addText("Title Slide", {
  x: 0, y: 0, w: "100%", h: "86%",
  align: "center", valign: "middle",
  color: FG, bold: true, fontFace: FONT,
  fontSize: titleFontSize("Title Slide"),
});
titleFooter(jokeTitle);
jokeTitle.addNotes(
  "Hello, I'm David Haye. One of the core rules of \"Lightning Talks\" is " +
  "that these talks are not supposed to be \"Work Related\". So I'm hoping " +
  "that you'll agree that I'm bending, but not breaking that rule by " +
  "sharing with you"
);

const intro = pptx.addSlide();
intro.background = { color: BG };
addTitleText(intro);
titleFooter(intro);
intro.addNotes("\"The Dumbest Thing You can Do In Every Programming Language\"");

// Language sections
for (const lang of langOrder) {
  const meta = LANG_META[lang];
  if (!meta) {
    console.warn(`warning: no metadata for language "${lang}" — excluded from deck`);
    continue;
  }

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: BG };
  titleSlide.addText(meta.displayName, {
    x: 0, y: 0, w: "100%", h: "100%",
    align: "center", valign: "middle",
    color: FG, bold: true, fontFace: "Helvetica Neue",
    fontSize: titleFontSize(meta.displayName),
  });
  titleSlide.addNotes(meta.titleNotes);

  // Video slides
  for (const [i, filename] of videosByLang[lang].entries()) {
    const slide = pptx.addSlide();
    slide.background = { color: BG };
    slide.addMedia({ type: "video", path: path.join(videosDir, filename), x: 0, y: 0, w: "100%", h: "100%" });
    slide.addNotes(meta.videoNotes[i] ?? "[speaker notes]");
  }

  // Explanation slide: code annotation on top (unchanged), a plain-prose
  // detail block below it so the audience can read the "full" mechanism
  // while the speaker only says the one-line headline (see explanationNotes).
  const exSlide = pptx.addSlide();
  exSlide.background = { color: BG };
  for (const [i, lineRuns] of meta.explanation.entries()) {
    exSlide.addText(runsToTextProps(lineRuns), {
      x: "5%",
      y: `${8 + i * 16}%`,
      w: "90%",
      h: "14%",
      align: "left",
      valign: "middle",
      fontSize: 32,
    });
  }
  exSlide.addText(meta.explanationDetail, {
    x: "5%",
    y: "45%",
    w: "90%",
    h: "45%",
    align: "left",
    valign: "top",
    color: FG,
    fontFace: FONT,
    fontSize: 22,
    lineSpacingMultiple: 1.3,
  });
  exSlide.addNotes(meta.explanationNotes);
}

// Epilogue slide 1: exact copy of intro — lets the audience sit with "EVERY"
// before the reveal.
const epilogue1 = pptx.addSlide();
epilogue1.background = { color: BG };
addTitleText(epilogue1);
titleFooter(epilogue1);
epilogue1.addNotes("The dumbest thing you can do in");

// Epilogue slide 2: same title + SEVEN overlaid over EVERY.
// Position matches where "EVERY" sits on line 2 (y≈25%).
const epilogue2 = pptx.addSlide();
epilogue2.background = { color: BG };
addTitleText(epilogue2);
// Red "s" overlaid after "Language" on line 4.
// Position is estimated from font metrics; tune x/y in Keynote if off.
epilogue2.addText("s", {
  x: "69%", y: "60%", w: "8%", h: "14%",
  align: "left", valign: "top",
  color: SEVEN_CLR, bold: true, fontFace: FONT,
  fontSize: 80,
});
epilogue2.addText("SEVEN", {
  x: "56%", y: "25%", w: "30%", h: "18%",
  align: "center", valign: "middle",
  color: SEVEN_CLR, bold: true, fontFace: FONT,
  fontSize: 80,
});
titleFooter(epilogue2);
epilogue2.addNotes("Seven Programming Languages");

// Write
const slideCount = 1 + langOrder.filter((l) => LANG_META[l]).length * 2 + allVideos.length + 2;
pptx.writeFile({ fileName: outputFile }).then(() => {
  console.log(`built ${slideCount} slides → ${outputFile}`);
});
