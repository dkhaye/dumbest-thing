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
  explanation: TextRun[][];   // one inner array per line
  explanationNotes: string;
}

const ACCENT   = "FF5555"; // red  — the "oh no" colour (explanation slides)
const SEVEN_CLR = "CC0000"; // dark red — the SEVEN punchline overlay
const FN_CLR   = "8BE9FD"; // cyan — function names
const DIM_CLR  = "AAAAAA"; // grey — punctuation / filler

const LANG_META: Record<string, LangMeta> = {
  javascript: {
    displayName: "JavaScript",
    titleNotes: "• familiar language, JS",
    videoNotes: [
      "• basic cast: string → int",
      "• more strings? → wait for it",
      "• [click] → punchline",
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
    explanationNotes:
      "• map passes (value, index, array) — 3 args\n" +
      "• parseInt(string, radix) — only reads 2\n" +
      "• index leaks in as radix: 0=ok, 1=invalid, 2=base2",
  },

  python: {
    displayName: "Python",
    titleNotes: "• brew install python3\n• (no, actually...)",
    videoNotes: [
      "• brew install python3 (no enter — joke lands)",
      "• backspace → real demo: exceptions propagate",
      "• return in finally — wait for it",
      "• [click] → punchline",
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
    explanationNotes:
      "• finally always runs, even when an exception is pending\n" +
      "• return in finally discards the pending exception\n" +
      "• no warning, no traceback — silent data loss",
  },

  rust: {
    displayName: "Rust",
    titleNotes:
      "• Rust is designed for memory safety\n" +
      "• 'correct by construction' at compile time\n" +
      "• syntax can be obtuse even to experienced programmers",
    videoNotes: [
      "• vector, borrow to read, write before reader returns — memory no-no",
      "• compiles fine — wait for it",
      "• [click] → runtime panic",
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
    explanationNotes:
      "• RefCell defers borrow checking to runtime\n" +
      "• programmer says 'I've got this' — compiler steps back\n" +
      "• should have left the checking to the professionals",
  },

  typescript: {
    displayName: "TypeScript",
    titleNotes: "• TypeScript",
    videoNotes: [
      "• fresh literal, extra property → error",
      "• same object via variable — wait for it",
      "• [click] → punchline",
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
    explanationNotes:
      "• fresh object literals are structurally checked at the call site\n" +
      "• variables are widened — TypeScript forgets the extra property\n" +
      "• same object, same data, different type treatment",
  },

  sql: {
    displayName: "SQL",
    titleNotes: "• everyone's fave declarative language",
    videoNotes: [
      "• employees table — who are the managers?",
      "• NOT IN hardcoded list → Dave and Eve",
      "• NOT IN subquery — wait for it",
      "• [click] → punchline",
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
    explanationNotes:
      "• NULL = unknown (not zero, not empty)\n" +
      "• NOT IN expands: x≠1 AND x≠2 AND x≠NULL\n" +
      "• x≠NULL → UNKNOWN → WHERE never passes → zero rows",
  },

  php: {
    displayName: "PHP",
    titleNotes: "• PHP",
    videoNotes: [
      "• four assignments, four distinct-looking keys",
      "• print_r — wait for it",
      "• [click] → punchline",
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
    explanationNotes:
      "• PHP array keys are only integers or strings\n" +
      "• bools, floats, numeric strings all cast to int\n" +
      "• last write wins — four writes, one slot",
  },

  terraform: {
    displayName: "Terraform",
    titleNotes: "• Terraform",
    videoNotes: [
      "• type config, terraform apply",
      "• demote pluto — wait for it",
      "• [click] → plan shows cascade",
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
    explanationNotes: "• count uses LIST INDEX as resource identity\n• remove item[0]: [1]→[0], [2]→[1] — Terraform sees 'updates'\n• use for_each (value-based identity) to fix this",
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
jokeTitle.addNotes("[speaker notes]");

const intro = pptx.addSlide();
intro.background = { color: BG };
addTitleText(intro);
titleFooter(intro);
intro.addNotes("[speaker notes]");

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

  // Explanation slide
  const exSlide = pptx.addSlide();
  exSlide.background = { color: BG };
  for (const [i, lineRuns] of meta.explanation.entries()) {
    exSlide.addText(runsToTextProps(lineRuns), {
      x: "5%",
      y: `${30 + i * 28}%`,
      w: "90%",
      h: "24%",
      align: "left",
      valign: "middle",
      fontSize: 36,
    });
  }
  exSlide.addNotes(meta.explanationNotes);
}

// Epilogue slide 1: exact copy of intro — lets the audience sit with "EVERY"
// before the reveal.
const epilogue1 = pptx.addSlide();
epilogue1.background = { color: BG };
addTitleText(epilogue1);
titleFooter(epilogue1);
epilogue1.addNotes("• callback to the title");

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
epilogue2.addNotes("• it was seven, not every");

// Write
const slideCount = 1 + langOrder.filter((l) => LANG_META[l]).length * 2 + allVideos.length + 2;
pptx.writeFile({ fileName: outputFile }).then(() => {
  console.log(`built ${slideCount} slides → ${outputFile}`);
});
