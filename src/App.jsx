import { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import {
  AI_TOOLS, CATEGORIES, TONES, FRAMEWORKS,
  PROMPT_LIBRARY, PROMPT_TIPS, HISTORY_KEY, FAVORITES_KEY
} from "./data";
import { ErrorBoundary }          from "./ErrorBoundary";
import { quickIdeaSchema, exclusionSchema, extraSchema, checklistSchema, validateFrameworkFields } from "./validation";
import { tabVariants, tabTransition, phaseVariants, phaseTransition, toastVariants, toastTransition, pressProps } from "./motionConfig";
import { useParallax }             from "./useParallax";


// ─────────────────────────────────────────────────────────────
//  MODULE-LEVEL DERIVED DATA (computed once, never recreated)
// ─────────────────────────────────────────────────────────────

// Pre-normalised for efficient case-insensitive search — avoids repeated
// .toLowerCase() calls on every keystroke in the Library search box.
const NORMALIZED_LIBRARY = PROMPT_LIBRARY.map(p => ({
  ...p,
  _titleLower: p.title.toLowerCase(),
  _descLower:  p.desc.toLowerCase(),
  _tagsLower:  p.tags.map(t => t.toLowerCase()),
}));

// Data-driven framework keyword mapping used by QuickTab's auto-detection.
// Replacing the original chain of 15+ .includes() calls with a single
// array scan so new frameworks can be added without touching logic.
const FRAMEWORK_KEYWORDS = [
  { keywords: ["bug", "fix", "error", "broken"],       framework: "S-T-A-R"  },
  { keywords: ["write", "email", "blog", "post"],      framework: "CO-STAR"  },
  { keywords: ["build", "create", "make", "develop"],  framework: "RISEN"    },
  { keywords: ["example", "like this", "similar to"],  framework: "C-A-R-E"  },
];

// ─────────────────────────────────────────────────────────────
//  DESIGN TOKENS (minimal Google-style)
// ─────────────────────────────────────────────────────────────
const C = {
  bg: "#F9FAFB",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E5E7EB",
  borderHi: "#D1D5DB",
  text: "#111827",
  muted: "#6B7280",
  dim: "#9CA3AF",
  gold: "#FDB022",
  blue: "#1D4ED8",
  green: "#16A34A",
  pink: "#DB2777",
  purple: "#6D28D9",
  cyan: "#0891B2",
  orange: "#EA580C",
  red: "#DC2626",
  teal: "#0D9488",
};

const font = "'Google Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// ─────────────────────────────────────────────────────────────
//  TINY UTILS
// ─────────────────────────────────────────────────────────────
function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init; }
    catch { return init; }
  });
  const save = useCallback((v) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, save];
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text) => {
    try { navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, []);
  return { copied, copy };
}

// ─────────────────────────────────────────────────────────────
//  ATOM COMPONENTS
// ─────────────────────────────────────────────────────────────
const Pill = memo(function Pill({ on, onClick, children, color = C.blue }) {
  return (
    <button onClick={onClick} style={{
      background: on ? color + "22" : "transparent",
      border: `1.5px solid ${on ? color : C.border}`,
      color: on ? color : C.muted, borderRadius: 8,
      padding: "5px 13px", cursor: "pointer", fontSize: 12,
      fontWeight: on ? 700 : 500, fontFamily: font,
      transition: "all .15s", lineHeight: 1.4,
    }}>{children}</button>
  );
});

function GBtn({ onClick, children, color = C.blue, disabled, full, sm }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      {...(!disabled ? pressProps : {})}
      style={{
        background: disabled ? "#E5E7EB" : color,
        border: "none",
        color: disabled ? C.muted : "#FFFFFF",
        borderRadius: 999,
        fontFamily: font,
        padding: sm ? "7px 18px" : "10px 22px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: sm ? 13 : 14,
        fontWeight: 600,
        boxShadow: disabled ? "none" : "0 1px 2px rgba(15, 23, 42, 0.12)",
        transition: "background-color .15s ease, box-shadow .15s ease",
        width: full ? "100%" : "auto",
        letterSpacing: 0,
      }}
    >
      {children}
    </motion.button>
  );
}

