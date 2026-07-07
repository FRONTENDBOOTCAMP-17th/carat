import productsData from "@/data/products.json";

// ─── Types ─────────────────────────────────────────────────────────────────

export type SearchableProduct = {
  id: string;
  name: string;
  description?: string;
  category: string;
  categoryLabel: string;
  href: string;
};

export type SearchResult = {
  direct: SearchableProduct[];   // 직접 매치
  related: SearchableProduct[];  // 연관 상품
  suggestion: string | null;     // 오타 교정 쿼리
};

// ─── Product catalogue ─────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string }> = {
  "best-pieces":   { label: "BEST PIECES" },
  collections:     { label: "COLLECTIONS" },
  "fw-collections":{ label: "FW COLLECTIONS" },
};

// Iris(IRIS ORIGINAL)는 products.json에 없으므로 별도 등록
const ESSENTIAL_ENTRY: SearchableProduct = {
  id: "essential",
  name: "Iris",
  description: "실버 · 18K 골드 · 로즈 골드 — 다이아몬드. 절제와 정밀의 시그니처 피스.",
  category: "essential",
  categoryLabel: "ORIGINAL",
  href: "/essential",
};

export function getAllSearchProducts(): SearchableProduct[] {
  const out: SearchableProduct[] = [ESSENTIAL_ENTRY];

  for (const [cat, items] of Object.entries(productsData)) {
    const meta = CATEGORY_META[cat];
    if (!meta) continue;
    for (const item of items as Array<{ id: string; name: string }>) {
      out.push({
        id: item.id,
        name: item.name,
        category: cat,
        categoryLabel: meta.label,
        href: `/products/${item.id}`,
      });
    }
  }
  return out;
}

// ─── Normalize ─────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[·•\-—\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Levenshtein distance (1-D DP) ─────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const curr: number[] = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    prev = curr;
  }
  return prev[n];
}

// ─── Synonym expansion ─────────────────────────────────────────────────────

const SYNONYMS: Record<string, string[]> = {
  반지:       ["ring", "링"],
  ring:       ["반지", "링"],
  링:         ["반지", "ring"],
  골드:       ["gold"],
  gold:       ["골드"],
  실버:       ["silver"],
  silver:     ["실버"],
  "로즈골드": ["로즈 골드", "rose"],
  다이아:     ["다이아몬드", "diamond"],
  다이아몬드:  ["diamond", "다이아"],
  diamond:    ["다이아몬드"],
  에센셜:     ["essential"],
  essential:  ["에센셜"],
  가을:       ["fw", "f/w"],
  겨울:       ["fw", "f/w"],
  fw:         ["가을", "겨울"],
  "f/w":      ["fw", "가을", "겨울"],
  베스트:     ["best"],
  best:       ["베스트"],
  밴드:       ["band"],
  band:       ["밴드"],
  이터니티:   ["eternity"],
  eternity:   ["이터니티"],
};

function expandWords(words: string[]): string[] {
  const expanded = new Set<string>(words);
  for (const w of words) {
    for (const syn of SYNONYMS[w] ?? []) {
      normalize(syn).split(" ").forEach((sw) => expanded.add(sw));
    }
  }
  return Array.from(expanded);
}

// ─── Scoring ────────────────────────────────────────────────────────────────

function scoreProduct(p: SearchableProduct, expandedWords: string[]): number {
  const name = normalize(p.name);
  const desc = p.description ? normalize(p.description) : "";
  const cat  = normalize(p.categoryLabel);
  let score = 0;
  for (const w of expandedWords) {
    if (w.length < 1) continue;
    if (name.includes(w)) score += 3;
    if (desc.includes(w)) score += 2;
    if (cat.includes(w))  score += 1;
  }
  return score;
}

// ─── Vocabulary (for fuzzy correction) ─────────────────────────────────────

function buildVocabulary(): string[] {
  const vocab = new Set<string>();
  for (const p of getAllSearchProducts()) {
    normalize(p.name).split(" ").forEach((w) => { if (w.length >= 2) vocab.add(w); });
    if (p.description) normalize(p.description).split(" ").forEach((w) => { if (w.length >= 2) vocab.add(w); });
  }
  // Add synonym keys too
  Object.keys(SYNONYMS).forEach((k) => vocab.add(normalize(k)));
  return Array.from(vocab);
}

function closestVocabWord(queryWord: string, vocab: string[]): string | null {
  if (queryWord.length < 2) return null;
  const threshold = Math.max(1, Math.floor(queryWord.length / 3));
  let best: { word: string; dist: number } | null = null;
  for (const v of vocab) {
    if (Math.abs(v.length - queryWord.length) > threshold + 1) continue;
    const d = levenshtein(queryWord, v);
    if (d <= threshold && (best === null || d < best.dist)) {
      best = { word: v, dist: d };
    }
  }
  return best?.word ?? null;
}

// ─── Main search function ───────────────────────────────────────────────────

export function searchProducts(query: string): SearchResult {
  const q = normalize(query);
  if (!q) return { direct: [], related: [], suggestion: null };

  const words    = q.split(/\s+/).filter(Boolean);
  const expanded = expandWords(words);
  const all      = getAllSearchProducts();

  const scored = all.map((p) => ({ p, score: scoreProduct(p, expanded) }));

  // Direct: score ≥ 2 (description 1단어 이상 매치)
  const directSorted = scored
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score);

  const direct   = directSorted.map((s) => s.p);
  const directIds = new Set(direct.map((p) => p.id));

  // Related: 같은 카테고리이거나 score≥1 (직접 매치 제외)
  const directCats = new Set(direct.map((p) => p.category));
  const related = scored
    .filter((s) => !directIds.has(s.p.id) && (s.score >= 1 || directCats.has(s.p.category)))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((s) => s.p);

  // 오타 교정: 직접 매치 0개일 때만
  let suggestion: string | null = null;
  if (direct.length === 0) {
    const vocab = buildVocabulary();
    const corrected = words.map((w) => closestVocabWord(w, vocab) ?? w);
    const correctedQuery = corrected.join(" ");

    if (correctedQuery !== q) {
      // 교정된 쿼리로 실제 결과가 나오는지 검증
      const correctedExpanded = expandWords(corrected);
      const hasResults = all.some((p) => scoreProduct(p, correctedExpanded) >= 2);
      if (hasResults) suggestion = correctedQuery;
    }
  }

  return { direct, related, suggestion };
}
