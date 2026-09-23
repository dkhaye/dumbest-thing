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

const ACCENT  = "FF5555"; // red  — the "oh no" colour
const FN_CLR  = "8BE9FD"; // cyan — function names
const DIM_CLR = "AAAAAA"; // grey — punctuation / filler

const LANG_META: Record<string, LangMeta> = {
  javascript: {
    displayName: "JavaScript",
    titleNotes: "• familiar language, JS",
    videoNotes: [
      "• basic cast: string → int",
      "• more strings? → wait, what happened?",
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

  sql: {
    displayName: "SQL",
    titleNotes: "• everyone's fave declarative language",
    videoNotes: [
      "• NOT IN — checking exclusion",
      "• find all ICs → ???",
    ],
    explanation: [
      [
        { text: "id NOT IN (1, 2, ", color: DIM_CLR, mono: true },
        { text: "NULL", color: ACCENT, bold: true, mono: true },
        { text: ")", color: DIM_CLR, mono: true },
      ],
      [
        { text: "x = NULL", color: DIM_CLR, mono: true },
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

// Intro slide
const intro = pptx.addSlide();
intro.background = { color: BG };
intro.addText("The Dumbest Thing You Can Do in Every Programming Language", {
  x: 0, y: 0, w: "100%", h: "85%",
  align: "center", valign: "bottom",
  color: FG, bold: true, fontFace: "Helvetica Neue",
  fontSize: 120, shrinkText: true,
});
intro.addText("David Haye", {
  x: 0, y: "88%", w: "100%", h: "10%",
  align: "center", valign: "middle",
  color: "888888", fontSize: 28, fontFace: "Helvetica Neue",
});
intro.addNotes("[speaker notes]");

// Language sections
for (const lang of langOrder) {
  const meta = LANG_META[lang];
  if (!meta) {
    console.warn(`warning: no metadata for language "${lang}" — skipping title + explanation slides`);
    // Still add the videos even without metadata
    for (const filename of videosByLang[lang]) {
      const slide = pptx.addSlide();
      slide.background = { color: BG };
      slide.addMedia({ type: "video", path: path.join(videosDir, filename), x: 0, y: 0, w: "100%", h: "100%" });
    }
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

// Epilogue — corrected title
const epilogue = pptx.addSlide();
epilogue.background = { color: BG };
epilogue.addText([
  { text: "The Dumbest Thing You Can Do in ",
    options: { color: FG,     bold: true, fontFace: "Helvetica Neue" } },
  { text: "Every",
    options: { color: FG,     bold: true, fontFace: "Helvetica Neue", strike: true } },
  { text: " Seven",
    options: { color: ACCENT, bold: true, fontFace: "Helvetica Neue" } },
  { text: " Programming Language",
    options: { color: FG,     bold: true, fontFace: "Helvetica Neue" } },
  { text: "s",
    options: { color: FG,     bold: true, fontFace: "Helvetica Neue" } },
], {
  x: 0, y: 0, w: "100%", h: "100%",
  align: "center", valign: "middle",
  fontSize: 72, shrinkText: true,
});
epilogue.addNotes("• callback to the title\n• it was seven, not every");

// Write
const slideCount = 1 + langOrder.filter((l) => LANG_META[l]).length * 2 + allVideos.length + 1;
pptx.writeFile({ fileName: outputFile }).then(() => {
  console.log(`built ${slideCount} slides → ${outputFile}`);
});
