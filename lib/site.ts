// Site-wide brand — separate from any one course. The site is Ahmad's
// AI teaching platform; courses (lib/challenges/) live inside it.

export const SITE = {
  name: "Ahmad X AI",
  /** Short line under the brand in nav/sidebar */
  sub: "learn AI by building",
  tagline:
    "Production AI courses, taught in public — build the primitive, measure the system, ship the evidence.",
  handle: "@aixahmad",
  url: "https://radar.hafizahmad.com",
};

// The in-app "About me" tab — edit everything about you here.
// Photo: drop your picture at public/ahmad.jpg (any square image);
// until then a branded avatar shows instead.
export const ABOUT = {
  fullName: "Hafiz Ahmad",
  role: "AI engineer & educator",
  photo: "/ahmad.jpg",
  location: "Pakistan",
  intro:
    "Assalam-o-alaikum — I'm Ahmad. I build production AI systems and teach everything I learn, in public.",
  bio: [
    "I run Ahmad X AI, where I turn real production AI engineering into daily, buildable lessons. No passive tutorials: every day here has a build task, a done-when, and public proof — because the only AI skills that count are the ones you can ship and measure.",
    "Right now I'm leading the 120 Days of Production AI Engineering challenge: 20 portfolio projects covering raw APIs, retrieval, evals & reliability, agents, loop engineering, production backends, multimodal, realtime voice, open-model serving, MCP/A2A, and AI security — finished with a production capstone.",
    "Everything I teach, I build first. My code for every day of the challenge is public, and I share the wins and the failures — quality metrics, costs, security holes and all.",
  ],
  links: [
    { label: "YouTube", url: "https://youtube.com/@aixahmad" },
    { label: "GitHub", url: "https://github.com/ahmad19sep" },
    { label: "X / Twitter", url: "https://x.com/aixahmad" },
  ],
};
