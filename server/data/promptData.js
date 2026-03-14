// Prompt library data — mirrors src/data/index.js (serialisable subset only)

const AI_TOOLS = [
  { id: "any",        name: "Any / Universal",  icon: "✨", hint: "Works perfectly across all AI tools" },
  { id: "claude",     name: "Claude",            icon: "🟠", hint: "Loves reasoning chains + long context" },
  { id: "chatgpt",    name: "ChatGPT",           icon: "🟢", hint: "Great with structured numbered steps" },
  { id: "gemini",     name: "Gemini",            icon: "🔵", hint: "Strong with Google-ecosystem tasks" },
  { id: "stitch",     name: "Stitch (Google)",   icon: "🎨", hint: "Add color hex values + screen names" },
  { id: "midjourney", name: "Midjourney",        icon: "🖼️", hint: "End with --ar 16:9 --v 6 --style raw" },
  { id: "dalle",      name: "DALL·E",            icon: "🎭", hint: "Describe scenes not just subjects" },
  { id: "copilot",    name: "GitHub Copilot",    icon: "💻", hint: "Add file context + exact function name" },
  { id: "cursor",     name: "Cursor AI",         icon: "⚡", hint: "Reference existing codebase patterns" },
  { id: "perplexity", name: "Perplexity",        icon: "🔍", hint: "Ask for cited sources explicitly" },
];

const CATEGORIES = [
  { id: "design",    label: "UI/UX Design",    icon: "🎨", color: "#EC4899" },
  { id: "code",      label: "Code & Dev",      icon: "💻", color: "#3B82F6" },
  { id: "content",   label: "Content Writing", icon: "✍️",  color: "#F59E0B" },
  { id: "image",     label: "Image Generation",icon: "🖼️", color: "#8B5CF6" },
  { id: "research",  label: "Research",        icon: "🔍", color: "#06B6D4" },
  { id: "business",  label: "Business",        icon: "📊", color: "#10B981" },
  { id: "education", label: "Teach & Learn",   icon: "📚", color: "#F97316" },
  { id: "marketing", label: "Marketing",       icon: "📣", color: "#EF4444" },
];

const TONES = [
  { id: "professional", label: "Professional", icon: "👔" },
  { id: "friendly",     label: "Friendly",     icon: "😊" },
  { id: "creative",     label: "Creative",     icon: "🎨" },
  { id: "technical",    label: "Technical",    icon: "⚙️" },
  { id: "concise",      label: "Concise",      icon: "⚡" },
  { id: "detailed",     label: "Detailed",     icon: "📋" },
  { id: "persuasive",   label: "Persuasive",   icon: "💪" },
  { id: "empathetic",   label: "Empathetic",   icon: "💚" },
];

