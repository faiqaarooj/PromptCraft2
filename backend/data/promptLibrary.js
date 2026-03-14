/**
 * data/promptLibrary.js
 *
 * CommonJS copy of the frontend prompt library so the backend can serve
 * templates via GET /api/templates without depending on ES-module syntax.
 */

const PROMPT_LIBRARY = [
  {
    id:       "ilmsadqa-stitch",
    title:    "Accessible Donation Platform — Full UI (Stitch/Google)",
    category: "design",
    tool:     "stitch",
    tags:     ["UI/UX", "Accessibility", "Social Impact", "Donation"],
    color:    "#10B981",
    desc:     "Complete UI prompt for an accessible donation platform that supports disabled teachers, with exact colors",
    prompt:
      "You are a world-class UI/UX designer and front-end developer.\n\n" +
      "Design a complete, beautiful, fully responsive web app for an accessible donation-funded platform where disabled individuals earn income by teaching students online. Students learn FREE.\n\n" +
      "COLOR PALETTE:\nLight Blue: #BAE6FD | Deep Blue: #0369A1\nSoft Pink: #FBCFE8 | Deep Pink: #BE185D\nMint Green: #BBF7D0 | Deep Green: #15803D\nBackground: #F0F9FF | Text: #0F172A\n\n" +
      "SCREENS TO DESIGN:\n1. HOMEPAGE — emotional headline, impact counters, 3 teacher cards with donation bars, How It Works, testimonials\n2. TEACHER PROFILE — disability story, sticky donation sidebar, booking calendar, reviews\n3. LIVE SESSION ROOM — dark #0F172A bg, 60px+ control buttons, voice commands, chat panel\n4. STUDENT DASHBOARD — streak tracker, progress bars, badges, upcoming sessions\n5. DONOR PORTAL — impact stats, teacher discovery feed, donation history\n\n" +
      "ACCESSIBILITY:\n- All buttons min 48px (session room: 60px)\n- Text + icon labels always — never icon only\n- WCAG 2.1 AA contrast throughout\n- Voice commands: start session, mute, end session\n\n" +
      "QUALITY CHECK:\n☐ Can a disabled teacher start a session in one click?\n☐ Is the Fund button always visible on teacher profiles?\n☐ Does homepage make a donor emotional in 5 seconds?\n☐ Works on 375px mobile?",
  },
  {
    id:       "saas-dark",
    title:    "SaaS Analytics Dashboard",
    category: "design",
    tool:     "chatgpt",
    tags:     ["Dashboard", "Dark UI", "Data Viz"],
    color:    "#3B82F6",
    desc:     "Premium dark analytics dashboard inspired by Linear and Vercel",
    prompt:
      "You are a world-class UI designer specialising in dark premium SaaS interfaces.\n\n" +
      "Build a complete dark analytics dashboard.\n\n" +
      "AESTHETIC: Dark premium — inspired by Linear.app and Vercel\nCOLORS: Background #0A0F1E | Cards #111827 | Accent #3B82F6\nFRAMEWORK: React + Tailwind CSS\n\n" +
      "COMPONENTS:\n1. Fixed left sidebar — nav items with icons + labels, collapse button\n2. Top header — search, notifications, user avatar dropdown\n3. KPI cards (×4) — animated counters, trend arrows, sparklines\n4. Main chart — line chart with date range picker, hover tooltips\n5. Data table — sortable, row selection, status badges, pagination\n6. Quick stats donut chart with hover legend\n\n" +
      "RULES:\n- Monospace font for all numbers\n- All data animates in on first render\n- Sidebar collapses to icons at 1200px\n\n" +
      "QUALITY CHECK:\n☐ Most important metric visible in 3 seconds?\n☐ Accessible color schemes (not color-only differentiation)?",
  },
  {
    id:       "debug-code",
    title:    "Debug Any Code Error",
    category: "code",
    tool:     "claude",
    tags:     ["Debugging", "Bug Fix", "Explanation"],
    color:    "#EF4444",
    desc:     "Paste broken code + error and get a fix with full root-cause explanation",
    prompt:
      "You are a senior software engineer and expert debugger with 15 years experience.\n\n" +
      "I have a bug. Please help me fix it.\n\n" +
      "LANGUAGE / FRAMEWORK: [e.g. React 18, Node.js, Python 3.11]\n\n" +
      "MY CODE:\n```\n[paste your full code here]\n```\n\n" +
      "THE EXACT ERROR MESSAGE:\n[paste complete error including stack trace]\n\n" +
      "WHAT I EXPECTED:\n[intended behavior]\n\n" +
      "WHAT ACTUALLY HAPPENED:\n[what went wrong]\n\n" +
      "PLEASE:\n1. Identify the ROOT CAUSE — explain WHY it's broken\n2. Provide COMPLETE FIXED CODE\n3. Explain every change and why\n4. Add comments to tricky parts\n5. Tell me how to PREVENT this class of bug\n\n" +
      "CONSTRAINTS:\n- Keep same architecture and libraries\n- Explain in plain English before showing code\n- Do NOT suggest a full rewrite",
  },
  {
    id:       "seo-blog",
    title:    "SEO Blog Post Writer",
    category: "content",
    tool:     "chatgpt",
    tags:     ["Blog", "SEO", "Content Marketing"],
    color:    "#F59E0B",
    desc:     "Full SEO-optimised blog post from topic + keyword",
    prompt:
      "You are an expert content writer and SEO strategist.\n\n" +
      "Write a complete SEO-optimised blog post.\n\n" +
      "TOPIC: [your topic]\nPRIMARY KEYWORD: [keyword to rank for]\nSECONDARY KEYWORDS: [2-3 related terms]\nTARGET AUDIENCE: [who reads this]\nWORD COUNT: [e.g. 1500 words]\n\n" +
      "STRUCTURE:\n1. SEO Title — under 60 chars, keyword first\n2. Meta Description — under 155 chars\n3. Introduction — surprising stat or bold claim, keyword in first 100 words\n4. 5-6 H2 sections — each with keyword variation\n5. Key Takeaways box — 5 bullets\n6. Conclusion with CTA\n7. FAQ section — 5 questions formatted for featured snippets\n\n" +
      "RULES:\n- Keyword density 1-2%\n- Max 4 sentences per paragraph\n- Include 3 internal link placeholders [INTERNAL LINK: topic]\n\n" +
      'DO NOT: Use passive voice. Write "In conclusion". Use paragraphs longer than 4 sentences.',
  },
  {
    id:       "midjourney-pro",
    title:    "Midjourney Pro Image Prompt",
    category: "image",
    tool:     "midjourney",
    tags:     ["Art", "Illustration", "Photography"],
    color:    "#8B5CF6",
    desc:     "Stunning images with perfect Midjourney v6 syntax every time",
    prompt:
      "SUBJECT:\n[main subject] — a [adjective] [noun] [doing action] in [setting]\n\n" +
      "VISUAL DETAILS:\nLighting: [e.g. golden hour rim lighting / soft diffused window light]\nColor palette: [e.g. warm amber and deep indigo / desaturated film tones]\nMood: [e.g. serene and contemplative / intense and urgent]\nCamera: [e.g. 35mm lens / wide angle environmental / macro close-up]\nComposition: [e.g. rule of thirds / centered symmetry]\n\n" +
      "STYLE: [e.g. Studio Ghibli / Pixar 3D / editorial photography / oil painting]\nINSPIRED BY: [e.g. Greg Rutkowski / Annie Leibovitz / Hayao Miyazaki]\n\n" +
      "TECHNICAL: highly detailed, 8k resolution, sharp focus\n\n" +
      "--ar 16:9 --v 6 --style raw --q 2\n\n" +
      "─────────────────\nEXAMPLE:\nA teacher in a wheelchair teaching via laptop to a child, warm home at dusk, soft window light, dignified and emotional, Studio Ghibli style, muted earth tones with warm gold\n--ar 16:9 --v 6 --style raw --q 2",
  },
  {
    id:       "email-sequence",
    title:    "3-Email Marketing Sequence",
    category: "marketing",
    tool:     "any",
    tags:     ["Email", "Marketing", "Copywriting"],
    color:    "#EC4899",
    desc:     "Full 3-email campaign for launch, nurture, or re-engagement",
    prompt:
      "You are a world-class email copywriter with 40%+ average open rates.\n\n" +
      "Write a 3-email campaign sequence.\n\n" +
      "PRODUCT/SERVICE: [what you're promoting]\nAUDIENCE: [who receives these]\nGOAL: [e.g. product launch / donations / SaaS sign-ups]\nBRAND VOICE: [e.g. warm + trustworthy / bold + direct]\n\n" +
      "EMAIL 1 — THE HOOK (Day 0): Maximum open rate + curiosity\nEMAIL 2 — THE VALUE (Day 3): Build desire through education + proof\nEMAIL 3 — THE PUSH (Day 7): Urgency + social proof + clear CTA\n\n" +
      "FOR EACH EMAIL:\n- Subject line (under 50 chars) + 2 A/B variants\n- Preview text (under 90 chars)\n- Full email body\n- CTA button text\n- P.S. line\n\n" +
      'RULES:\n- First sentence under 10 words — impossible to ignore\n- One CTA per email only\n- Use "you" 3× more than "we"\n- End with human name, never "The Team"\n\n' +
      'DO NOT: Use "I hope this finds you well". Write over 200 words per email.',
  },
  {
    id:       "startup-pitch",
    title:    "Investor Pitch Deck Script",
    category: "business",
    tool:     "claude",
    tags:     ["Startup", "Pitch", "Fundraising"],
    color:    "#F97316",
    desc:     "10-slide investor-ready pitch for any startup",
    prompt:
      "You are a startup pitch coach who has helped founders raise over $500M.\n\n" +
      "Write a 10-slide pitch deck script.\n\n" +
      "STARTUP: [name]\nONE LINE: [what it does in under 15 words]\nPROBLEM: [the pain — who has it, how often, how badly]\nSOLUTION: [your approach]\nBUSINESS MODEL: [how you make money]\nTRACTION: [users, revenue, growth rate]\nASK: [how much + what it's used for]\n\n" +
      "SLIDES (headline + 3 bullets + speaker notes each):\n1. TITLE — tagline that creates instant intrigue\n2. PROBLEM — use a real person's story, make investors feel it\n3. SOLUTION — start with \"What if...\"\n4. MARKET SIZE — TAM/SAM/SOM with sources\n5. PRODUCT — 3 features as user BENEFITS not specs\n6. BUSINESS MODEL — revenue streams + unit economics\n7. TRACTION — lead with best metric + growth chart\n8. TEAM — unfair advantages, domain expertise\n9. COMPETITION — honest 2×2 positioning matrix\n10. THE ASK — specific amount, use of funds, 18-month milestones\n\n" +
      "TONE: Confident not arrogant. Urgent not desperate.",
  },
  {
    id:       "explain-anything",
    title:    "Explain Any Concept Simply",
    category: "education",
    tool:     "any",
    tags:     ["Learning", "Explanation", "Beginner"],
    color:    "#14B8A6",
    desc:     "Get any complex topic explained at your exact level",
    prompt:
      "You are the world's greatest teacher — you can make any concept click for anyone.\n\n" +
      "Explain: [TOPIC]\n\n" +
      "MY LEVEL: [complete beginner / know basics / intermediate]\nMY CONTEXT: [e.g. 17-year-old student / software developer / small business owner]\nWHY I NEED THIS: [e.g. exam tomorrow / building a product / making a career decision]\n\n" +
      "STRUCTURE:\n1. ONE LINE — what it is in the simplest possible words\n2. THE ANALOGY — explain using something I already know. Start with \"Imagine...\"\n3. CORE CONCEPT — plain language, zero jargon (define any term you use)\n4. THE 3 THINGS THAT MATTER MOST — numbered, most important first\n5. CONCRETE EXAMPLE — from my specific context above\n6. COMMON MISTAKE — what most beginners get wrong\n7. WHAT TO LEARN NEXT — 2-3 specific next steps\n\n" +
      "RULES:\n- Talk directly to me using \"you\"\n- No sentences longer than 20 words if I'm a beginner\n- End with 2 questions I should now be able to answer\n\n" +
      "DO NOT: Start with a dictionary definition. Use academic language. Skip the analogy.",
  },
];

module.exports = { PROMPT_LIBRARY };