function Card({ children, glow, style = {}, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      {...(onClick ? { whileHover: { y: -2 }, transition: { type: "spring", stiffness: 400, damping: 30 } } : {})}
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px) saturate(1.6)",
        WebkitBackdropFilter: "blur(12px) saturate(1.6)",
        border: `1px solid ${glow ? glow + "55" : C.border}`,
        borderRadius: 16, padding: 20,
        boxShadow: glow ? `0 0 32px ${glow}18` : "0 4px 20px #00000040",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color .2s, box-shadow .2s", ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

const Tag = memo(function Tag({ color, children }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}30`,
      borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 700,
      display: "inline-block", marginRight: 4, marginBottom: 4,
    }}>{children}</span>
  );
});

const Label = memo(function Label({ children, color = C.gold }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
      textTransform: "uppercase", color, marginBottom: 10,
    }}>{children}</div>
  );
});

const TipBox = memo(function TipBox({ text, color = C.blue }) {
  return (
    <div style={{
      background: color + "10", border: `1px solid ${color}30`,
      borderRadius: 8, padding: "7px 12px", marginTop: 6,
      fontSize: 11, color: color + "cc", lineHeight: 1.5,
    }}>💡 {text}</div>
  );
});

function FieldInput({ f, value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>{f.icon}</span>
        <span style={{ color: C.muted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</span>
      </div>
      <textarea
        rows={3}
        placeholder={f.placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%", background: C.surface,
          border: `1.5px solid ${focus ? C.blue : C.border}`,
          borderRadius: 10, padding: "10px 14px",
          color: C.text, fontSize: 13, fontFamily: font,
          outline: "none", resize: "vertical", lineHeight: 1.6,
          boxSizing: "border-box", transition: "border-color .15s",
        }}
      />
      <TipBox text={f.tip} />
    </div>
  );
}

function CopyBtn({ text, full }) {
  const { copied, copy } = useCopy();
  return (
    <motion.button onClick={() => copy(text)} {...pressProps} style={{
      background: copied ? C.green + "22" : C.gold + "22",
      border: `1.5px solid ${copied ? C.green : C.gold}`,
      color: copied ? C.green : C.gold, borderRadius: 9,
      padding: "8px 18px", cursor: "pointer", fontFamily: font,
      fontSize: 13, fontWeight: 700, transition: "all .2s",
      width: full ? "100%" : "auto",
    }}>{copied ? "✅ Copied!" : "📋 Copy Prompt"}</motion.button>
  );
}

function PromptPreview({ text }) {
  if (!text) return (
    <div style={{ textAlign: "center", padding: "50px 20px", color: C.dim }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>⚡</div>
      <div style={{ color: C.muted, fontWeight: 700, fontSize: 15 }}>Your prompt appears here</div>
      <div style={{ color: C.dim, fontSize: 13, marginTop: 6 }}>Fill any field on the left to generate</div>
    </div>
  );
  // DOMPurify: sanitize before rendering to prevent XSS if AI-generated
  // content is ever rendered via dangerouslySetInnerHTML in future.
  // For <pre> text nodes this is a belt-and-suspenders safety measure.
  const safe = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${C.gold}44`,
      borderRadius: 12, padding: 18, maxHeight: 400, overflowY: "auto",
      boxShadow: `0 0 30px ${C.gold}10`,
    }}>
      <pre style={{
        color: C.text, fontSize: 12, lineHeight: 1.85,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        margin: 0, fontFamily: mono,
      }}>{safe}</pre>
    </div>
  );
}

