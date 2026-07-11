// Day 5 — authored lesson: implement BPE from first principles.

import type { Lesson } from "./types";

export const DAY_005: Lesson = {
  day: 5,
  slug: "mini-bpe-tokenizer",
  title: "Implement a mini BPE tokenizer from first principles",
  module: "AI Engineering Foundations",
  projectId: "P2",
  projectPhase: "BUILD",
  durationMinutes: 210,
  difficulty: "Deep",
  prerequisites: [
    "Day 4's measurements (you'll explain them with today's code)",
    "Comfort with Python dicts and loops — today is real programming",
  ],
  objectives: [
    "Implement get_stats and merge — the two primitives of byte-pair encoding",
    "Train a tokenizer on a bilingual English/Urdu corpus",
    "Implement encode and decode and prove round-trip correctness with tests",
    "Compare compression ratios by language and explain Day 4's inflation from the inside",
  ],
  whyItMatters:
    "Yesterday you observed that Urdu fragments into more tokens; today you'll know exactly why, because you'll write the algorithm that decides it. BPE is ~60 lines of Python, and building it once permanently upgrades your intuition about vocabulary size, compression, out-of-vocabulary behavior and why tokenizer choice shapes multilingual quality. This is the 'build the primitive' day of week 1.",
  jobRelevance:
    "'Have you implemented BPE?' is a real interview differentiator — and reasoning about tokenizer behavior from first principles is what lets you debug weird model behavior (spacing bugs, glued words, price surprises) that stumps API-only engineers.",
  missionBrief:
    "Code byte-pair encoding from scratch: count pair frequencies, merge the most frequent pair, repeat to a target vocabulary, then encode and decode any text. Train it on a small bilingual corpus, prove every test string round-trips exactly, and report compression ratios by language.",
  finalEvidence:
    "A clean tokenizer module with passing round-trip tests, per-language compression numbers, and a written explanation of one surprising Urdu result.",

  videos: [
    {
      id: "concept",
      title: "Concept — the merge loop, drawn slowly",
      kind: "concept",
      required: true,
      minutes: 15,
    },
    {
      id: "walkthrough",
      title: "Code walkthrough — 60 lines of BPE",
      kind: "walkthrough",
      required: false,
      minutes: 22,
    },
  ],

  sections: [
    {
      id: "idea",
      title: "The whole algorithm in one paragraph",
      blocks: [
        {
          t: "p",
          text: "Start from raw UTF-8 bytes: every text is a sequence of integers 0–255, so the starting vocabulary has 256 entries and nothing is ever out-of-vocabulary. Training is one loop: count how often each adjacent pair of ids occurs, take the most frequent pair, invent a new id for it (256, then 257, …), replace every occurrence, repeat until you reach the target vocabulary size. That ordered list of merges IS the tokenizer. Encoding replays the merges on new text; decoding concatenates each id's bytes back together.",
        },
        {
          t: "output",
          label: "training on 'aaabdaaabac', three merges",
          code: `bytes:   a a a b d a a a b a c
merge 1: (a,a) → Z        Z a b d Z a b a c
merge 2: (Z,a) → Y        Y b d Y b a c
merge 3: (Y,b) → X        X d X a c        ← 11 bytes became 5 tokens`,
        },
        {
          t: "p",
          text: "That's compression by frequency: whatever the training corpus repeats most becomes a single token. Now Day 4 explains itself — English dominates real training corpora, so English chunks earn merges early and become short token sequences; Urdu byte-pairs occur rarely, earn few merges, and stay fragmented.",
        },
        {
          t: "callout",
          kind: "info",
          title: "Why bytes and not characters",
          text: "Byte-level BPE never meets an unknown symbol: emoji, Urdu, code — everything is bytes 0–255 before merging begins. The cost is that one Urdu character is already 2 bytes before any merge helps it.",
        },
      ],
    },
    {
      id: "pieces",
      title: "The three functions you'll write",
      blocks: [
        {
          t: "list",
          items: [
            "get_stats(ids) — walk the sequence once, count every adjacent pair into a dict: {(101, 32): 47, …}",
            "merge(ids, pair, idx) — produce a new list where every occurrence of pair is replaced by idx; careful iteration, no overlapping replacements",
            "train(text, vocab_size) — the loop: stats → best pair → merge → record it; returns the ordered merges and the id→bytes vocabulary",
          ],
        },
        {
          t: "p",
          text: "Encoding new text replays merges in training order: keep applying the earliest-learned merge that appears in the sequence until none apply. Decoding is the easy direction — look up each id's bytes in the vocabulary, concatenate, and decode UTF-8. The round-trip test decode(encode(s)) == s for every s is your correctness proof, and it will catch every off-by-one you write today.",
        },
        {
          t: "callout",
          kind: "warn",
          title: "The classic bug",
          text: "In merge(), after replacing a pair you must skip past BOTH consumed elements (i += 2), or 'aaa' with pair (a,a) merges twice into overlapping tokens and your round-trip breaks on exactly one test string. Everyone writes this bug once; write it today where it's cheap.",
        },
        {
          t: "callout",
          kind: "interview",
          title: "Interview question you can now answer",
          text: "\"Walk me through how BPE works.\" — bytes as base vocabulary, greedy most-frequent-pair merges to a target size, encode replays merges in order, decode concatenates bytes. Mention byte-level = no OOV, and that vocabulary size trades compression against embedding-table size.",
        },
      ],
    },
  ],

  lab: {
    intro:
      "Build it bottom-up in projects/p2/bpe.py with a test alongside each piece — the tests are the lab.",
    steps: [
      {
        id: "stats",
        title: "get_stats",
        instruction:
          "Write get_stats(ids: list[int]) -> dict[tuple[int, int], int] counting adjacent pairs.",
        code: {
          lang: "python",
          file: "projects/p2/bpe.py",
          code: `def get_stats(ids: list[int]) -> dict[tuple[int, int], int]:
    counts: dict[tuple[int, int], int] = {}
    for pair in zip(ids, ids[1:]):
        counts[pair] = counts.get(pair, 0) + 1
    return counts`,
        },
        command: `python -c "from projects.p2.bpe import get_stats; print(get_stats([1,2,1,2,3]))"`,
        expected: "{(1, 2): 2, (2, 1): 1, (2, 3): 1}",
      },
      {
        id: "merge",
        title: "merge — and the overlap trap",
        instruction:
          "Write merge(ids, pair, idx) replacing every non-overlapping occurrence. Then test it on the trap input.",
        code: {
          lang: "python",
          file: "projects/p2/bpe.py (add)",
          code: `def merge(ids: list[int], pair: tuple[int, int], idx: int) -> list[int]:
    out: list[int] = []
    i = 0
    while i < len(ids):
        if i < len(ids) - 1 and (ids[i], ids[i + 1]) == pair:
            out.append(idx)
            i += 2  # skip BOTH consumed elements — the classic bug lives here
        else:
            out.append(ids[i])
            i += 1
    return out`,
        },
        command: `python -c "from projects.p2.bpe import merge; print(merge([7,7,7], (7,7), 99))"`,
        expected: "[99, 7] — NOT [99, 99]. If you got [99, 99] you found the overlap bug; fix the skip.",
      },
      {
        id: "corpus",
        title: "Assemble the bilingual corpus",
        instruction:
          "Create projects/p2/corpus.txt: ~2–4 KB of mixed text — reuse Day 4's samples plus a few paragraphs of English and Urdu. Small is fine; the algorithm is the point.",
        expected: "A UTF-8 text file with substantial amounts of both languages.",
      },
      {
        id: "train",
        title: "The training loop",
        instruction: "Write train() and run it to vocab_size 400 on your corpus.",
        code: {
          lang: "python",
          file: "projects/p2/bpe.py (add)",
          code: `def train(text: str, vocab_size: int) -> tuple[dict[tuple[int, int], int], dict[int, bytes]]:
    assert vocab_size >= 256
    ids = list(text.encode("utf-8"))
    merges: dict[tuple[int, int], int] = {}
    vocab: dict[int, bytes] = {i: bytes([i]) for i in range(256)}
    for i in range(vocab_size - 256):
        stats = get_stats(ids)
        if not stats:
            break
        pair = max(stats, key=stats.get)
        idx = 256 + i
        ids = merge(ids, pair, idx)
        merges[pair] = idx
        vocab[idx] = vocab[pair[0]] + vocab[pair[1]]
    return merges, vocab`,
        },
        command: `python -c "from projects.p2.bpe import train; m,v=train(open('projects/p2/corpus.txt',encoding='utf-8').read(),400); print(len(m),'merges'); print([v[i] for i in range(256,266)])"`,
        expected:
          "144 merges, and the first learned tokens printed as bytes — mostly English fragments and spaces, maybe a common Urdu byte-pair.",
        explanation:
          "Look at what got merged first: the corpus's frequency structure, made visible.",
      },
      {
        id: "encode-decode",
        title: "encode and decode",
        instruction:
          "Encoding replays merges in learned order; decoding concatenates vocab bytes.",
        code: {
          lang: "python",
          file: "projects/p2/bpe.py (add)",
          code: `def encode(text: str, merges: dict[tuple[int, int], int]) -> list[int]:
    ids = list(text.encode("utf-8"))
    while len(ids) >= 2:
        stats = get_stats(ids)
        # the applicable pair learned EARLIEST in training goes first
        pair = min(stats, key=lambda p: merges.get(p, float("inf")))
        if pair not in merges:
            break
        ids = merge(ids, pair, merges[pair])
    return ids


def decode(ids: list[int], vocab: dict[int, bytes]) -> str:
    return b"".join(vocab[i] for i in ids).decode("utf-8", errors="replace")`,
        },
        expected: "Both functions import clean — proof comes next.",
      },
      {
        id: "roundtrip",
        title: "Round-trip tests — the correctness proof",
        instruction:
          "Write projects/p2/test_bpe.py: train once on the corpus, then assert decode(encode(s)) == s for adversarial strings — English, Urdu, code-switched, emoji, empty string, and a string with characters NOT in the corpus.",
        code: {
          lang: "python",
          file: "projects/p2/test_bpe.py",
          code: `import pytest

from projects.p2.bpe import decode, encode, train

CORPUS = open("projects/p2/corpus.txt", encoding="utf-8").read()
MERGES, VOCAB = train(CORPUS, 400)

CASES = [
    "Hello, world!",
    "آپ کہاں جا رہے ہیں؟",
    "Yaar meeting 3 baje hai — don't be late 🙂",
    "",
    "zzz never-in-corpus ژژژ",
]


@pytest.mark.parametrize("text", CASES)
def test_round_trip(text):
    assert decode(encode(text, MERGES), VOCAB) == text


def test_merge_no_overlap():
    from projects.p2.bpe import merge
    assert merge([7, 7, 7], (7, 7), 99) == [99, 7]`,
        },
        command: "python -m pytest projects/p2/test_bpe.py -q",
        expected: "6 passed",
        troubleshooting:
          "A failing Urdu round-trip almost always means the overlap bug or a vocab entry built from the wrong pair order (vocab[pair[0]] + vocab[pair[1]] — left then right). Emoji failing means you're decoding per-token instead of concatenating bytes THEN decoding once.",
      },
      {
        id: "compression",
        title: "Compression ratios by language",
        instruction:
          "For each language bucket from Day 4's samples, report bytes/tokens (compression ratio) under YOUR tokenizer. Print a three-line table.",
        expected:
          "English compresses best; Urdu's ratio depends on how much Urdu your corpus had — that's the insight.",
      },
      {
        id: "experiment",
        title: "One experiment: retrain with more Urdu",
        instruction:
          "Double the Urdu portion of the corpus, retrain, re-measure Urdu's compression ratio. Note the before/after numbers — this is tokenizer bias, demonstrated by you, in one afternoon.",
        expected:
          "Urdu's ratio improves measurably — write both numbers down for the README.",
      },
    ],
  },

  build: {
    brief:
      "Finish the tokenizer as a presentable module: clean up bpe.py with docstrings, add a small CLI (train/encode/decode subcommands), write the P2 README section explaining the algorithm in your own words with your compression table and the corpus-bias experiment, and note one surprising Urdu result you can defend.",
    requirements: [
      "projects/p2/bpe.py — get_stats, merge, train, encode, decode, documented",
      "projects/p2/test_bpe.py — round-trip suite incl. the overlap regression test, all green",
      "CLI: python -m projects.p2.bpe encode \"text\" prints ids (argparse subcommands)",
      "README section: algorithm explanation, compression table by language, the more-Urdu retrain experiment with before/after numbers",
    ],
    acceptance: [
      "python -m pytest projects/p2 -q fully green (Day 4's test included)",
      "Round-trip holds for text containing characters absent from the training corpus",
      "The README explains WHY Urdu fragments, referencing your own merge table",
    ],
    commonMistakes: [
      "Testing round-trip only on corpus text (in-distribution) — the empty string and unseen characters are where it breaks",
      "encode() applying merges in frequency order instead of learned order — subtle, wrong, and your tests will catch it",
      "Claiming the ratio numbers without committing the corpus that produced them (irreproducible)",
    ],
    submission: [
      "Paste the test run in Verification",
      "Submit the commit URL in Verification",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "If a round-trip fails, bisect: is encode wrong or decode? decode(list(text.encode('utf-8'))) with no merges must equal text — if that fails, the bug is in decode/vocab. If that passes, print the ids after each merge application in encode and find the first step that diverges.",
    },
    {
      level: 2,
      title: "Architecture",
      body: "Keep train() pure (text in, merges+vocab out) and let the CLI own file I/O — that's what makes the module testable and importable by Day 4's report. Persist a trained tokenizer as JSON: merges as a list of [a, b, idx] triples (JSON keys can't be tuples).",
    },
    {
      level: 3,
      title: "Partial implementation",
      body: "The encode loop's min() trick: stats = get_stats(ids); pair = min(stats, key=lambda p: merges.get(p, float('inf'))); if pair not in merges: break. This finds the applicable pair with the LOWEST merge index — i.e. learned earliest — which exactly replays training order. If you instead pick max by frequency, 'don't' and Urdu ligatures tokenize differently than during training.",
    },
  ],

  verification: {
    intro: "The round-trip suite is the proof — no suite, no tokenizer.",
    fields: [
      {
        id: "pytest-output",
        label: "Paste the last line of: python -m pytest projects/p2 -q",
        kind: "paste",
        required: true,
        placeholder: "7 passed in 0.31s",
        mustMatch: "\\d+ passed",
        failHelp:
          "All round-trip cases must pass, including empty string and unseen characters — the troubleshooting note in lab step 6 covers the two classic causes.",
      },
      {
        id: "compression-table",
        label: "Paste your compression table (bytes/token by language)",
        kind: "paste",
        required: true,
        placeholder: "en 3.8 · roman 3.1 · ur 2.2",
        mustMatch: "(en|ur)",
        failHelp: "Paste the actual three-line output from lab step 7.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL for the tokenizer",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp: "Repo → Commits → latest → copy the URL.",
      },
      {
        id: "retrain-experiment",
        label:
          "I ran the more-Urdu retrain experiment and recorded before/after compression numbers",
        kind: "attest",
        required: true,
        hint: "The experiment is what turns 'I copied minBPE' into 'I investigated tokenizer bias'.",
      },
    ],
  },

  reflectionPrompts: [
    "Explain the merge loop from memory, in four sentences.",
    "What was your surprising Urdu result, and what causes it mechanically?",
    "How did the more-Urdu retrain change the numbers — and what does that imply for multilingual model vendors?",
    "What interview question could be asked from today's topic?",
  ],

  shipFields: [
    {
      id: "commit-url",
      label: "Commit URL for the tokenizer",
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
        "Byte-level BPE from scratch: trained on a bilingual corpus, round-trip tested, with a measured tokenizer-bias experiment",
    },
  ],

  references: [
    { label: "Karpathy — minBPE", url: "https://github.com/karpathy/minbpe" },
  ],

  nextDayPreview:
    "Day 6: from tokens to meaning — embeddings and cosine similarity computed by hand, and the first honest look at where semantic search fails.",

  authored: true,
};
