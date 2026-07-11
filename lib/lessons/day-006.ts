// Day 6 — authored lesson: embeddings and cosine similarity by hand.

import type { Lesson } from "./types";

export const DAY_006: Lesson = {
  day: 6,
  slug: "embeddings-cosine-similarity",
  title: "Embeddings and cosine similarity by hand",
  module: "AI Engineering Foundations",
  projectId: "P3",
  projectPhase: "PROJECT START",
  durationMinutes: 165,
  difficulty: "Core",
  prerequisites: [
    "P1's ModelClient (you'll add an embeddings call beside it)",
    "NumPy installed (pip install numpy)",
  ],
  objectives: [
    "Explain what an embedding vector is and what its geometry means",
    "Compute cosine similarity from the definition, then vectorize it with NumPy",
    "Embed 40–60 sentences and rank nearest neighbours for queries",
    "Test cross-lingual behavior: does Urdu land near its English translation?",
    "Write a failure analysis: where semantic similarity confuses related-but-wrong text",
  ],
  whyItMatters:
    "Every RAG system, semantic search and recommender rests on one operation: embed text into vectors, compare with cosine similarity, take the top-k. When retrieval returns garbage in week 3, engineers who have computed similarity by hand debug the geometry; everyone else re-reads vector-database docs. Today you build the intuition on 50 sentences, where you can still read every number.",
  jobRelevance:
    "You can explain and debug the retrieval half of RAG from first principles — similarity scores, normalization, top-k ranking, and the classic failure modes (related≠relevant, negation blindness) that production teams hit constantly.",
  missionBrief:
    "Embed a small corpus, compute the full similarity matrix with NumPy, rank nearest neighbours, probe cross-lingual pairs, and — most importantly — build a tiny evaluation set that shows where cosine similarity succeeds and where it confidently returns the wrong thing. This starts P3, the retrieval project.",
  finalEvidence:
    "A notebook/script with the similarity matrix, ranked query results, and a written failure analysis with concrete examples.",

  videos: [
    {
      id: "concept",
      title: "Concept — meaning as geometry",
      kind: "concept",
      required: true,
      minutes: 12,
    },
    {
      id: "walkthrough",
      title: "Code walkthrough — matrix, ranking, failures",
      kind: "walkthrough",
      required: false,
      minutes: 16,
    },
  ],

  sections: [
    {
      id: "vectors",
      title: "Embeddings: meaning as position",
      blocks: [
        {
          t: "p",
          text: "An embedding model maps text to a point in high-dimensional space (typically 1,536+ numbers) trained so that texts with similar meaning land near each other. 'Where is the station?' and 'اسٹیشن کہاں ہے؟' should be neighbours even though they share zero words — that's the magic. The vector's individual numbers mean nothing readable; only distances and directions between vectors carry information.",
        },
        {
          t: "p",
          text: "Cosine similarity measures the angle between two vectors: +1 means pointing the same way (same meaning), 0 means unrelated, negative means opposed. The formula is the dot product divided by both lengths — and if you normalize every vector to length 1 first, cosine similarity IS the dot product, which is why everyone normalizes and why a whole similarity matrix becomes one matrix multiplication.",
        },
        {
          t: "code",
          lang: "python",
          code: `import numpy as np

def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# normalized once…
def normalize(m: np.ndarray) -> np.ndarray:
    return m / np.linalg.norm(m, axis=1, keepdims=True)

# …the whole corpus-vs-corpus matrix is one line:
# sims = normalize(M) @ normalize(M).T`,
        },
        {
          t: "callout",
          kind: "info",
          title: "Semantic vs lexical",
          text: "Lexical search (keywords, BM25) matches strings; semantic search matches meaning. 'How do I reset my password?' finds 'credentials recovery steps' semantically but not lexically. Production systems usually need both — you'll build the hybrid later in P3.",
        },
      ],
    },
    {
      id: "failures",
      title: "Where cosine similarity lies to you",
      blocks: [
        {
          t: "p",
          text: "Similarity is not relevance. The three failure modes you'll hunt today: (1) related-but-wrong — 'How do I cancel my subscription?' ranks 'How do I upgrade my subscription?' very high, same topic, opposite intent; (2) negation blindness — 'The medicine is safe for children' and 'The medicine is NOT safe for children' embed almost identically; (3) style over substance — two formally similar sentences about different topics can beat a paraphrase. Every RAG bug report you'll ever read is one of these three wearing a costume.",
        },
        {
          t: "callout",
          kind: "warn",
          title: "The honest number",
          text: "Absolute similarity values are model-specific and mostly meaningless (0.8 isn't universally 'good'). Rankings are what matter — which is why your evaluation today checks 'is the right answer in the top 3?', not 'is the score above a threshold?'.",
        },
        {
          t: "callout",
          kind: "interview",
          title: "Interview question you can now answer",
          text: "\"Why does semantic search sometimes return the exact opposite of what the user asked?\" — embeddings encode topical meaning more strongly than logical operators like negation; related-but-opposite texts sit close in the space. Mitigations: reranking, hybrid lexical+semantic, and evaluation sets that include hard negatives.",
        },
        {
          t: "callout",
          kind: "job",
          title: "What an employer sees",
          text: "A failure analysis with named failure modes and concrete examples — the difference between 'used a vector DB once' and 'understands retrieval'.",
        },
      ],
    },
  ],

  lab: {
    intro:
      "Everything happens in projects/p3/similarity.py on a corpus small enough to read. NumPy only — no vector database until you've built what it automates.",
    steps: [
      {
        id: "corpus",
        title: "Write the corpus (40–60 sentences)",
        instruction:
          "projects/p3/corpus.py: a SENTENCES list mixing topics (a few sentences each about food, travel, tech support, cricket, weather…), including 5+ Urdu sentences that translate specific English ones, and 3 deliberate trap pairs (cancel/upgrade subscription, safe/not-safe, book/return ticket).",
        expected:
          "40–60 strings, topics you chose, traps planted where you know the ground truth.",
      },
      {
        id: "embed",
        title: "Embed the corpus once and cache it",
        instruction:
          "Add an embed(texts) call using the provider's embeddings endpoint (raw httpx like Day 2 — POST /v1/embeddings with model + input list), and cache results to embeddings.npy so re-runs are free.",
        code: {
          lang: "python",
          file: "projects/p3/similarity.py",
          code: `import os
from pathlib import Path

import httpx
import numpy as np

from .corpus import SENTENCES

CACHE = Path("projects/p3/embeddings.npy")


def embed(texts: list[str]) -> np.ndarray:
    response = httpx.post(
        "https://api.openai.com/v1/embeddings",
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"},
        json={"model": "text-embedding-3-small", "input": texts},
        timeout=60.0,
    )
    response.raise_for_status()
    data = response.json()["data"]
    return np.array([d["embedding"] for d in data], dtype=np.float32)


def corpus_matrix() -> np.ndarray:
    if CACHE.exists():
        return np.load(CACHE)
    m = embed(SENTENCES)
    np.save(CACHE, m)
    return m`,
        },
        command: `python -c "from projects.p3.similarity import corpus_matrix; print(corpus_matrix().shape)"`,
        expected: "(50, 1536) — one row per sentence (your counts).",
        troubleshooting:
          "401 → same env issue as Day 2. If the response is huge and slow, you sent one call per sentence — the endpoint takes the whole list in one request.",
      },
      {
        id: "cosine",
        title: "Cosine from the definition, then the matrix",
        instruction:
          "Implement cosine() and normalize() from the lesson; verify cosine(a,a)==1.0, then compute the full matrix sims = N @ N.T and check its diagonal.",
        command: `python -c "from projects.p3.similarity import *; import numpy as np; M=corpus_matrix(); N=normalize(M); S=N@N.T; print(S.shape, np.allclose(np.diag(S),1.0,atol=1e-5))"`,
        expected: "(50, 50) True",
        explanation:
          "The diagonal is every sentence compared with itself — if it isn't 1.0, normalize() is wrong and everything downstream silently degrades.",
      },
      {
        id: "neighbours",
        title: "Nearest-neighbour ranking",
        instruction:
          "Write top_k(query, k=5): embed the query, dot against the normalized corpus, argsort descending, print the k best with scores. Try 3 queries in English.",
        code: {
          lang: "python",
          file: "projects/p3/similarity.py (add)",
          code: `def top_k(query: str, k: int = 5) -> list[tuple[float, str]]:
    n = normalize(corpus_matrix())
    q = normalize(embed([query]))[0]
    scores = n @ q
    best = np.argsort(scores)[::-1][:k]
    return [(round(float(scores[i]), 3), SENTENCES[i]) for i in best]`,
        },
        expected:
          "Sensible neighbours for ordinary queries — enjoy this moment before the failure hunt.",
      },
      {
        id: "cross-lingual",
        title: "The cross-lingual probe",
        instruction:
          "Query in Urdu for content that exists only in English in your corpus (and vice versa). Record which pairs bridge languages and which don't.",
        expected:
          "Some Urdu↔English pairs rank top-3 (cross-lingual alignment is real) — and some don't (it's imperfect). Both results go in the report.",
      },
      {
        id: "trap-eval",
        title: "Spring the traps — the mini evaluation",
        instruction:
          "Build EVAL: 10 (query, expected_sentence) pairs including your trap pairs. Score top-1 and top-3 accuracy. Print each miss with what beat the right answer.",
        code: {
          lang: "python",
          file: "projects/p3/similarity.py (add)",
          code: `def evaluate(eval_pairs: list[tuple[str, str]]) -> None:
    hits1 = hits3 = 0
    for query, expected in eval_pairs:
        ranked = [s for _, s in top_k(query, k=3)]
        hits1 += ranked[0] == expected
        hits3 += expected in ranked
        if expected not in ranked:
            print(f"MISS · {query!r}\\n   wanted: {expected!r}\\n   got:    {ranked[0]!r}")
    n = len(eval_pairs)
    print(f"top-1 {hits1}/{n} · top-3 {hits3}/{n}")`,
        },
        expected:
          "A real score with real misses — the cancel/upgrade trap almost always bites, and now you have the receipt.",
      },
      {
        id: "negation",
        title: "Measure negation blindness directly",
        instruction:
          "Print cosine('The medicine is safe for children', 'The medicine is not safe for children') and compare it to the similarity of two genuinely unrelated sentences.",
        expected:
          "The negated pair scores dramatically higher than unrelated text — often 0.9+ vs 0.1 — despite meaning the opposite. Screenshot-worthy.",
      },
    ],
  },

  build: {
    brief:
      "Write the failure analysis that starts P3's story: a README section presenting the similarity matrix (heatmap PNG optional but great), the eval scores, the cross-lingual findings, and a 'Three ways cosine similarity lied' section with your measured examples — each with the score, why it happens, and one mitigation you'll build later in P3 (reranking, hybrid search, hard negatives in eval).",
    requirements: [
      "projects/p3/corpus.py + similarity.py — embed with cache, normalize, top_k, evaluate; committed",
      "A pytest: normalize() produces unit rows; cosine(a,a)≈1; top_k returns k results",
      "EVAL of 10 pairs with recorded top-1/top-3 scores in the README",
      "The failure section: negation pair score, trap-pair miss, and one cross-lingual result — all with your numbers",
    ],
    acceptance: [
      "python -m pytest projects/p3 -q green (tests run on cached/fake vectors — no network required)",
      "Re-running the script reproduces the eval scores from the cached embeddings",
      "The README names each failure mode and pairs it with a planned mitigation",
    ],
    commonMistakes: [
      "Comparing raw dot products of unnormalized vectors (lengths differ → rankings subtly wrong)",
      "An eval set with only easy positives — no traps means no findings",
      "Re-embedding the corpus on every run (cache it; embeddings are deterministic enough and cost money)",
    ],
    submission: [
      "Paste the eval output in Verification",
      "Submit the commit URL in Verification",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "For the unit tests, don't call the API — build a fake matrix with np.random.default_rng(0).normal(size=(5, 8)) and test normalize/top-k math on it. The network-touching embed() gets no unit test; the cached .npy is its integration evidence.",
    },
    {
      level: 2,
      title: "Structure",
      body: "Failure section skeleton per finding: the two texts → the score → one sentence on the mechanism ('embeddings encode topic, negation is a logical operator') → one sentence on the P3 mitigation. Three findings × four lines = the strongest half-page in your portfolio so far.",
    },
    {
      level: 3,
      title: "Partial implementation",
      body: "Heatmap in four lines: import matplotlib.pyplot as plt; plt.imshow(S, cmap='viridis'); plt.colorbar(); plt.savefig('projects/p3/similarity_matrix.png', dpi=160). Sort sentences by topic first (group indices) and the block structure of meaning becomes visible in the image — topics appear as bright squares on the diagonal.",
    },
  ],

  verification: {
    intro: "The eval output is the day's proof — scores plus at least one instructive miss.",
    fields: [
      {
        id: "eval-output",
        label: "Paste the output of your evaluate() run",
        kind: "paste",
        required: true,
        placeholder: "MISS · 'how do I cancel…' … top-1 7/10 · top-3 9/10",
        mustMatch: "top-1",
        failHelp:
          "Run lab step 6's evaluate() over your 10 pairs and paste the whole output including the top-1/top-3 line.",
      },
      {
        id: "pytest-output",
        label: "Paste the last line of: python -m pytest projects/p3 -q",
        kind: "paste",
        required: true,
        placeholder: "3 passed in 0.21s",
        mustMatch: "\\d+ passed",
        failHelp: "The math tests (normalize, cosine self-similarity, top_k) must pass offline.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL for P3's start",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp: "Repo → Commits → latest → copy the URL.",
      },
      {
        id: "failure-analysis",
        label:
          "My README documents three failure modes with my own measured examples and scores",
        kind: "attest",
        required: true,
        hint: "Negation pair, trap pair, cross-lingual result — with numbers from your runs.",
      },
    ],
  },

  reflectionPrompts: [
    "Explain cosine similarity to a junior dev without the word 'vector'.",
    "Which failure mode surprised you most, and what's your planned mitigation?",
    "Did Urdu bridge to English in your corpus? What does that mean for a Pakistani-market RAG product?",
    "What interview question could be asked from today's topic?",
  ],

  shipFields: [
    {
      id: "commit-url",
      label: "Commit URL for today's work",
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
        "Semantic similarity from first principles: NumPy cosine matrix, top-k eval (7/10 top-1), measured negation blindness and cross-lingual bridging",
    },
  ],

  references: [
    {
      label: "OpenAI — Embeddings",
      url: "https://developers.openai.com/api/docs/guides/embeddings",
    },
    { label: "NumPy — linear algebra basics", url: "https://numpy.org/doc/stable/reference/routines.linalg.html" },
  ],

  nextDayPreview:
    "Day 7: week 1 recap — refactor P1 and P2, record the demo, publish the benchmark tables and ship P2. Rest day rules: light hours, real shipping.",

  authored: true,
};