// Framework metadata (without the build() function which lives in the frontend)
const FRAMEWORKS = [
  {
    id: "rcat", name: "R-C-A-T", color: "#3B82F6",
    tagline: "Role · Context · Action · Format",
    best: "General purpose — works for 90% of all prompts",
    whyItWorks: "Giving the AI a Role improves output by 3x. Context removes ambiguity. Action is crystal clear. Format prevents surprises.",
    fields: [
      { key: "role",    label: "Role",    icon: "🎭", placeholder: "e.g. Expert UX designer with 10 years of startup experience",                              tip: "The more specific the role, the smarter the output." },
      { key: "context", label: "Context", icon: "🌍", placeholder: "e.g. I'm building a donation platform where disabled teachers earn by teaching online",     tip: "Background and situation. What problem exists? Who is involved?" },
      { key: "action",  label: "Action",  icon: "⚡", placeholder: "e.g. Design a homepage that makes donors want to support a teacher within 5 seconds",        tip: "Use strong action verbs: Design, Write, Build, Analyse, Fix. One clear task only." },
      { key: "format",  label: "Format",  icon: "📋", placeholder: "e.g. Return working React JSX with Tailwind CSS, mobile-first, with comments",              tip: "Tell the AI exactly how to package the output: format, length, structure." },
    ],
  },
  {
    id: "costar", name: "CO-STAR", color: "#EC4899",
    tagline: "Context · Objective · Style · Tone · Audience · Response",
    best: "Content writing, marketing copy, creative work",
    whyItWorks: "CO-STAR forces you to think about the READER. Audience-aware prompts produce copy that actually converts because the AI writes for a specific person.",
    fields: [
      { key: "context",   label: "Context",   icon: "🌍", placeholder: "e.g. IlmSadqa is a donation platform empowering paralyzed teachers to earn online",         tip: "Set the scene fully. What is the product, what does it do?" },
      { key: "objective", label: "Objective", icon: "🎯", placeholder: "e.g. Write a homepage headline that makes a donor feel compelled to give",                  tip: "One clear goal. What does success look like?" },
      { key: "style",     label: "Style",     icon: "🎨", placeholder: "e.g. Warm and human like Airbnb writing — story-first, never corporate",                   tip: "Reference real brands or writers. 'Like Airbnb' tells the AI more than 'modern and clean'." },
      { key: "tone",      label: "Tone",      icon: "🎵", placeholder: "e.g. Hopeful yet urgent — like a charity appeal that respects the audience",               tip: "Emotional register. How should the reader FEEL after reading this?" },
      { key: "audience",  label: "Audience",  icon: "👥", placeholder: "e.g. Pakistani diaspora in UK/USA, 30-50 years old, Muslim, wants to give Sadqah",         tip: "The more specific the person, the more targeted the writing." },
      { key: "response",  label: "Response",  icon: "📋", placeholder: "e.g. 3 headline options (max 8 words each) + 1 subheading per headline",                   tip: "Exact deliverable. How many options, what length, what structure?" },
    ],
  },
  {
    id: "risen", name: "RISEN", color: "#10B981",
    tagline: "Role · Instructions · Steps · End Goal · Narrowing",
    best: "Complex multi-step tasks, software projects, detailed work",
    whyItWorks: "RISEN breaks big tasks into Steps so the AI never gets lost. The Narrowing section prevents the AI's most common mistakes before they happen.",
    fields: [
      { key: "role",         label: "Role",         icon: "🎭", placeholder: "e.g. Senior full-stack developer specialising in React, Node.js and PostgreSQL",                   tip: "Expert identity. Include seniority level and specific specialisations." },
      { key: "instructions", label: "Instructions", icon: "📜", placeholder: "e.g. Build the complete donation processing system for IlmSadqa",                                  tip: "High-level description of the whole task in 1-2 sentences." },
      { key: "steps",        label: "Steps",        icon: "🪜", placeholder: "e.g. 1. Create donation route  2. Validate with Joi  3. Call Stripe API  4. Record in DB  5. Send receipt", tip: "Number each step clearly. This prevents the AI skipping steps." },
      { key: "endgoal",      label: "End Goal",     icon: "🏁", placeholder: "e.g. Working POST /donate API → 93% teacher / 7% platform → webhook → receipt email",             tip: "What does done look like? Be specific." },
      { key: "narrowing",    label: "Constraints",  icon: "🚧", placeholder: "e.g. PostgreSQL only, REST conventions, full error handling, JSDoc comments, no hardcoded secrets", tip: "Rules and restrictions. This prevents the AI's bad habits." },
    ],
  },
  {
    id: "star", name: "S-T-A-R", color: "#F59E0B",
    tagline: "Situation · Task · Action · Result",
    best: "Debugging, problem-solving, improving existing work",
    whyItWorks: "STAR is the debugging framework. Starting with Situation gives the AI full context. Result defines success — without it, the AI guesses what good looks like.",
    fields: [
      { key: "situation", label: "Situation", icon: "📍", placeholder: "e.g. My React donation button crashes the app. Error: Cannot read property of undefined", tip: "Describe what is happening RIGHT NOW. Include the exact error message." },
      { key: "task",      label: "Task",      icon: "🎯", placeholder: "e.g. Fix the crash, make the button reliable, ensure it works on mobile",              tip: "What needs to be achieved? Be clear about scope." },
      { key: "action",    label: "Action",    icon: "🔧", placeholder: "e.g. 1. Find root cause  2. Fix bug  3. Add error handling  4. Explain what went wrong", tip: "How should the AI approach this? What steps should it take?" },
      { key: "result",    label: "Result",    icon: "✅", placeholder: "e.g. Fixed code + explanation of the bug + how to prevent it happening again",          tip: "What does success look like? This is your acceptance criteria." },
    ],
  },
  {
    id: "care", name: "C-A-R-E", color: "#8B5CF6",
    tagline: "Context · Action · Result · Example",
    best: "When you have an example of what you want",
    whyItWorks: "Showing an Example bypasses all ambiguity. One concrete example communicates tone, format, and quality better than 100 words of description.",
    fields: [
      { key: "context", label: "Context", icon: "🌍", placeholder: "e.g. Writing product descriptions for Islamic charity gifts — prayer mats, Quran stands",              tip: "Situation and background. What is this content for?" },
      { key: "action",  label: "Action",  icon: "⚡", placeholder: "e.g. Write 5 product descriptions that make shoppers feel this is a meaningful blessed purchase",       tip: "The exact deliverable you need." },
      { key: "result",  label: "Result",  icon: "🏁", placeholder: "e.g. Each under 60 words, emotionally resonant, ends with a soft CTA — no pushy sales language",      tip: "What does a perfect output look like?" },
      { key: "example", label: "Example", icon: "💡", placeholder: '"This handmade prayer mat carries the warmth of an artisan family. Bring their blessing into your home."', tip: "THE most powerful field. Paste a sample of the exact tone and style you want." },
    ],
  },
];