function ScoreBar({ score }) {
  const color = score >= 80 ? C.green : score >= 50 ? C.gold : C.red;
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Basic";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: C.muted, fontSize: 12, fontWeight: 700 }}>Prompt Quality</span>
        <span style={{ color, fontWeight: 900, fontSize: 14 }}>{score}/100 — {label}</span>
      </div>
      <div style={{ background: C.surface, borderRadius: 8, height: 8, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%",
          background: `linear-gradient(90deg,${color},${color}aa)`,
          borderRadius: 8, transition: "width .4s",
        }} />
      </div>
      {score < 80 && (
        <div style={{ color: C.dim, fontSize: 11, marginTop: 5 }}>
          {score < 40 ? "Fill in the framework fields to improve" : "Add tone, format, or checklist to reach Excellent"}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TAB: BUILDER
// ─────────────────────────────────────────────────────────────
function BuilderTab({ onSave }) {
  const [fwId, setFwId]         = useState("rcat");
  const [fields, setFields]     = useState({});
  const [toolId, setToolId]     = useState("any");
  const [toneId, setToneId]     = useState("");
  const [dont, setDont]         = useState("");
  const [extra, setExtra]       = useState("");
  const [checks, setChecks]     = useState(["","",""]);
  const [phase, setPhase]       = useState(1);
  const [phaseDir, setPhaseDir] = useState(1);  // +1 forward, -1 backward
  const [fieldErrors, setFieldErrors] = useState({});

  const fw = useMemo(() => FRAMEWORKS.find(f => f.id === fwId), [fwId]);
  const hasContent = fw?.fields.some(f => fields[f.key]?.trim());

  // Simple lookup on a small static array — no memoisation needed.
  const selectedTool = AI_TOOLS.find(t => t.id === toolId);

  // Stable callback passed to every FieldInput — prevents unnecessary
  // re-renders of sibling inputs when a single field changes.
  const handleFieldChange = useCallback((key, v) => {
    setFields(p => ({ ...p, [key]: v }));
    setFieldErrors(e => ({ ...e, [key]: "" }));
  }, []);

  // goPhase: when advancing from phase 2 → 3, validate fields first and
  // surface any errors before allowing the user to proceed.
  const goPhase = useCallback((n) => {
    if (phase === 2 && n === 3) {
      const { errors, ok } = validateFrameworkFields(fields);
      if (!ok) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
    }
    setPhaseDir(n > phase ? 1 : -1);
    setPhase(n);
  }, [phase, fields]);

  const prompt = useMemo(() => {
    if (!fw) return "";
    // Validate fields before building — strips anything that fails schema for live preview.
    // FRAMEWORKS is a static module-level constant so it is never stale.
    const { result: safeFields } = validateFrameworkFields(fields);
    let p = fw.build(safeFields);
    const tone = TONES.find(t => t.id === toneId);
    const adds = [];
    if (tone) adds.push(`TONE: ${tone.label}`);
    const safeDont  = exclusionSchema.safeParse(dont);
    const safeExtra = extraSchema.safeParse(extra);
    const safeChecks = checklistSchema.safeParse(checks);
    if (safeDont.success  && safeDont.data)  adds.push(`DO NOT: ${safeDont.data}`);
    if (safeExtra.success && safeExtra.data) adds.push(`ALSO DO: ${safeExtra.data}`);
    const qs = (safeChecks.success ? safeChecks.data : checks).filter(Boolean);
    if (qs.length) adds.push(`\nQUALITY CHECK (verify before responding):\n${qs.map(q => `☐ ${q}`).join("\n")}`);
    if (selectedTool && selectedTool.id !== "any") adds.push(`\n[Optimised for ${selectedTool.name} — ${selectedTool.hint}]`);
    if (adds.length) p += "\n\n" + adds.join("\n");
    return p;
  }, [fw, fields, selectedTool, toneId, dont, extra, checks]);

  const score = useMemo(() => {
    let s = 0;
    if (hasContent) s += 40;
    if (toneId) s += 10;
    if (dont) s += 20;
    if (toolId !== "any") s += 10;
    if (checks.filter(Boolean).length >= 2) s += 20;
    return Math.min(s, 100);
  }, [hasContent, toneId, dont, toolId, checks]);

  const STEPS = [
    { n:1, label:"Choose Framework", icon:"🏗️" },
    { n:2, label:"Fill Details",     icon:"✍️" },
    { n:3, label:"Enhance",          icon:"🚀" },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:24, alignItems:"start" }}>

      {/* ── LEFT ── */}
      <div>
        {/* Step indicator */}
        <div style={{ display:"flex", gap:0, marginBottom:24, background:C.surface, borderRadius:12, padding:4, border:`1px solid ${C.border}` }}>
          {STEPS.map((s) => (
            <motion.button key={s.n} onClick={() => goPhase(s.n)} {...pressProps} style={{
              flex:1, padding:"10px 0", border:"none", cursor:"pointer",
              borderRadius:9, fontFamily:font, fontSize:13, fontWeight:700,
              background: phase===s.n ? `linear-gradient(135deg,${C.blue},${C.purple})` : "transparent",
              color: phase===s.n ? "#fff" : C.muted,
              transition:"background-color .2s, color .2s",
            }}>{s.icon} {s.label}</motion.button>
          ))}
        </div>

        {/* Animated phase content — directional slide + fade */}
        <div style={{ position:"relative", overflow:"hidden" }}>
          <AnimatePresence mode="wait" custom={phaseDir}>

            {/* PHASE 1 — Framework */}
            {phase === 1 && (
              <motion.div key="phase1" custom={phaseDir} variants={phaseVariants} initial="initial" animate="animate" exit="exit" transition={phaseTransition}>
                <div style={{ color:C.text, fontSize:18, fontWeight:900, marginBottom:6 }}>Choose Your Prompt Framework</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:20 }}>
                  Not sure? Start with <strong style={{color:C.blue}}>R-C-A-T</strong> — it works for 90% of tasks. Each framework has a different strength.
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  {FRAMEWORKS.map(f => (
                    <motion.button key={f.id} onClick={() => { setFwId(f.id); setFields({}); goPhase(2); }} {...pressProps} style={{
                      background: fwId===f.id ? f.color+"18" : C.card,
                      border: `2px solid ${fwId===f.id ? f.color : C.border}`,
                      borderRadius:14, padding:"16px 18px", cursor:"pointer", textAlign:"left",
                      transition:"border-color .15s, background-color .15s, box-shadow .15s",
                      boxShadow: fwId===f.id ? `0 0 24px ${f.color}22` : "none",
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ color: fwId===f.id ? f.color : C.text, fontWeight:900, fontSize:20 }}>{f.name}</span>
                        {fwId===f.id && <span style={{ color:f.color }}>✓</span>}
                      </div>
                      <div style={{ color: fwId===f.id ? f.color+"cc" : C.muted, fontSize:12, fontWeight:700, marginBottom:6 }}>{f.tagline}</div>
                      <div style={{ color:C.dim, fontSize:11, marginBottom:8 }}>Best for: {f.best}</div>
                      <div style={{ background:C.surface, borderRadius:6, padding:"7px 10px" }}>
                        <span style={{ color:C.gold, fontSize:11, fontWeight:700 }}>Why it works: </span>
                        <span style={{ color:C.muted, fontSize:11 }}>{f.whyItWorks}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <GBtn onClick={() => goPhase(2)} color={C.blue} full>Next: Fill in Your Details →</GBtn>
              </motion.div>
            )}

            {/* PHASE 2 — Fields */}
            {phase === 2 && (
              <motion.div key="phase2" custom={phaseDir} variants={phaseVariants} initial="initial" animate="animate" exit="exit" transition={phaseTransition}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <motion.button onClick={() => goPhase(1)} {...pressProps} style={{ background:"transparent", border:`1.5px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontFamily:font, fontSize:12 }}>← Back</motion.button>
                  <div>
                    <div style={{ color:C.text, fontWeight:900, fontSize:18 }}>Fill In Your Details</div>
                    <div style={{ color:C.muted, fontSize:12 }}>Each field makes your prompt smarter. Read the blue tip under each one.</div>
                  </div>
                </div>

                <div style={{ background:`linear-gradient(135deg,${fw.color}18,${fw.color}08)`, border:`1px solid ${fw.color}33`, borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
                  <span style={{ color:fw.color, fontWeight:800, fontSize:13 }}>{fw.name}</span>
                  <span style={{ color:C.muted, fontSize:12 }}> — {fw.tagline}</span>
                </div>

                {fw?.fields.map(f => (
                  <FieldInput key={f.key} f={f} value={fields[f.key]||""} onChange={v => handleFieldChange(f.key, v)} />
                ))}
                {Object.values(fieldErrors).some(Boolean) && (
                  <div style={{ color:C.red, fontSize:12, marginBottom:8 }}>
                    {Object.values(fieldErrors).filter(Boolean).join(" · ")}
                  </div>
                )}
                <GBtn onClick={() => goPhase(3)} color={C.purple} full disabled={!hasContent}>
                  Next: Enhance Your Prompt →
                </GBtn>
              </motion.div>
            )}

            {/* PHASE 3 — Enhance */}
            {phase === 3 && (
              <motion.div key="phase3" custom={phaseDir} variants={phaseVariants} initial="initial" animate="animate" exit="exit" transition={phaseTransition}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <motion.button onClick={() => goPhase(2)} {...pressProps} style={{ background:"transparent", border:`1.5px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontFamily:font, fontSize:12 }}>← Back</motion.button>
                  <div>
                    <div style={{ color:C.text, fontWeight:900, fontSize:18 }}>Enhance Your Prompt</div>
                    <div style={{ color:C.muted, fontSize:12 }}>Each enhancement boosts quality. Quality checklist is the most powerful.</div>
                  </div>
                </div>

                <Card style={{ marginBottom:14 }}>
                  <Label>Target AI Tool</Label>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:10 }}>Adds tool-specific optimisation instructions</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {AI_TOOLS.map(t => (
                      <Pill key={t.id} on={toolId===t.id} color={C.purple} onClick={() => setToolId(t.id)}>
                        {t.icon} {t.name}
                      </Pill>
                    ))}
                  </div>
                  {toolId !== "any" && (
                    <div style={{ background:C.purple+"12", border:`1px solid ${C.purple}30`, borderRadius:8, padding:"7px 12px", marginTop:10, fontSize:12, color:C.purple }}>
                      💡 {selectedTool?.hint}
                    </div>
                  )}
                </Card>

                <Card style={{ marginBottom:14 }}>
                  <Label>Tone</Label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {TONES.map(t => (
                      <Pill key={t.id} on={toneId===t.id} color={C.cyan} onClick={() => setToneId(toneId===t.id?"":t.id)}>
                        {t.icon} {t.label}
                      </Pill>
                    ))}
                  </div>
                </Card>

                <Card style={{ marginBottom:14 }}>
                  <Label color={C.red}>Do NOT Do (Exclusions) — Most underused technique</Label>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:8 }}>Preventing bad output is as important as asking for good output</div>
                  <input
                    placeholder='e.g. "Do not use jargon. Do not exceed 200 words. Do not suggest a rewrite."'
                    value={dont} onChange={e => setDont(e.target.value)}
                    style={{ width:"100%", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, fontFamily:font, outline:"none", boxSizing:"border-box" }}
                  />
                </Card>

                <Card style={{ marginBottom:14 }}>
                  <Label color={C.green}>Quality Checklist — Forces AI to self-review</Label>
                  <div style={{ color:C.muted, fontSize:12, marginBottom:10 }}>Add 2-3 questions the AI must verify before responding. Catches 80% of mistakes.</div>
                  {checks.map((c,i) => (
                    <input key={i}
                      placeholder={["☐ Does the output achieve the main goal?","☐ Is it within the requested length?","☐ Is the tone consistent throughout?"][i]}
                      value={c} onChange={e => setChecks(p => p.map((x,j)=>j===i?e.target.value:x))}
                      style={{ width:"100%", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 14px", color:C.text, fontSize:13, fontFamily:font, outline:"none", boxSizing:"border-box", marginBottom:8 }}
                    />
                  ))}
                </Card>

                <Card style={{ marginBottom:20 }}>
                  <Label>Extra Instructions</Label>
                  <input
                    placeholder='e.g. "Include 3 real-world examples. Explain your reasoning."'
                    value={extra} onChange={e => setExtra(e.target.value)}
                    style={{ width:"100%", background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontSize:13, fontFamily:font, outline:"none", boxSizing:"border-box" }}
                  />
                </Card>

                <div style={{ display:"flex", gap:10 }}>
                  <GBtn color={C.green} disabled={!hasContent} onClick={() => onSave({ prompt, framework:fw?.name, tool:selectedTool?.name, score, preview:prompt.slice(0,100)+"..." })}>
                    💾 Save to History
                  </GBtn>
                  <motion.button onClick={() => { setFields({}); setToneId(""); setDont(""); setExtra(""); setChecks(["","",""]); setFieldErrors({}); goPhase(1); }} {...pressProps} style={{ background:"transparent", border:`1.5px solid ${C.border}`, color:C.muted, borderRadius:10, padding:"11px 20px", cursor:"pointer", fontFamily:font, fontSize:14 }}>
                    ↺ Reset All
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT — live preview ── */}
      <div style={{ position:"sticky", top:80 }}>
        <Card glow={score>=80?C.green:score>=50?C.gold:undefined} style={{ marginBottom:14 }}>
          <ScoreBar score={score} />
        </Card>

        <Card glow={hasContent?C.gold:undefined} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ color:C.muted, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>Live Preview</span>
            {hasContent && <CopyBtn text={prompt} />}
          </div>
          <PromptPreview text={hasContent ? prompt : ""} />
        </Card>

        {/* Why this framework */}
        {fw && (
          <Card style={{ padding:16 }}>
            <div style={{ color:fw.color, fontWeight:800, fontSize:13, marginBottom:8 }}>{fw.name} — Why it works</div>
            <div style={{ color:C.muted, fontSize:12, lineHeight:1.7 }}>{fw.whyItWorks}</div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TAB: LIBRARY
// ─────────────────────────────────────────────────────────────
function LibraryCard({ item, isFav, onFav }) {
  const [open, setOpen] = useState(false);
  const { copied, copy } = useCopy();
  const toolInfo = AI_TOOLS.find(x => x.id === item.tool);
  return (
    <Card glow={open ? item.color : undefined}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ flex:1, marginRight:12 }}>
          <div style={{ fontWeight:800, fontSize:15, color:C.text, marginBottom:6 }}>{item.title}</div>
          <div style={{ color:C.muted, fontSize:12, marginBottom:8 }}>{item.desc}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {item.tags.map(t => <Tag key={t} color={item.color}>{t}</Tag>)}
            <Tag color={C.muted}>{toolInfo?.icon} {toolInfo?.name}</Tag>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          <button onClick={() => onFav(item.id)} style={{ background:isFav?C.gold+"22":"transparent", border:`1.5px solid ${isFav?C.gold:C.border}`, color:isFav?C.gold:C.dim, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:14 }}>
            {isFav?"★":"☆"}
          </button>
          <button onClick={() => copy(item.prompt)} style={{ background:copied?C.green+"22":item.color+"22", border:`1.5px solid ${copied?C.green:item.color}`, color:copied?C.green:item.color, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontFamily:font, fontSize:12, fontWeight:700 }}>
            {copied?"✅ Copied":"📋 Copy"}
          </button>
          <button onClick={() => setOpen(!open)} style={{ background:"transparent", border:`1.5px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontFamily:font, fontSize:12 }}>
            {open?"▲":"▼"}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ background:C.surface, borderRadius:10, padding:14, border:`1px solid ${item.color}33`, maxHeight:320, overflowY:"auto" }}>
          <pre style={{ color:C.text, fontSize:11, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:mono }}>{item.prompt}</pre>
        </div>
      )}
    </Card>
  );
}

function LibraryTab() {
  const [favs, setFavs] = useLocalStorage(FAVORITES_KEY, []);
  const [cat, setCat]   = useState("all");
  const [tool, setTool] = useState("all");
  const [search, setSearch] = useState("");
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  const favsSet = useMemo(() => new Set(favs), [favs]);

  const toggleFav = useCallback((id) =>
    setFavs(prev => {
      const s = new Set(prev);
      if (s.has(id)) { s.delete(id); } else { s.add(id); }
      return [...s];
    }),
  [setFavs]);

  const filtered = useMemo(() => NORMALIZED_LIBRARY.filter(p => {
    if (cat !== "all" && p.category !== cat) return false;
    if (tool !== "all" && p.tool !== tool && tool !== "any") return false;
    if (showFavsOnly && !favsSet.has(p.id)) return false;
    if (search) {
      const q = search.toLowerCase();
      return p._titleLower.includes(q) || p._descLower.includes(q) || p._tagsLower.some(t => t.includes(q));
    }
    return true;
  }), [cat, tool, search, showFavsOnly, favsSet]);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ color:C.text, fontSize:22, fontWeight:900, marginBottom:4 }}>Ready-Made Prompt Library</div>
        <div style={{ color:C.muted, fontSize:14 }}>Production-tested prompts for the most common AI tasks. Copy, paste, get results.</div>
      </div>

      {/* Filters */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:20 }}>
        <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
          <input
            placeholder="🔍 Search prompts..."
            value={search} onChange={e=>setSearch(e.target.value)}
            style={{ flex:1, minWidth:180, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:9, padding:"8px 14px", color:C.text, fontSize:13, fontFamily:font, outline:"none" }}
          />
          <Pill on={showFavsOnly} color={C.gold} onClick={()=>setShowFavsOnly(!showFavsOnly)}>★ Favourites ({favs.length})</Pill>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          <Pill on={cat==="all"} color={C.blue} onClick={()=>setCat("all")}>All Categories</Pill>
          {CATEGORIES.map(c=><Pill key={c.id} on={cat===c.id} color={c.color} onClick={()=>setCat(c.id)}>{c.icon} {c.label}</Pill>)}
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <Pill on={tool==="all"} color={C.muted} onClick={()=>setTool("all")}>All Tools</Pill>
          {AI_TOOLS.map(t=><Pill key={t.id} on={tool===t.id} color={C.purple} onClick={()=>setTool(t.id)}>{t.icon} {t.name}</Pill>)}
        </div>
      </div>

      <div style={{ color:C.muted, fontSize:12, marginBottom:14 }}>{filtered.length} prompt{filtered.length!==1?"s":""} found</div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", color:C.dim }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <div style={{ color:C.muted, fontWeight:700 }}>No prompts found</div>
          <div style={{ fontSize:13, marginTop:6 }}>Try a different filter or search term</div>
        </div>
      ) : (
        <div style={{ display:"grid", gap:14 }}>
          {filtered.map(item => <LibraryCard key={item.id} item={item} isFav={favsSet.has(item.id)} onFav={toggleFav} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TAB: HISTORY
// ─────────────────────────────────────────────────────────────
function HistoryTab({ history, onClear, onRemove }) {
  const [open, setOpen] = useState(null);

  if (history.length === 0) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>📂</div>
      <div style={{ color:C.muted, fontWeight:700, fontSize:16 }}>No saved prompts yet</div>
      <div style={{ color:C.dim, fontSize:13, marginTop:6 }}>Use the Builder and hit "Save to History" to store your prompts here</div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ color:C.text, fontSize:22, fontWeight:900 }}>Saved Prompts</div>
          <div style={{ color:C.muted, fontSize:13 }}>{history.length} prompt{history.length!==1?"s":""} saved locally</div>
        </div>
        <button onClick={onClear} style={{ background:C.red+"18", border:`1.5px solid ${C.red}44`, color:C.red, borderRadius:9, padding:"8px 16px", cursor:"pointer", fontFamily:font, fontSize:12, fontWeight:700 }}>
          🗑️ Clear All
        </button>
      </div>

      <div style={{ display:"grid", gap:14 }}>
        {history.map(item => (
          <Card key={item.id} glow={open===item.id?C.gold:undefined}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                  <Tag color={C.blue}>{item.framework||"Custom"}</Tag>
                  {item.tool && <Tag color={C.purple}>{item.tool}</Tag>}
                  {item.score && <Tag color={item.score>=80?C.green:item.score>=50?C.gold:C.red}>{item.score}/100</Tag>}
                </div>
                <div style={{ color:C.muted, fontSize:12 }}>{new Date(item.savedAt).toLocaleString()}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <CopyBtn text={item.prompt} />
                <button onClick={() => setOpen(open===item.id?null:item.id)} style={{ background:"transparent", border:`1.5px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"6px 12px", cursor:"pointer", fontFamily:font, fontSize:12 }}>
                  {open===item.id?"▲":"▼"}
                </button>
                <button onClick={() => onRemove(item.id)} style={{ background:"transparent", border:`1.5px solid ${C.red}44`, color:C.red, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:13 }}>✕</button>
              </div>
            </div>
            <div style={{ color:C.dim, fontSize:12, fontFamily:mono, background:C.surface, borderRadius:8, padding:"8px 12px" }}>
              {item.preview || item.prompt?.slice(0,120)+"..."}
            </div>
            {open===item.id && (
              <div style={{ marginTop:12, background:C.surface, borderRadius:10, padding:14, border:`1px solid ${C.gold}33`, maxHeight:300, overflowY:"auto" }}>
                <pre style={{ color:C.text, fontSize:11, lineHeight:1.8, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:mono }}>{item.prompt}</pre>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TAB: LEARN (tips)
// ─────────────────────────────────────────────────────────────
function LearnTab() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ color:C.text, fontSize:22, fontWeight:900, marginBottom:4 }}>The 8 Laws of Prompt Engineering</div>
        <div style={{ color:C.muted, fontSize:14 }}>Most people never learn these. Master them and your AI output quality jumps 10×.</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:28 }}>
        {PROMPT_TIPS.map(tip => (
          <button key={tip.id} onClick={() => setActive(active===tip.id?null:tip.id)} style={{
            background: active===tip.id ? tip.color+"15" : C.card,
            border: `2px solid ${active===tip.id ? tip.color : C.border}`,
            borderRadius:14, padding:18, cursor:"pointer", textAlign:"left",
            boxShadow: active===tip.id ? `0 0 24px ${tip.color}22` : "none",
            transition:"all .2s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ background:tip.color+"22", color:tip.color, borderRadius:8, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{tip.icon}</span>
                <span style={{ color: active===tip.id?tip.color:C.text, fontWeight:800, fontSize:14 }}>{tip.title}</span>
              </div>
              <span style={{ background:tip.color+"22", color:tip.color, borderRadius:6, padding:"2px 9px", fontSize:11, fontWeight:800, whiteSpace:"nowrap" }}>{tip.impact}</span>
            </div>

            {active===tip.id && (
              <div style={{ marginTop:10 }}>
                <div style={{ color:C.muted, fontSize:13, lineHeight:1.7, marginBottom:14 }}>{tip.why}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div style={{ background:C.red+"12", border:`1px solid ${C.red}30`, borderRadius:9, padding:12 }}>
                    <div style={{ color:C.red, fontSize:11, fontWeight:800, marginBottom:6 }}>❌ WITHOUT THIS</div>
                    <div style={{ color:C.muted, fontSize:12, fontStyle:"italic" }}>{tip.bad}</div>
                  </div>
                  <div style={{ background:C.green+"12", border:`1px solid ${C.green}30`, borderRadius:9, padding:12 }}>
                    <div style={{ color:C.green, fontSize:11, fontWeight:800, marginBottom:6 }}>✅ WITH THIS</div>
                    <div style={{ color:C.text, fontSize:12, fontStyle:"italic" }}>{tip.good}</div>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Quick reference */}
      <Card glow={C.gold}>
        <div style={{ color:C.gold, fontWeight:900, fontSize:16, marginBottom:16 }}>⚡ The Perfect Prompt Anatomy</div>
        <div style={{ display:"grid", gap:8 }}>
          {[
            {n:"1", label:"ROLE",      text:"You are a world-class [specific expert] specialising in [domain].",             color:C.blue },
            {n:"2", label:"CONTEXT",   text:"[Background + situation + who is involved + what problem exists]",              color:C.cyan },
            {n:"3", label:"TASK",      text:"[Exact deliverable using an action verb: Design / Write / Build / Fix / Analyse]", color:C.green },
            {n:"4", label:"FORMAT",    text:"[Output format: code / bullets / prose / JSON / table + length]",                color:C.purple },
            {n:"5", label:"STYLE REF", text:"[Named reference: 'Like Airbnb's writing' / 'Aesthetic like Linear.app']",      color:C.pink },
            {n:"6", label:"DO NOT",    text:"[Exclusions: prevents clichés and bad habits before they happen]",              color:C.red },
            {n:"7", label:"EXAMPLE",   text:"[Sample of exactly what you want — style, tone, length, format]",              color:C.orange },
            {n:"8", label:"CHECKLIST", text:"[3 questions the AI must verify ☐ before responding]",                        color:C.gold },
          ].map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"28px 90px 1fr", gap:10, alignItems:"center", padding:"8px 10px", background:C.surface, borderRadius:8 }}>
              <span style={{ color:r.color, fontWeight:900, fontSize:13 }}>{r.n}.</span>
              <span style={{ color:r.color, fontWeight:800, fontSize:12 }}>{r.label}</span>
              <span style={{ color:C.muted, fontSize:12, fontFamily:mono }}>{r.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TAB: QUICK GENERATE (smart one-box)
// ─────────────────────────────────────────────────────────────
function QuickTab({ onSave }) {
  const [idea, setIdea]     = useState("");
  const [toolId, setToolId] = useState("any");
  const [catId, setCatId]   = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const { copied, copy }    = useCopy();

  // Simple lookup on a small static array — no memoisation needed.
  const selectedTool = AI_TOOLS.find(t => t.id === toolId);

  function buildQuickPrompt() {
    // Zero-trust input validation via Zod before any processing
    const parsed = quickIdeaSchema.safeParse(idea);
    if (!parsed.success) {
      setIdeaError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setIdeaError("");
    setLoading(true);

    const safeIdea = parsed.data;
    const cat  = CATEGORIES.find(c=>c.id===catId);

    // Smart framework detection — data-driven, O(n) over keywords array
    const lower = safeIdea.toLowerCase();
    const fw = FRAMEWORK_KEYWORDS.find(m => m.keywords.some(k => lower.includes(k)))?.framework ?? "R-C-A-T";

    const toolNote = selectedTool && selectedTool.id!=="any" ? `\n[Optimised for ${selectedTool.name} — ${selectedTool.hint}]` : "";
    const catNote  = cat ? `\nCATEGORY: ${cat.label}` : "";

    const prompt = `You are a world-class expert in ${cat?.label||"this field"} with deep practical experience.
${catNote}

TASK:
${safeIdea}

APPROACH:
- Think step-by-step before responding
- Be specific and actionable — not generic
- Use concrete examples where helpful
- Structure your response clearly

QUALITY CHECK:
☐ Does the output directly address the task?
☐ Is it specific enough to be immediately useful?
☐ Does it match the expected format?
${toolNote}

[Framework auto-selected: ${fw}]`;

    setTimeout(() => { setResult(prompt); setLoading(false); }, 350);
  }

  return (
    <div style={{ maxWidth:760, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>⚡</div>
        <div style={{ color:C.text, fontSize:26, fontWeight:900, marginBottom:8 }}>Quick Prompt Generator</div>
        <div style={{ color:C.muted, fontSize:15, maxWidth:480, margin:"0 auto", lineHeight:1.6 }}>
          Describe what you want in plain English. PromptCraft automatically applies the right framework and best practices.
        </div>
      </div>

      <Card glow={C.blue} style={{ marginBottom:16 }}>
        <Label color={C.blue}>What do you want the AI to do?</Label>
        <textarea
          rows={4}
          placeholder="Describe your task in plain language...&#10;&#10;e.g. 'Design a homepage for a charity that helps disabled people earn online'&#10;e.g. 'Fix my React bug where the button crashes the app'&#10;e.g. 'Write a blog post about AI prompt engineering for beginners'"
          value={idea}
          onChange={e=>{ setIdea(e.target.value); if (ideaError) setIdeaError(""); }}
          style={{ width:"100%", background:C.surface, border:`1.5px solid ${ideaError ? C.red : C.border}`, borderRadius:10, padding:"12px 16px", color:C.text, fontSize:14, fontFamily:font, outline:"none", resize:"vertical", lineHeight:1.7, boxSizing:"border-box" }}
        />
        {ideaError && <div style={{ color:C.red, fontSize:12, marginTop:6 }}>⚠ {ideaError}</div>}
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
        <Card>
          <Label>Category (optional)</Label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {CATEGORIES.map(c=><Pill key={c.id} on={catId===c.id} color={c.color} onClick={()=>setCatId(catId===c.id?"":c.id)}>{c.icon} {c.label}</Pill>)}
          </div>
        </Card>
        <Card>
          <Label>Target AI Tool (optional)</Label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {AI_TOOLS.slice(0,7).map(t=><Pill key={t.id} on={toolId===t.id} color={C.purple} onClick={()=>setToolId(t.id)}>{t.icon} {t.name}</Pill>)}
          </div>
        </Card>
      </div>

      <GBtn onClick={buildQuickPrompt} color={C.blue} full disabled={!idea.trim()||loading}>
        {loading ? "⚙️ Building your prompt..." : "⚡ Generate Optimised Prompt"}
      </GBtn>

      {result && (
        <div style={{ marginTop:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ color:C.green, fontWeight:800, fontSize:14 }}>✅ Your optimised prompt is ready</div>
            <div style={{ display:"flex", gap:8 }}>
              <motion.button onClick={() => copy(result)} {...pressProps} style={{ background:copied?C.green+"22":C.gold+"22", border:`1.5px solid ${copied?C.green:C.gold}`, color:copied?C.green:C.gold, borderRadius:9, padding:"8px 18px", cursor:"pointer", fontFamily:font, fontSize:13, fontWeight:700 }}>
                {copied?"✅ Copied!":"📋 Copy Prompt"}
              </motion.button>
              <GBtn sm color={C.green} onClick={() => onSave({ prompt:result, framework:"Quick", tool:selectedTool?.name, score:70, preview:result.slice(0,100)+"..." })}>
                💾 Save
              </GBtn>
            </div>
          </div>
          <div style={{ background:C.surface, border:`1.5px solid ${C.gold}44`, borderRadius:12, padding:18, maxHeight:400, overflowY:"auto" }}>
            <pre style={{ color:C.text, fontSize:12, lineHeight:1.85, whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0, fontFamily:mono }}>
              {DOMPurify.sanitize(result, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })}
            </pre>
          </div>
          <div style={{ marginTop:12, padding:"10px 14px", background:C.blue+"12", border:`1px solid ${C.blue}30`, borderRadius:8, fontSize:12, color:C.blue }}>
            💡 Want a more powerful version? Use the <strong>Builder tab</strong> to fill in a full framework — it produces 3× better prompts.
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id:"quick",   label:"Quick Generate", icon:"⚡", desc:"Describe it → get a prompt" },
  { id:"builder", label:"Builder",        icon:"🛠️", desc:"Full framework control" },
  { id:"library", label:"Library",        icon:"📚", desc:"Ready-made prompts" },
  { id:"history", label:"History",        icon:"📂", desc:"Your saved prompts" },
  { id:"learn",   label:"Learn",          icon:"🎓", desc:"8 laws of prompting" },
];

export default function App() {
  const [tab, setTab]         = useState("quick");
  const [history, setHistory] = useLocalStorage(HISTORY_KEY, []);
  const [toast, setToast]     = useState(null);

  const showToast = useCallback((msg, color=C.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleSave = useCallback((entry) => {
    const updated = [{ ...entry, id:Date.now(), savedAt:new Date().toISOString() }, ...history].slice(0,50);
    setHistory(updated);
    showToast("✅ Prompt saved to History!");
  }, [history, setHistory, showToast]);

  const clearHistory = useCallback(() => { setHistory([]); showToast("History cleared", C.red); }, [setHistory, showToast]);
  const removeEntry  = useCallback((id) => setHistory(history.filter(h=>h.id!==id)), [history, setHistory]);

  // Parallax on hero stat cards
  const parallax = useParallax(6, 1000);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:font, color:C.text }}>

      {/* ── HEADER — glassmorphism ── */}
      <header style={{
        borderBottom:`1px solid ${C.border}`, padding:"12px 32px",
        background:"rgba(255,255,255,0.75)",
        backdropFilter:"blur(20px) saturate(1.8)",
        WebkitBackdropFilter:"blur(20px) saturate(1.8)",
        position:"sticky", top:0, zIndex:100,
        boxShadow:"0 1px 0 rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type:"spring", stiffness:400, damping:20 }}
              style={{ background:`linear-gradient(135deg,${C.blue},${C.purple})`, borderRadius:999, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:"#FFFFFF", boxShadow:"0 2px 8px rgba(29,78,216,0.35)", cursor:"default" }}
            >⚡</motion.div>
            <div>
              <div style={{ fontWeight:700, fontSize:18, color:C.text, letterSpacing:"-.01em" }}>PromptCraft</div>
              <div style={{ color:C.muted, fontSize:12 }}>Universal AI prompt toolkit</div>
            </div>
          </div>

          <nav style={{ display:"flex", gap:4 }}>
            {TABS.map(t => (
              <motion.button
                key={t.id}
                onClick={() => setTab(t.id)}
                {...pressProps}
                style={{
                  background: tab===t.id ? "#E0EBFF" : "transparent",
                  border: "1px solid transparent",
                  color: tab===t.id ? C.blue : C.muted,
                  borderRadius:999,
                  padding:"6px 14px",
                  cursor:"pointer",
                  fontFamily:font,
                  fontSize:13,
                  fontWeight:tab===t.id ? 600 : 500,
                  transition:"background-color .15s ease, color .15s ease",
                  display:"flex",
                  alignItems:"center",
                  gap:6,
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </motion.button>
            ))}
          </nav>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {history.length > 0 && (
              <div style={{ background:"#ECFDF3", border:`1px solid ${C.green}33`, color:C.green, borderRadius:999, padding:"4px 12px", fontSize:12, fontWeight:500 }}>
                {history.length} saved
              </div>
            )}
            <a
              href="https://github.com/faiqaarooj/PromptCraft2"
              target="_blank"
              rel="noreferrer"
              style={{ background:"#F3F4F6", border:`1px solid ${C.border}`, color:C.muted, borderRadius:999, padding:"6px 12px", textDecoration:"none", fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER — parallax stat cards ── */}
      {tab === "quick" && (
        <div style={{
          background:"linear-gradient(135deg,#EEF2FF 0%,#F0FDF4 100%)",
          borderBottom:`1px solid ${C.border}`, padding:"24px 32px 20px",
        }}>
          <div
            ref={parallax.ref}
            onMouseMove={parallax.onMouseMove}
            onMouseLeave={parallax.onMouseLeave}
            style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16, transformStyle:"preserve-3d" }}
          >
            {[
              { icon:"🎯", stat:"5 frameworks", sub:"Battle-tested patterns for any task", color:C.blue },
              { icon:"📚", stat:"8+ libraries", sub:"Design, code, marketing, business & more", color:C.purple },
              { icon:"🤖", stat:"10 AI tools", sub:"Works with ChatGPT, Claude, Gemini and more", color:C.green },
              { icon:"🎓", stat:"8 quick laws", sub:"Learn prompt craft in minutes, not hours", color:C.gold },
            ].map((s,i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.07, duration:0.3, ease:"easeOut" }}
                whileHover={{ y:-3, boxShadow:`0 8px 24px ${s.color}22` }}
                style={{
                  background:"rgba(255,255,255,0.85)",
                  backdropFilter:"blur(10px)",
                  WebkitBackdropFilter:"blur(10px)",
                  border:`1px solid ${s.color}22`,
                  borderRadius:14, padding:"16px 18px",
                  transition:"border-color .2s",
                }}
              >
                <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
                <div style={{ color:s.color, fontWeight:700, fontSize:15 }}>{s.stat}</div>
                <div style={{ color:C.dim, fontSize:11, marginTop:3 }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENT — animated tab transitions ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 80px" }}>
        <ErrorBoundary label="App content failed to load">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={tabTransition}
            >
              {tab==="quick"   && <QuickTab   onSave={handleSave} />}
              {tab==="builder" && <BuilderTab onSave={handleSave} />}
              {tab==="library" && <LibraryTab />}
              {tab==="history" && <HistoryTab history={history} onClear={clearHistory} onRemove={removeEntry} />}
              {tab==="learn"   && <LearnTab />}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* ── TOAST — spring-physics pop ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={toastTransition}
            style={{
              position:"fixed", bottom:28, right:28, zIndex:999,
              background: toast.color+"22", border:`2px solid ${toast.color}`,
              color:toast.color, borderRadius:12, padding:"12px 20px",
              fontSize:14, fontWeight:800, fontFamily:font,
              boxShadow:`0 8px 32px ${toast.color}33`,
            }}
          >{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      <style>{`
        button:hover { opacity: .88; }
        a:hover { opacity: .8; }
      `}</style>
    </div>
  );
}
