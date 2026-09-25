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
const SIX_CLR = "CC0000"; // dark red — the SIX punchline overlay
const FN_CLR   = "8BE9FD"; // cyan — function names
const DIM_CLR  = "AAAAAA"; // grey — punctuation / filler

const LANG_META: Record<string, LangMeta> = {
  javascript: {
    displayName: "JavaScript",
    titleNotes: "• every browser · designed in 10 days",
    videoNotes: [
      "• cast string \"1\" → int, works fine",
      "• try three · [pause]",
      "• first one still right",
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
    explanationNotes: "• map passes 3 args, parseInt takes 2 · index leaks into radix",
  },

  python: {
    displayName: "Python",
    titleNotes: "• everyone learns Python now · dumbest thing you can do is...",
    videoNotes: [
      "• (kidding)",
      "• reraise() raises → propagates correctly, as expected",
      "• finally_return() also raises · [pause]",
      "• exception is gone",
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
    explanationNotes: "• finally always runs · return there discards exception · no warning, no traceback",
  },

  typescript: {
    displayName: "TypeScript",
    titleNotes: "• JS's big brother · type-checker bolted on",
    videoNotes: [
      "• bad object literal → TypeScript throws error",
      "• same value via variable first · [pause]",
      "• now it's A-OK",
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
    explanationNotes: "• fresh literals: strict check · variables: widened, forgets the extra prop",
  },

  sql: {
    displayName: "SQL",
    titleNotes: "• everybody's fave declarative language",
    videoNotes: [
      "• employees table",
      "• NOT IN (1,2,3) → Dave, Eve — checks out",
      "• swap to subquery — not scalable · [pause]",
      "• get nothing instead",
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
    explanationNotes: "• comparing to NULL → UNKNOWN, not false · WHERE never true, zero rows",
  },

  php: {
    displayName: "PHP",
    titleNotes: "• ~75% of the web · WordPress",
    videoNotes: [
      "• 4 assignments, 4 different keys",
      "• what got stored? · [pause]",
      "• just one key/value pair",
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
    explanationNotes: "• bools/floats/numeric strings all cast to int · same key, last write wins",
  },

  terraform: {
    displayName: "Terraform",
    titleNotes: "• DevOps · infrastructure as code",
    videoNotes: [
      "• 3 servers: pluto, mars, jupiter → apply, all created",
      "• only want \"real planets\" now · [pause]",
      "• wants to update 2, destroy 1",
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
    explanationNotes: "• position = identity, not name · cut pluto → rest slides down, cascades",
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
// colour stays white — the red reveal is SIX on the epilogue slide.
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
jokeTitle.addNotes("• name · lightning talks aren't \"work related\" · bending not breaking that");

const intro = pptx.addSlide();
intro.background = { color: BG };
addTitleText(intro);
titleFooter(intro);
intro.addNotes("• title reveal");

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
epilogue1.addNotes("• \"the dumbest thing you can do in...\"");

// Epilogue slide 2: same title + SIX overlaid over EVERY.
// Position matches where "EVERY" sits on line 2 (y≈25%).
const epilogue2 = pptx.addSlide();
epilogue2.background = { color: BG };
addTitleText(epilogue2);
// Red "s" overlaid after "Language" on line 4.
// Position is estimated from font metrics; tune x/y in Keynote if off.
epilogue2.addText("s", {
  x: "69%", y: "60%", w: "8%", h: "14%",
  align: "left", valign: "top",
  color: SIX_CLR, bold: true, fontFace: FONT,
  fontSize: 80,
});
epilogue2.addText("SIX", {
  x: "56%", y: "25%", w: "30%", h: "18%",
  align: "center", valign: "middle",
  color: SIX_CLR, bold: true, fontFace: FONT,
  fontSize: 80,
});
titleFooter(epilogue2);
epilogue2.addNotes("• \"...six programming languages\" [click]");

// Write
const slideCount = 1 + langOrder.filter((l) => LANG_META[l]).length * 2 + allVideos.length + 2;
pptx.writeFile({ fileName: outputFile }).then(() => {
  console.log(`built ${slideCount} slides → ${outputFile}`);
});
