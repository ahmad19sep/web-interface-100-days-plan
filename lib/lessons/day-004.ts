// Day 4 — authored lesson: tokenization across English, Urdu and Roman Urdu.

import type { Lesson } from "./types";

export const DAY_004: Lesson = {
  day: 4,
  slug: "tokenization-urdu-english",
  title: "Tokenization — how models actually read Urdu and English",
  module: "AI Engineering Foundations",
  projectId: "P2",
  projectPhase: "PROJECT START",
  durationMinutes: 165,
  difficulty: "Core",
  prerequisites: [
    "P1 shipped (you'll reuse its cost table)",
    "Basic familiarity with Python strings",
  ],
  objectives: [
    "Explain the pipeline: characters → UTF-8 bytes → tokens → token IDs",
    "Count tokens with a real tokenizer and compare across languages",
    "Measure why Urdu costs more tokens than English for the same meaning",
    "Chart token counts for 30+ paired samples including code-switching",
    "Write three practical design conclusions for multilingual products",
  ],
  whyItMatters:
    "Models don't read words — they read tokens, and tokenizers are trained mostly on English. The same sentence in Urdu can cost several times the tokens of its English translation, which multiplies cost, eats context window, and adds latency. If you're building for Pakistani users, tokenization isn't trivia — it's a line item in your budget and a constraint on your design.",
  jobRelevance:
    "You can quantify multilingual cost and context impact before a product launches — with charts. Most teams discover the 'Urdu is 3× the price' problem in production; you'll flag it in the design review.",
  missionBrief:
    "Measure how bytes, characters, words and tokens diverge across English, Urdu and Roman Urdu. Build a paired-sample dataset, count everything with a real tokenizer, chart the differences, and end with three design conclusions you'd defend in a review. This starts Project P2 — the tokenization lab.",
  finalEvidence:
    "A visual tokenization report — charts plus written conclusions — good enough to post publicly or walk through in an interview.",

  videos: [
    {
      id: "concept",
      title: "Concept — tokens, not words",
      kind: "concept",
      required: true,
      minutes: 12,
    },
    {
      id: "walkthrough",
      title: "Code walkthrough — the measurement notebook",
      kind: "walkthrough",
      required: false,
      minutes: 15,
    },
  ],

  sections: [
    {
      id: "pipeline",
      title: "From characters to token IDs",
      blocks: [
        {
          t: "p",
          text: "Text reaches a model through a pipeline. First, characters become UTF-8 bytes: English letters take 1 byte each, Urdu script characters take 2 bytes each. Then a trained tokenizer (BPE — you'll build one tomorrow) greedily groups byte sequences it has seen often into single tokens, and maps each to an integer ID. The model only ever sees those integers.",
        },
        {
          t: "code",
          lang: "python",
          code: `text = "Hello سلام"
print(len(text))                    # 10 characters
print(len(text.encode("utf-8")))    # 14 bytes — Urdu chars are 2 bytes each

import tiktoken
enc = tiktoken.get_encoding("o200k_base")
ids = enc.encode(text)
print(len(ids), ids)                # far fewer tokens for "Hello" than for "سلام"
print([enc.decode([i]) for i in ids])  # see what each token actually holds`,
        },
        {
          t: "p",
          text: "The key insight: a token is 'a chunk the tokenizer saw often during training'. 'Hello' is one token because English dominates the training data. An Urdu word the tokenizer rarely saw shatters into many byte-level fragments — same meaning, several times the tokens.",
        },
        {
          t: "callout",
          kind: "info",
          title: "Words are a lie",
          text: "Never estimate cost in words. 'unbelievable' is 1 token; 'ناقابل یقین' can be 6+. The only honest units are tokens, and the only honest way to count them is the actual tokenizer.",
        },
      ],
    },
    {
      id: "consequences",
      title: "Why token inflation hits cost, context and latency",
      blocks: [
        {
          t: "list",
          items: [
            "Cost — providers bill per token: if Urdu inflates 3×, an Urdu-first product pays 3× for the same conversation",
            "Context — a 128k-token window holds 3× less Urdu conversation history; RAG chunks shrink in effective size",
            "Latency — generation is per-token: the same reply in Urdu takes proportionally longer to stream",
            "Quality — words shattered into fragments carry weaker learned representations; rare-language quality partly IS a tokenization problem",
          ],
        },
        {
          t: "p",
          text: "Roman Urdu ('Assalam o Alaikum' in Latin letters) usually sits between English and Urdu script: Latin characters are 1 byte and share sub-word pieces with English, but the words themselves are still rare in training data. Your measurements today will show exactly where it lands — that's a finding worth publishing, because very few people have charted it.",
        },
        {
          t: "callout",
          kind: "interview",
          title: "Interview question you can now answer",
          text: "\"Why is the same prompt more expensive in some languages?\" — BPE tokenizers compress what they saw most in training; under-represented languages fragment into more tokens per word, multiplying cost, context usage and generation latency.",
        },
        {
          t: "callout",
          kind: "job",
          title: "What an employer sees",
          text: "A measured multilingual cost analysis with charts — evidence you de-risk products with data, exactly what a team building for South Asian markets needs.",
        },
      ],
    },
  ],

  lab: {
    intro:
      "Build the measurement notebook in projects/p2/. Every number you report today comes from code you ran, not from a blog post.",
    steps: [
      {
        id: "setup",
        title: "Start P2 and install the tools",
        instruction: "Create the project folder and install tiktoken + matplotlib.",
        command:
          "mkdir -p projects/p2 && pip install tiktoken matplotlib && touch projects/p2/__init__.py projects/p2/measure.py",
        expected: "Both packages install; the folder exists.",
      },
      {
        id: "first-count",
        title: "Count one sentence three ways",
        instruction:
          "Take one sentence in English, Urdu script and Roman Urdu ('Where are you going?' / 'آپ کہاں جا رہے ہیں؟' / 'Aap kahan ja rahe hain?') and print characters, UTF-8 bytes and tokens for each.",
        code: {
          lang: "python",
          file: "projects/p2/measure.py",
          code: `import tiktoken

ENC = tiktoken.get_encoding("o200k_base")


def profile(text: str) -> dict:
    return {
        "text": text,
        "chars": len(text),
        "bytes": len(text.encode("utf-8")),
        "tokens": len(ENC.encode(text)),
    }


if __name__ == "__main__":
    for t in [
        "Where are you going?",
        "آپ کہاں جا رہے ہیں؟",
        "Aap kahan ja rahe hain?",
    ]:
        print(profile(t))`,
        },
        command: "python projects/p2/measure.py",
        expected:
          "Three rows; the Urdu-script row has the most tokens even with the fewest words.",
        troubleshooting:
          "If your terminal mangles Urdu glyphs, the counts are still correct — the bytes don't care what the terminal renders. On Windows, `chcp 65001` fixes the display.",
      },
      {
        id: "inspect",
        title: "Look inside the tokens",
        instruction:
          "Decode each token of the Urdu sentence individually to see how words shatter into fragments.",
        command: `python -c "import tiktoken; e=tiktoken.get_encoding('o200k_base'); print([e.decode([i]) for i in e.encode('آپ کہاں جا رہے ہیں؟')])"`,
        expected:
          "A list where several entries are partial words or lone marks — the fragmentation you'll chart.",
        explanation:
          "This picture — one word split across 3 tokens — is the whole story of multilingual token inflation.",
      },
      {
        id: "dataset",
        title: "Build the paired dataset (30+ triples)",
        instruction:
          "Create projects/p2/samples.py: a list of dicts with the same meaning in en / ur / roman. Cover greetings, questions, numbers ('میرے پاس 250 روپے ہیں'), punctuation-heavy lines, and at least five code-switched sentences ('Yaar, meeting 3 baje hai, don't be late') — that's how Pakistanis actually text.",
        expected: "len(SAMPLES) >= 30, each with en/ur/roman keys.",
        commonError:
          "Translating word-for-word instead of meaning-for-meaning — the comparison only holds if the triples genuinely say the same thing.",
      },
      {
        id: "measure-all",
        title: "Measure everything to CSV",
        instruction:
          "Loop the dataset through profile(), compute the token ratio versus English, and write projects/p2/results.csv.",
        code: {
          lang: "python",
          file: "projects/p2/measure.py (add)",
          code: `import csv

from .samples import SAMPLES


def measure_all(path: str = "projects/p2/results.csv") -> list[dict]:
    rows = []
    for s in SAMPLES:
        base = len(ENC.encode(s["en"]))
        for lang in ("en", "ur", "roman"):
            p = profile(s[lang])
            p["lang"] = lang
            p["ratio_vs_en"] = round(p["tokens"] / base, 2)
            rows.append(p)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    return rows`,
        },
        expected: "results.csv with 90+ rows (30 samples × 3 languages).",
      },
      {
        id: "charts",
        title: "Chart it",
        instruction:
          "Two matplotlib charts saved as PNGs: (1) average tokens per language as bars, (2) a histogram of the ur/en token ratio. Save to projects/p2/charts/.",
        expected:
          "Two PNG files; the bar chart makes the inflation obvious at a glance.",
        troubleshooting:
          "Urdu text in chart labels may render as boxes without a font that supports Arabic script — use language codes (en/ur/roman) as labels instead; the data, not the glyphs, is the point.",
      },
      {
        id: "cost",
        title: "Turn ratios into rupees",
        instruction:
          "Using P1's price table, compute what 1,000 average chat messages cost in each language. Print a three-line cost comparison.",
        expected:
          "Three currency figures showing the multilingual price gap — your report's headline number.",
      },
    ],
  },

  build: {
    brief:
      "Assemble the tokenization report: a README.md in projects/p2 that presents the charts, the headline cost comparison, the token-fragmentation example, and exactly three design conclusions for multilingual products (e.g. context budgeting for Urdu RAG, when Roman Urdu is a legitimate cost optimization, why per-language cost estimates belong in planning). Write it so a non-engineer PM understands it and an engineer can reproduce it.",
    requirements: [
      "projects/p2/samples.py — 30+ meaning-matched en/ur/roman triples incl. numbers, punctuation, code-switching",
      "projects/p2/results.csv + charts/*.png generated by measure.py (reproducible, not hand-made)",
      "README.md with charts embedded, the 1,000-message cost table, and three defendable conclusions",
      "A tiny test: pytest asserting profile() returns consistent counts for a known string",
    ],
    acceptance: [
      "python -m projects.p2.measure (or your entrypoint) regenerates CSV + charts from scratch",
      "The README's three conclusions each cite a number from your own results",
      "Repo validation chain still green",
    ],
    commonMistakes: [
      "Conclusions copied from articles instead of your data ('Urdu is expensive' — by how much, in YOUR measurement?)",
      "Comparing unmatched sentences (a long Urdu sentence vs a short English one proves nothing)",
      "Charts without axis labels — unreadable in a portfolio",
    ],
    submission: [
      "Paste a results row and the test output in Verification",
      "Submit the commit URL in Verification",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "Your three conclusions should each name a decision, not a fact. Not 'Urdu uses more tokens' but 'an Urdu chatbot needs its context budget planned at ~N× the English estimate — here's my measured N'. Decision + your number = defensible.",
    },
    {
      level: 2,
      title: "Structure",
      body: "README order that works: headline chart → 'same sentence, three costs' table (one vivid example) → method (3 lines: dataset, tokenizer, code link) → the cost-per-1,000-messages table → three conclusions → limitations (one paragraph: single tokenizer, your dataset size). Limitations stated = credibility earned.",
    },
    {
      level: 3,
      title: "Partial implementation",
      body: "Bar chart: import matplotlib.pyplot as plt; means = {l: statistics.mean(r['tokens'] for r in rows if r['lang']==l) for l in ('en','roman','ur')}; plt.bar(means.keys(), means.values()); plt.ylabel('avg tokens per sentence'); plt.title('Same meaning, different token cost'); plt.savefig('projects/p2/charts/avg_tokens.png', dpi=160). Ratio histogram: plt.hist([ur_tokens/en_tokens per sample], bins=12).",
    },
  ],

  verification: {
    intro: "Prove the measurements are real and reproducible.",
    fields: [
      {
        id: "results-row",
        label: "Paste 3 lines from projects/p2/results.csv (one per language)",
        kind: "paste",
        required: true,
        placeholder: "text,chars,bytes,tokens,lang,ratio_vs_en …",
        mustMatch: "(ur|roman)",
        failHelp:
          "Paste actual CSV rows including an 'ur' or 'roman' row — regenerate with your measure script if the file is missing.",
      },
      {
        id: "pytest-output",
        label: "Paste the last line of: python -m pytest projects/p2 -q",
        kind: "paste",
        required: true,
        placeholder: "1 passed in 0.05s",
        mustMatch: "\\d+ passed",
        failHelp: "At least the profile() consistency test must exist and pass.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL for days 4 work (P2 start)",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp: "Repo → Commits → latest → copy the URL.",
      },
      {
        id: "conclusions",
        label:
          "My README states three design conclusions, each citing a number from my own results",
        kind: "attest",
        required: true,
        hint: "Numbers from YOUR csv — that's what makes the report yours.",
      },
    ],
  },

  reflectionPrompts: [
    "What was your measured Urdu-vs-English token ratio, and did it surprise you?",
    "Explain to a PM why the Urdu version of the product costs more to run.",
    "Which of your three conclusions would change a real product decision?",
    "What interview question could be asked from today's topic?",
  ],

  shipFields: [
    {
      id: "commit-url",
      label: "Commit or report URL for today's work",
      kind: "url",
      required: true,
      placeholder: "https://github.com/…",
      mustMatch: "^https://",
    },
    {
      id: "ship-note",
      label: "One-line technical note for your portfolio",
      kind: "text",
      required: true,
      placeholder:
        "Measured multilingual tokenization: 30+ en/ur/roman triples, charts, and a cost-per-1,000-messages comparison",
    },
  ],

  references: [
    { label: "Karpathy — minBPE", url: "https://github.com/karpathy/minbpe" },
    {
      label: "Karpathy — microGPT",
      url: "https://karpathy.github.io/2026/02/12/microgpt/",
    },
    { label: "tiktoken", url: "https://github.com/openai/tiktoken" },
  ],

  nextDayPreview:
    "Day 5: stop treating the tokenizer as a black box — implement BPE yourself, train it on a bilingual corpus, and see exactly why Urdu fragments.",

  authored: true,
};