const PROMPT_LIBRARY = [
  {
    id: "ilmsadqa-stitch",
    title: "Accessible Donation Platform — Full UI (Stitch/Google)",
    category: "design", tool: "stitch",
    tags: ["UI/UX", "Accessibility", "Social Impact", "Donation"],
    color: "#10B981",
    desc: "Complete UI prompt for an accessible donation platform that supports disabled teachers, with exact colors",
    prompt: `You are a world-class UI/UX designer and front-end developer.\n\nDesign a complete, beautiful, fully responsive web app for an accessible donation-funded platform where disabled individuals earn income by teaching students online. Students learn FREE.\n\nCOLOR PALETTE:\nLight Blue: #BAE6FD | Deep Blue: #0369A1\nSoft Pink: #FBCFE8 | Deep Pink: #BE185D\nMint Green: #BBF7D0 | Deep Green: #15803D\nBackground: #F0F9FF | Text: #0F172A\n\nSCREENS TO DESIGN:\n1. HOMEPAGE — emotional headline, impact counters, 3 teacher cards with donation bars, How It Works, testimonials\n2. TEACHER PROFILE — disability story, sticky donation sidebar, booking calendar, reviews\n3. LIVE SESSION ROOM — dark #0F172A bg, 60px+ control buttons, voice commands, chat panel\n4. STUDENT DASHBOARD — streak tracker, progress bars, badges, upcoming sessions\n5. DONOR PORTAL — impact stats, teacher discovery feed, donation history\n\nACCESSIBILITY:\n- All buttons min 48px (session room: 60px)\n- Text + icon labels always — never icon only\n- WCAG 2.1 AA contrast throughout\n- Voice commands: start session, mute, end session\n\nQUALITY CHECK:\n☐ Can a disabled teacher start a session in one click?\n☐ Is the Fund button always visible on teacher profiles?\n☐ Does homepage make a donor emotional in 5 seconds?\n☐ Works on 375px mobile?`,
  },
  {
    id: "saas-dark",
    title: "SaaS Analytics Dashboard",
    category: "design", tool: "chatgpt",
    tags: ["Dashboard", "Dark UI", "Data Viz"],
    color: "#3B82F6",
    desc: "Premium dark analytics dashboard inspired by Linear and Vercel",
    prompt: `You are a world-class UI designer specialising in dark premium SaaS interfaces.\n\nBuild a complete dark analytics dashboard.\n\nAESTHETIC: Dark premium — inspired by Linear.app and Vercel\nCOLORS: Background #0A0F1E | Cards #111827 | Accent #3B82F6\nFRAMEWORK: React + Tailwind CSS\n\nCOMPONENTS:\n1. Fixed left sidebar — nav items with icons + labels, collapse button\n2. Top header — search, notifications, user avatar dropdown\n3. KPI cards (×4) — animated counters, trend arrows, sparklines\n4. Main chart — line chart with date range picker, hover tooltips\n5. Data table — sortable, row selection, status badges, pagination\n6. Quick stats donut chart with hover legend\n\nRULES:\n- Monospace font for all numbers\n- All data animates in on first render\n- Sidebar collapses to icons at 1200px\n\nQUALITY CHECK:\n☐ Most important metric visible in 3 seconds?\n☐ Accessible color schemes (not color-only differentiation)?`,
  },
  {
    id: "debug-code",
    title: "Debug Any Code Error",
    category: "code", tool: "claude",
    tags: ["Debugging", "Bug Fix", "Explanation"],
    color: "#EF4444",
    desc: "Paste broken code + error and get a fix with full root-cause explanation",
    prompt: `You are a senior software engineer and expert debugger with 15 years experience.\n\nI have a bug. Please help me fix it.\n\nLANGUAGE / FRAMEWORK: [e.g. React 18, Node.js, Python 3.11]\n\nMY CODE:\n\`\`\`\n[paste your full code here]\n\`\`\`\n\nTHE EXACT ERROR MESSAGE:\n[paste complete error including stack trace]\n\nWHAT I EXPECTED:\n[intended behavior]\n\nWHAT ACTUALLY HAPPENED:\n[what went wrong]\n\nPLEASE:\n1. Identify the ROOT CAUSE — explain WHY it's broken\n2. Provide COMPLETE FIXED CODE\n3. Explain every change and why\n4. Add comments to tricky parts\n5. Tell me how to PREVENT this class of bug\n\nCONSTRAINTS:\n- Keep same architecture and libraries\n- Explain in plain English before showing code\n- Do NOT suggest a full rewrite`,
  },
  {
    id: "seo-blog",
    title: "SEO Blog Post Writer",
    category: "content", tool: "chatgpt",
    tags: ["Blog", "SEO", "Content Marketing"],
    color: "#F59E0B",
    desc: "Full SEO-optimised blog post from topic + keyword",
    prompt: `You are an expert content writer and SEO strategist.\n\nWrite a complete SEO-optimised blog post.\n\nTOPIC: [your topic]\nPRIMARY KEYWORD: [keyword to rank for]\nSECONDARY KEYWORDS: [2-3 related terms]\nTARGET AUDIENCE: [who reads this]\nWORD COUNT: [e.g. 1500 words]\n\nSTRUCTURE:\n1. SEO Title — under 60 chars, keyword first\n2. Meta Description — under 155 chars\n3. Introduction — surprising stat or bold claim, keyword in first 100 words\n4. 5-6 H2 sections — each with keyword variation\n5. Key Takeaways box — 5 bullets\n6. Conclusion with CTA\n7. FAQ section — 5 questions formatted for featured snippets\n\nRULES:\n- Keyword density 1-2%\n- Max 4 sentences per paragraph\n- Include 3 internal link placeholders [INTERNAL LINK: topic]\n\nDO NOT: Use passive voice. Write "In conclusion". Use paragraphs longer than 4 sentences.`,
  },
  {
    id: "midjourney-pro",
    title: "Midjourney Pro Image Prompt",
    category: "image", tool: "midjourney",
    tags: ["Art", "Illustration", "Photography"],
    color: "#8B5CF6",
    desc: "Stunning images with perfect Midjourney v6 syntax every time",
    prompt: `SUBJECT:\n[main subject] — a [adjective] [noun] [doing action] in [setting]\n\nVISUAL DETAILS:\nLighting: [e.g. golden hour rim lighting / soft diffused window light]\nColor palette: [e.g. warm amber and deep indigo / desaturated film tones]\nMood: [e.g. serene and contemplative / intense and urgent]\nCamera: [e.g. 35mm lens / wide angle environmental / macro close-up]\nComposition: [e.g. rule of thirds / centered symmetry]\n\nSTYLE: [e.g. Studio Ghibli / Pixar 3D / editorial photography / oil painting]\nINSPIRED BY: [e.g. Greg Rutkowski / Annie Leibovitz / Hayao Miyazaki]\n\nTECHNICAL: highly detailed, 8k resolution, sharp focus\n\n--ar 16:9 --v 6 --style raw --q 2`,
  },
  {
    id: "email-sequence",
    title: "3-Email Marketing Sequence",
    category: "marketing", tool: "any",
    tags: ["Email", "Marketing", "Copywriting"],
    color: "#EC4899",
    desc: "Full 3-email campaign for launch, nurture, or re-engagement",
    prompt: `You are a world-class email copywriter with 40%+ average open rates.\n\nWrite a 3-email campaign sequence.\n\nPRODUCT/SERVICE: [what you're promoting]\nAUDIENCE: [who receives these]\nGOAL: [e.g. product launch / donations / SaaS sign-ups]\nBRAND VOICE: [e.g. warm + trustworthy / bold + direct]\n\nEMAIL 1 — THE HOOK (Day 0): Maximum open rate + curiosity\nEMAIL 2 — THE VALUE (Day 3): Build desire through education + proof\nEMAIL 3 — THE PUSH (Day 7): Urgency + social proof + clear CTA\n\nFOR EACH EMAIL:\n- Subject line (under 50 chars) + 2 A/B variants\n- Preview text (under 90 chars)\n- Full email body\n- CTA button text\n- P.S. line`,
  },
  {
    id: "startup-pitch",
    title: "Investor Pitch Deck Script",
    category: "business", tool: "claude",
    tags: ["Startup", "Pitch", "Fundraising"],
    color: "#F97316",
    desc: "10-slide investor-ready pitch for any startup",
    prompt: `You are a startup pitch coach who has helped founders raise over $500M.\n\nWrite a 10-slide pitch deck script.\n\nSTARTUP: [name]\nONE LINE: [what it does in under 15 words]\nPROBLEM: [the pain — who has it, how often, how badly]\nSOLUTION: [your approach]\nBUSINESS MODEL: [how you make money]\nTRACTION: [users, revenue, growth rate]\nASK: [how much + what it's used for]`,
  },
  {
    id: "explain-anything",
    title: "Explain Any Concept Simply",
    category: "education", tool: "any",
    tags: ["Learning", "Explanation", "Beginner"],
    color: "#14B8A6",
    desc: "Get any complex topic explained at your exact level",
    prompt: `You are the world's greatest teacher — you can make any concept click for anyone.\n\nExplain: [TOPIC]\n\nMY LEVEL: [complete beginner / know basics / intermediate]\nMY CONTEXT: [e.g. 17-year-old student / software developer / small business owner]\nWHY I NEED THIS: [e.g. exam tomorrow / building a product / making a career decision]`,
  },
];

const PROMPT_TIPS = [
  { id: 1, icon: "🎭", title: "Give the AI a specific expert role",  impact: "3× better output",     color: "#3B82F6", bad: "Write a homepage for my app",            good: "You are a world-class conversion copywriter who has written homepages for 50+ funded startups. Write a homepage for my app.", why: "A role narrows the AI to an expert in exactly what you need. Without it you get average. With it you get specialist-level output." },
  { id: 2, icon: "📌", title: "Name references, not adjectives",     impact: "5× more specific",     color: "#EC4899", bad: "Make it look modern and clean",          good: "Aesthetic like Linear.app — dark, minimal, precise. Typography like Vercel's website.",                                    why: "'Modern' means nothing to an AI. Named references give it a concrete visual library. The AI has seen those sites thousands of times." },
  { id: 3, icon: "🎯", title: "State the ONE primary action",        impact: "Higher conversions",   color: "#10B981", bad: "Design a teacher profile page",          good: "Design a teacher profile page. The ONE thing a visitor must do: click 'Fund This Teacher'. Everything else is secondary.",    why: "Without a primary action the AI optimises for aesthetics. With one it designs for outcomes. Outcomes are what matter." },
  { id: 4, icon: "💚", title: "Describe the emotion, not the look",  impact: "More human output",    color: "#F59E0B", bad: "Make it feel trustworthy",               good: "A first-time donor should feel like a hero within 5 seconds — not like they're being asked for money.",                        why: "Emotion-first prompts produce copy and design that serve psychology." },
  { id: 5, icon: "🚧", title: "Tell it what NOT to do",              impact: "Eliminates clichés",   color: "#EF4444", bad: "Write a formal business email",          good: "Write a formal email. Do NOT use 'I hope this finds you well'. Do NOT use passive voice. Do NOT exceed 150 words.",           why: "AI defaults to the most common patterns which are the most clichéd. Exclusions steer it toward originality." },
  { id: 6, icon: "☐",  title: "Add a quality checklist",             impact: "Self-correcting AI",   color: "#8B5CF6", bad: "(no checklist at the end)",              good: "Before responding verify: ☐ CTA visible without scrolling? ☐ Under 150 words? ☐ Works on 375px mobile?",                    why: "A checklist forces the AI to self-review before responding. It catches 80% of common mistakes automatically." },
  { id: 7, icon: "💡", title: "Show an example of what you want",    impact: "Removes all ambiguity", color: "#F97316", bad: "Write a product description in a warm tone", good: 'Write a product description. Match this style: "This handmade mat carries the blessing of an artisan family."',              why: "One concrete example does more than 200 words of description. Showing beats telling every time." },
  { id: 8, icon: "🔢", title: "Break big tasks into numbered steps", impact: "10× more complete",    color: "#06B6D4", bad: "Build my entire e-commerce website",     good: "Build Phase 1 only: product listing page. Steps: 1) Image gallery 2) Price + add to cart 3) Reviews. Stop there.",            why: "Large prompts produce generic output. Small focused numbered prompts produce exceptional output per phase." },
];

module.exports = { AI_TOOLS, CATEGORIES, TONES, FRAMEWORKS, PROMPT_LIBRARY, PROMPT_TIPS };
