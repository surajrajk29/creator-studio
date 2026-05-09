import { useState, useRef, useEffect, useCallback } from "react";

const TRACKS = [
  { id: "v1", type: "video", label: "Video 1", color: "#3B82F6" },
  { id: "v2", type: "video", label: "Video 2", color: "#6366F1" },
  { id: "overlay", type: "overlay", label: "Overlay", color: "#8B5CF6" },
  { id: "text", type: "text", label: "Text / Captions", color: "#EC4899" },
  { id: "sfx", type: "audio", label: "SFX", color: "#F59E0B" },
  { id: "music", type: "audio", label: "Music", color: "#10B981" },
];

const DEMO_CLIPS = [
  { id: "c1", track: "v1", start: 0, duration: 8, label: "Intro.mp4", color: "#3B82F6", thumbnail: "🎬" },
  { id: "c2", track: "v1", start: 8, duration: 6, label: "Scene2.mp4", color: "#2563EB", thumbnail: "🎥" },
  { id: "c3", track: "v1", start: 14, duration: 10, label: "Outro.mp4", color: "#1D4ED8", thumbnail: "🎞" },
  { id: "c4", track: "v2", start: 2, duration: 5, label: "BRoll1.mp4", color: "#6366F1", thumbnail: "📹" },
  { id: "c5", track: "v2", start: 10, duration: 7, label: "BRoll2.mp4", color: "#4F46E5", thumbnail: "🎦" },
  { id: "c6", track: "text", start: 1, duration: 4, label: "Title Text", color: "#EC4899", thumbnail: "T" },
  { id: "c7", track: "text", start: 8, duration: 3, label: "Caption AI", color: "#DB2777", thumbnail: "CC" },
  { id: "c8", track: "music", start: 0, duration: 24, label: "BG Music.mp3", color: "#10B981", thumbnail: "♪" },
  { id: "c9", track: "sfx", start: 7.5, duration: 1, label: "Whoosh", color: "#F59E0B", thumbnail: "🔊" },
  { id: "c10", track: "overlay", start: 3, duration: 5, label: "Logo.png", color: "#8B5CF6", thumbnail: "★" },
];

const MEDIA_FILES = [
  { id: "m1", name: "Hero_Shot.mp4", type: "video", size: "128 MB", duration: "0:32", thumb: "🎬", tags: ["talking", "indoor"] },
  { id: "m2", name: "Drone_Sunset.mp4", type: "video", size: "89 MB", duration: "0:15", thumb: "🌅", tags: ["drone", "outdoor", "sunset"] },
  { id: "m3", name: "BRoll_Coffee.mp4", type: "video", size: "42 MB", duration: "0:08", thumb: "☕", tags: ["broll", "product"] },
  { id: "m4", name: "Interview_Raw.mp4", type: "video", size: "340 MB", duration: "4:22", thumb: "🎙", tags: ["talking", "interview"] },
  { id: "m5", name: "Thumbnail_BG.jpg", type: "image", size: "2.4 MB", duration: "—", thumb: "🖼", tags: ["background"] },
  { id: "m6", name: "Logo_White.png", type: "image", size: "0.8 MB", duration: "—", thumb: "✦", tags: ["logo", "brand"] },
  { id: "m7", name: "Epic_Cinematic.mp3", type: "audio", size: "12 MB", duration: "3:45", thumb: "🎵", tags: ["music", "cinematic"] },
  { id: "m8", name: "Whoosh_FX.wav", type: "audio", size: "0.4 MB", duration: "0:02", thumb: "💨", tags: ["sfx"] },
];

const TRANSITIONS = [
  { id: "t1", name: "Fade", icon: "⬛", preview: "opacity" },
  { id: "t2", name: "Zoom In", icon: "🔍", preview: "zoom" },
  { id: "t3", name: "Swipe Left", icon: "←", preview: "slide" },
  { id: "t4", name: "Swipe Right", icon: "→", preview: "slide" },
  { id: "t5", name: "Spin", icon: "↻", preview: "rotate" },
  { id: "t6", name: "Glitch", icon: "⚡", preview: "glitch" },
  { id: "t7", name: "RGB Split", icon: "🌈", preview: "rgb" },
  { id: "t8", name: "Warp", icon: "🌀", preview: "warp" },
  { id: "t9", name: "Flash", icon: "✦", preview: "flash" },
  { id: "t10", name: "Blur", icon: "◎", preview: "blur" },
  { id: "t11", name: "Liquid", icon: "💧", preview: "liquid" },
  { id: "t12", name: "Speed Ramp", icon: "⏩", preview: "speed" },
];

const EFFECTS = [
  { id: "e1", name: "Cinematic LUT", icon: "🎞" },
  { id: "e2", name: "Vlog Warm", icon: "🌄" },
  { id: "e3", name: "Neon Night", icon: "🌃" },
  { id: "e4", name: "B&W Film", icon: "◑" },
  { id: "e5", name: "Retro VHS", icon: "📼" },
  { id: "e6", name: "Aura Glow", icon: "✨" },
  { id: "e7", name: "Moody Blue", icon: "🔷" },
  { id: "e8", name: "Golden Hour", icon: "🌞" },
];

const CAPTION_STYLES = [
  { id: "cs1", name: "MrBeast", preview: "BOLD YELLOW", style: { color: "#FACC15", fontWeight: 900, textShadow: "3px 3px 0 #000", fontSize: "28px" } },
  { id: "cs2", name: "Hormozi", preview: "Clean Impact", style: { color: "#fff", fontWeight: 700, background: "#000", padding: "4px 12px", fontSize: "22px" } },
  { id: "cs3", name: "Cinematic", preview: "Elegant Sub", style: { color: "#fff", fontStyle: "italic", fontSize: "18px", letterSpacing: "0.1em" } },
  { id: "cs4", name: "Podcast", preview: "Word by Word", style: { color: "#60A5FA", fontWeight: 600, fontSize: "20px" } },
  { id: "cs5", name: "Karaoke", preview: "Highlighted", style: { color: "#FBBF24", background: "rgba(0,0,0,0.6)", padding: "4px 8px", fontSize: "20px" } },
];

const AI_TOOLS = [
  { id: "ai1", name: "Auto Captions", icon: "💬", desc: "Whisper AI transcription", status: "ready" },
  { id: "ai2", name: "Silence Remover", icon: "✂️", desc: "Auto-cut dead air", status: "ready" },
  { id: "ai3", name: "Beat Sync", icon: "🎵", desc: "Sync cuts to music", status: "ready" },
  { id: "ai4", name: "Hook Analyzer", icon: "🎯", desc: "Optimize first 3 secs", status: "ready" },
  { id: "ai5", name: "Scene Detect", icon: "🔍", desc: "Auto-find scenes", status: "ready" },
  { id: "ai6", name: "Viral Score", icon: "📊", desc: "Engagement prediction", status: "ready" },
  { id: "ai7", name: "B-Roll AI", icon: "🎬", desc: "Smart B-roll suggestions", status: "beta" },
  { id: "ai8", name: "Eye Contact Fix", icon: "👁", desc: "AI gaze correction", status: "beta" },
  { id: "ai9", name: "Noise Removal", icon: "🔇", desc: "Clean audio instantly", status: "ready" },
  { id: "ai10", name: "Auto Reframe", icon: "📱", desc: "Portrait/landscape AI", status: "ready" },
];

const TEMPLATES = [
  { id: "tp1", name: "YouTube Vlog", icon: "📹", aspect: "16:9", clips: 12 },
  { id: "tp2", name: "Instagram Reel", icon: "🎭", aspect: "9:16", clips: 6 },
  { id: "tp3", name: "TikTok Viral", icon: "🎵", aspect: "9:16", clips: 8 },
  { id: "tp4", name: "Podcast Short", icon: "🎙", aspect: "1:1", clips: 4 },
  { id: "tp5", name: "Travel Cinematic", icon: "✈️", aspect: "16:9", clips: 15 },
  { id: "tp6", name: "Gaming Montage", icon: "🎮", aspect: "16:9", clips: 20 },
];

const ASPECT_RATIOS = [
  { id: "16:9", label: "YouTube", sub: "1920×1080", icon: "▬" },
  { id: "9:16", label: "Reels/Shorts", sub: "1080×1920", icon: "▮" },
  { id: "1:1", label: "Square", sub: "1080×1080", icon: "■" },
];

export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState("media");
  const [activePanel, setActivePanel] = useState("properties");
  const [clips, setClips] = useState(DEMO_CLIPS);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(40);
  const [selectedClip, setSelectedClip] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [aiRunning, setAiRunning] = useState(null);
  const [captionStyle, setCaptionStyle] = useState("cs1");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [viralScore] = useState(78);
  const [autoSaved, setAutoSaved] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const playRef = useRef(null);
  const timelineRef = useRef(null);

  const TOTAL_DURATION = 24;
  const PX_PER_SEC = zoom;

  useEffect(() => {
    if (playing) {
      playRef.current = setInterval(() => {
        setPlayhead(p => {
          if (p >= TOTAL_DURATION) { setPlaying(false); return 0; }
          return p + 0.1;
        });
      }, 100);
    } else {
      clearInterval(playRef.current);
    }
    return () => clearInterval(playRef.current);
  }, [playing]);

  const runAI = useCallback(async (toolId, toolName) => {
    setAiRunning(toolId);
    await new Promise(r => setTimeout(r, 1800));
    setAiRunning(null);
  }, []);

  const askCreatorAI = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are CreatorAI, an expert video editing assistant for YouTubers, TikTok creators, and Instagram Reel makers. Give concise, actionable advice about video editing, storytelling, hooks, captions, pacing, transitions, and viral content strategy. Keep answers under 120 words and use creator-friendly language.",
          messages: [{ role: "user", content: aiPrompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Error getting response.";
      setAiResponse(text);
    } catch (e) {
      setAiResponse("AI unavailable. Check your connection.");
    }
    setAiLoading(false);
  }, [aiPrompt]);

  const filteredMedia = MEDIA_FILES.filter(m =>
    !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tags.some(t => t.includes(searchQuery.toLowerCase()))
  );

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const fr = Math.floor((s % 1) * 10);
    return `${m}:${sec.toString().padStart(2,"0")}.${fr}`;
  };

  const selectedClipData = clips.find(c => c.id === selectedClip);

  const previewAspect = aspectRatio === "16:9" ? { w: 320, h: 180 } : aspectRatio === "9:16" ? { w: 101, h: 180 } : { w: 180, h: 180 };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0A0A0F", color: "#E2E8F0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden", fontSize: "13px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
        .tab-btn{background:transparent;border:none;color:#94A3B8;padding:6px 14px;cursor:pointer;border-radius:6px;font-size:12px;font-family:inherit;white-space:nowrap;transition:all .15s}
        .tab-btn:hover{background:#1E293B;color:#E2E8F0}
        .tab-btn.active{background:#1E293B;color:#60A5FA;font-weight:600}
        .tool-btn{background:transparent;border:none;color:#64748B;padding:7px;cursor:pointer;border-radius:6px;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .15s}
        .tool-btn:hover{background:#1E293B;color:#E2E8F0}
        .tool-btn.active{background:#1E40AF;color:#93C5FD}
        .panel-tab{background:transparent;border:none;color:#64748B;padding:5px 12px;cursor:pointer;border-radius:5px;font-size:11px;font-family:inherit;transition:all .15s}
        .panel-tab:hover{color:#CBD5E1}
        .panel-tab.active{background:#1E293B;color:#60A5FA;font-weight:600}
        .clip-block{position:absolute;top:2px;bottom:2px;border-radius:4px;cursor:pointer;overflow:hidden;display:flex;align-items:center;padding:0 6px;font-size:10px;font-weight:600;transition:all .15s;border:1.5px solid transparent;user-select:none}
        .clip-block:hover{brightness:1.1;border-color:rgba(255,255,255,0.3)}
        .clip-block.selected{border-color:#fff !important;box-shadow:0 0 0 1px rgba(255,255,255,0.5)}
        .ai-tool-btn{background:#0F172A;border:1px solid #1E293B;color:#CBD5E1;padding:10px 12px;cursor:pointer;border-radius:8px;font-family:inherit;text-align:left;transition:all .2s;display:flex;gap:10px;align-items:flex-start}
        .ai-tool-btn:hover{border-color:#3B82F6;background:#1E293B}
        .ai-tool-btn.running{border-color:#8B5CF6;background:#1E1533;animation:pulse 1s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
        .media-item{background:#0F172A;border:1px solid #1E293B;border-radius:8px;padding:8px;cursor:pointer;transition:all .15s}
        .media-item:hover{border-color:#3B82F6;background:#1E293B}
        .transition-card{background:#0F172A;border:1px solid #1E293B;border-radius:8px;padding:10px 6px;cursor:pointer;text-align:center;transition:all .15s}
        .transition-card:hover{border-color:#8B5CF6;background:#1E1533}
        .template-card{background:#0F172A;border:1px solid #1E293B;border-radius:10px;padding:12px;cursor:pointer;transition:all .15s}
        .template-card:hover{border-color:#60A5FA;background:#1E293B}
        .ctrl-btn{background:#1E293B;border:none;color:#CBD5E1;padding:6px 14px;cursor:pointer;border-radius:6px;font-size:12px;font-family:inherit;transition:all .15s}
        .ctrl-btn:hover{background:#334155}
        .ctrl-btn.primary{background:#2563EB;color:#fff}
        .ctrl-btn.primary:hover{background:#1D4ED8}
        .export-btn{background:linear-gradient(135deg,#6366F1,#8B5CF6);border:none;color:#fff;padding:10px 24px;cursor:pointer;border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;transition:all .2s}
        .export-btn:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(99,102,241,.4)}
        input[type=range]{-webkit-appearance:none;appearance:none;height:3px;background:#334155;border-radius:2px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#3B82F6;cursor:pointer}
        .caption-preview{border:2px solid transparent;border-radius:8px;padding:8px;cursor:pointer;transition:all .15s;background:#0F172A}
        .caption-preview:hover{border-color:#6366F1}
        .caption-preview.active{border-color:#8B5CF6;background:#1E1533}
        .timeline-ruler-tick{position:absolute;top:0;width:1px;background:#334155}
        .playhead-line{position:absolute;top:0;bottom:0;width:2px;background:#EF4444;z-index:20;pointer-events:none}
        .playhead-head{position:absolute;top:-2px;left:-6px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #EF4444}
        .glow-badge{background:linear-gradient(135deg,#6366F1,#8B5CF6);font-size:10px;padding:1px 6px;border-radius:10px;color:#fff;font-weight:600}
        .viral-bar{height:6px;background:#1E293B;border-radius:3px;overflow:hidden}
        .viral-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#22C55E,#84CC16)}
      `}</style>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", height: 48, background: "#080810", borderBottom: "1px solid #1E293B", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#E2E8F0", letterSpacing: "-0.3px" }}>CreatorStudio</span>
          <span className="glow-badge">PRO</span>
        </div>
        <div style={{ width: 1, height: 24, background: "#1E293B" }} />
        <input
          placeholder="Untitled Project"
          style={{ background: "transparent", border: "none", color: "#E2E8F0", fontSize: 13, fontFamily: "inherit", outline: "none", width: 160 }}
        />
        <div style={{ flex: 1 }} />
        {/* Aspect ratio */}
        <div style={{ display: "flex", gap: 4 }}>
          {ASPECT_RATIOS.map(ar => (
            <button key={ar.id} className={`ctrl-btn ${aspectRatio === ar.id ? "primary" : ""}`} style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => setAspectRatio(ar.id)}>
              {ar.icon} {ar.label}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: "#1E293B" }} />
        <div style={{ fontSize: 11, color: autoSaved ? "#22C55E" : "#F59E0B", display: "flex", alignItems: "center", gap: 4 }}>
          <span>{autoSaved ? "✓" : "⟳"}</span> {autoSaved ? "Saved" : "Saving..."}
        </div>
        <button className="export-btn" onClick={() => setExportOpen(true)}>↗ Export</button>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT PANEL — Media/Tools */}
        <div style={{ width: 240, borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", background: "#080810", flexShrink: 0 }}>
          {/* Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2, padding: "8px 8px 4px", borderBottom: "1px solid #1E293B" }}>
            {[
              { id: "media", icon: "🗂", label: "Media" },
              { id: "transitions", icon: "⚡", label: "FX" },
              { id: "text", icon: "T", label: "Text" },
              { id: "ai", icon: "✦", label: "AI" },
              { id: "templates", icon: "⊞", label: "Templates" },
            ].map(t => (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {/* MEDIA TAB */}
            {activeTab === "media" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  placeholder="🔍  Search media, scenes, faces..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, padding: "7px 10px", color: "#CBD5E1", fontSize: 12, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button className="ctrl-btn" style={{ flex: 1, fontSize: 11 }}>+ Upload</button>
                  <button className="ctrl-btn" style={{ fontSize: 11 }}>☁</button>
                </div>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 4 }}>Project Assets</div>
                {filteredMedia.map(m => (
                  <div key={m.id} className="media-item" draggable>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 36, height: 28, background: "#1E293B", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{m.thumb}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#CBD5E1", fontWeight: 500, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                        <div style={{ color: "#475569", fontSize: 10 }}>{m.size} · {m.duration}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TRANSITIONS/FX TAB */}
            {activeTab === "transitions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>Transitions</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {TRANSITIONS.map(t => (
                    <div key={t.id} className="transition-card">
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                      <div style={{ fontSize: 10, color: "#CBD5E1", fontWeight: 600 }}>{t.name}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 8 }}>Visual Effects</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {EFFECTS.map(e => (
                    <div key={e.id} className="transition-card">
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{e.icon}</div>
                      <div style={{ fontSize: 10, color: "#CBD5E1", fontWeight: 600 }}>{e.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEXT TAB */}
            {activeTab === "text" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="ctrl-btn primary" style={{ width: "100%" }}>+ Add Text</button>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>Caption Styles</div>
                {CAPTION_STYLES.map(cs => (
                  <div
                    key={cs.id}
                    className={`caption-preview ${captionStyle === cs.id ? "active" : ""}`}
                    onClick={() => setCaptionStyle(cs.id)}
                  >
                    <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>{cs.name}</div>
                    <div style={{ ...cs.style, fontSize: 14 }}>{cs.preview}</div>
                  </div>
                ))}
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 8 }}>Text Styles</div>
                {["Neon Glow", "3D Shadow", "Kinetic", "Gradient", "Masking", "Fire Text"].map(s => (
                  <button key={s} className="ctrl-btn" style={{ textAlign: "left", width: "100%" }}>{s}</button>
                ))}
              </div>
            )}

            {/* AI TAB */}
            {activeTab === "ai" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {/* AI Chat */}
                <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, padding: 10, marginBottom: 4 }}>
                  <div style={{ fontSize: 10, color: "#8B5CF6", fontWeight: 700, marginBottom: 6 }}>✦ CREATOR AI CHAT</div>
                  <textarea
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Ask: 'How do I make a viral hook?' or 'Best caption style for fitness content'"
                    style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, padding: "7px 8px", color: "#CBD5E1", fontSize: 11, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box", resize: "none", height: 64 }}
                  />
                  <button
                    className="ctrl-btn primary"
                    style={{ width: "100%", marginTop: 6, fontSize: 11 }}
                    onClick={askCreatorAI}
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Thinking..." : "✦ Ask AI"}
                  </button>
                  {aiResponse && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#CBD5E1", lineHeight: 1.6, background: "#1E293B", borderRadius: 6, padding: "8px 10px", borderLeft: "2px solid #8B5CF6" }}>
                      {aiResponse}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>AI Tools</div>
                {AI_TOOLS.map(tool => (
                  <button
                    key={tool.id}
                    className={`ai-tool-btn ${aiRunning === tool.id ? "running" : ""}`}
                    onClick={() => runAI(tool.id, tool.name)}
                    disabled={!!aiRunning}
                  >
                    <span style={{ fontSize: 16 }}>{tool.icon}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 12 }}>{tool.name}</span>
                        {tool.status === "beta" && <span style={{ fontSize: 9, background: "#7C3AED", color: "#E9D5FF", padding: "1px 5px", borderRadius: 4 }}>BETA</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748B", marginTop: 1 }}>{tool.desc}</div>
                      {aiRunning === tool.id && <div style={{ fontSize: 10, color: "#8B5CF6", marginTop: 2 }}>⟳ Processing...</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === "templates" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>Quick Templates</div>
                {TEMPLATES.map(tp => (
                  <div key={tp.id} className="template-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{tp.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12, color: "#E2E8F0" }}>{tp.name}</div>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{tp.aspect} · {tp.clips} clips</div>
                      </div>
                      <span style={{ marginLeft: "auto", color: "#3B82F6", fontSize: 16 }}>+</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Preview + Timeline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* TOOLBAR */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderBottom: "1px solid #1E293B", background: "#080810", flexShrink: 0 }}>
            {[
              { id: "select", icon: "↖", title: "Select" },
              { id: "razor", icon: "✂", title: "Razor / Split" },
              { id: "trim", icon: "⊣", title: "Trim" },
              { id: "zoom", icon: "⊕", title: "Zoom" },
              { id: "hand", icon: "✋", title: "Pan" },
            ].map(t => (
              <button key={t.id} className={`tool-btn ${selectedTool === t.id ? "active" : ""}`} title={t.title} onClick={() => setSelectedTool(t.id)}>
                {t.icon}
              </button>
            ))}
            <div style={{ width: 1, height: 24, background: "#1E293B", margin: "0 4px" }} />
            <button className="tool-btn" title="Undo (Ctrl+Z)">↩</button>
            <button className="tool-btn" title="Redo (Ctrl+Y)">↪</button>
            <div style={{ width: 1, height: 24, background: "#1E293B", margin: "0 4px" }} />
            <button className="tool-btn" title="Add Marker">⬦</button>
            <button className="tool-btn" title="Snap to Grid">⊞</button>
            <button className="tool-btn" title="Ripple Edit">⟺</button>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>Zoom:</span>
              <input type="range" min={20} max={120} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: 80 }} />
            </div>
          </div>

          {/* PREVIEW */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", background: "#050508", borderBottom: "1px solid #1E293B", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              {/* Preview window */}
              <div style={{ width: previewAspect.w, height: previewAspect.h, background: "#0A0A14", borderRadius: 8, overflow: "hidden", border: "2px solid #1E293B", position: "relative", boxShadow: "0 0 40px rgba(99,102,241,.15)" }}>
                {/* Video content simulation */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0F1726 0%, #1a0a2e 50%, #0F1726 100%)" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {playing ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: aspectRatio === "9:16" ? 24 : 32, marginBottom: 8 }}>🎬</div>
                      <div style={{ fontSize: 11, color: "#4A5568", fontWeight: 500 }}>Playing...</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: aspectRatio === "9:16" ? 24 : 36, marginBottom: 8 }}>🎞</div>
                      <div style={{ fontSize: 11, color: "#4A5568" }}>Preview</div>
                    </div>
                  )}
                </div>
                {/* Caption overlay */}
                <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center" }}>
                  <span style={{ ...CAPTION_STYLES.find(c => c.id === captionStyle)?.style, fontSize: 11 }}>
                    Hey, watch this viral tip!
                  </span>
                </div>
                {/* Safe zone indicator */}
                <div style={{ position: "absolute", inset: "8px", border: "1px dashed rgba(255,255,255,.1)", borderRadius: 4, pointerEvents: "none" }} />
              </div>
              {/* Timecode */}
              <div style={{ position: "absolute", bottom: -22, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
                {formatTime(playhead)} / {formatTime(TOTAL_DURATION)}
              </div>
            </div>
          </div>

          {/* PLAYBACK CONTROLS */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", background: "#080810", borderBottom: "1px solid #1E293B", flexShrink: 0 }}>
            <button className="tool-btn" onClick={() => setPlayhead(0)} title="Go to Start">⏮</button>
            <button className="tool-btn" onClick={() => setPlayhead(Math.max(0, playhead - 1))}>⏪</button>
            <button
              style={{ background: "#2563EB", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => setPlaying(p => !p)}
            >
              {playing ? "⏸" : "▶"}
            </button>
            <button className="tool-btn" onClick={() => setPlayhead(Math.min(TOTAL_DURATION, playhead + 1))}>⏩</button>
            <button className="tool-btn" onClick={() => setPlayhead(TOTAL_DURATION)} title="Go to End">⏭</button>
            <div style={{ width: 1, height: 20, background: "#1E293B", margin: "0 4px" }} />
            <span style={{ fontSize: 10, color: "#475569" }}>0.5×</span>
            <span style={{ fontSize: 10, color: "#60A5FA", fontWeight: 600 }}>1×</span>
            <span style={{ fontSize: 10, color: "#475569" }}>2×</span>
          </div>

          {/* TIMELINE */}
          <div ref={timelineRef} style={{ flex: 1, overflowX: "auto", overflowY: "auto", background: "#0A0A0F", position: "relative" }}>
            {/* Ruler */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#080810", borderBottom: "1px solid #1E293B", height: 24, marginLeft: 80 }}>
              <div style={{ position: "relative", width: TOTAL_DURATION * PX_PER_SEC, height: "100%" }}>
                {Array.from({ length: TOTAL_DURATION + 1 }, (_, i) => (
                  <div key={i} style={{ position: "absolute", left: i * PX_PER_SEC, top: 0, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <div style={{ width: 1, height: "100%", background: "#1E293B" }} />
                    <span style={{ position: "absolute", top: 4, left: 3, fontSize: 9, color: "#475569", whiteSpace: "nowrap" }}>{i}s</span>
                  </div>
                ))}
                {/* Playhead */}
                <div className="playhead-line" style={{ left: playhead * PX_PER_SEC, cursor: "col-resize" }}
                  onMouseDown={e => {
                    const rect = e.currentTarget.parentElement.getBoundingClientRect();
                    const move = ev => setPlayhead(Math.min(TOTAL_DURATION, Math.max(0, (ev.clientX - rect.left) / PX_PER_SEC)));
                    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
                    document.addEventListener("mousemove", move);
                    document.addEventListener("mouseup", up);
                  }}>
                  <div className="playhead-head" />
                </div>
              </div>
            </div>

            {/* Tracks */}
            {TRACKS.map(track => (
              <div key={track.id} style={{ display: "flex", height: 44, borderBottom: "1px solid #0F172A" }}>
                {/* Track label */}
                <div style={{ width: 80, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 8px", background: "#080810", borderRight: "1px solid #1E293B", position: "sticky", left: 0, zIndex: 5, gap: 4 }}>
                  <div style={{ width: 4, height: 16, borderRadius: 2, background: track.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: "#64748B", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.label}</span>
                </div>
                {/* Clips area */}
                <div style={{ position: "relative", width: TOTAL_DURATION * PX_PER_SEC, flexShrink: 0 }}>
                  {clips.filter(c => c.track === track.id).map(clip => (
                    <div
                      key={clip.id}
                      className={`clip-block ${selectedClip === clip.id ? "selected" : ""}`}
                      style={{
                        left: clip.start * PX_PER_SEC,
                        width: Math.max(20, clip.duration * PX_PER_SEC - 2),
                        background: clip.color + "CC",
                        borderColor: selectedClip === clip.id ? "#fff" : "transparent",
                      }}
                      onClick={() => setSelectedClip(selectedClip === clip.id ? null : clip.id)}
                    >
                      <span style={{ marginRight: 3 }}>{clip.thumbnail}</span>
                      {clip.duration * PX_PER_SEC > 50 && (
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 9 }}>{clip.label}</span>
                      )}
                    </div>
                  ))}
                  {/* Playhead line in track */}
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: playhead * PX_PER_SEC, width: 2, background: "rgba(239,68,68,.4)", pointerEvents: "none" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — Properties/Inspector */}
        <div style={{ width: 220, borderLeft: "1px solid #1E293B", display: "flex", flexDirection: "column", background: "#080810", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 2, padding: "8px 8px 6px", borderBottom: "1px solid #1E293B" }}>
            {[
              { id: "properties", label: "Inspector" },
              { id: "color", label: "Color" },
              { id: "audio", label: "Audio" },
              { id: "growth", label: "Growth" },
            ].map(p => (
              <button key={p.id} className={`panel-tab ${activePanel === p.id ? "active" : ""}`} onClick={() => setActivePanel(p.id)}>{p.label}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {activePanel === "properties" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {selectedClipData ? (
                  <>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>CLIP: {selectedClipData.label}</div>
                    {[
                      { label: "Position X", val: "0 px" },
                      { label: "Position Y", val: "0 px" },
                      { label: "Scale", val: "100%" },
                      { label: "Rotation", val: "0°" },
                      { label: "Opacity", val: "100%" },
                      { label: "Duration", val: `${selectedClipData.duration}s` },
                    ].map(prop => (
                      <div key={prop.label}>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>{prop.label}</div>
                        <input
                          defaultValue={prop.val}
                          style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 6, padding: "5px 8px", color: "#CBD5E1", fontSize: 12, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Speed</div>
                      <input type="range" min={10} max={400} defaultValue={100} style={{ width: "100%" }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="ctrl-btn" style={{ flex: 1, fontSize: 10 }}>✂ Split</button>
                      <button className="ctrl-btn" style={{ flex: 1, fontSize: 10 }}>⊕ Dupe</button>
                      <button className="ctrl-btn" style={{ flex: 1, fontSize: 10, color: "#EF4444" }}>✕</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>PROJECT SETTINGS</div>
                    {[
                      { label: "Format", val: aspectRatio },
                      { label: "Resolution", val: "1080p" },
                      { label: "FPS", val: "30 fps" },
                      { label: "Duration", val: `${TOTAL_DURATION}s` },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{s.label}</span>
                        <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 500 }}>{s.val}</span>
                      </div>
                    ))}
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>Select a clip on the timeline to edit its properties.</div>
                  </>
                )}
              </div>
            )}

            {activePanel === "color" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>COLOR GRADING</div>
                {[
                  { label: "Exposure", min: -100, max: 100, val: 0 },
                  { label: "Contrast", min: -100, max: 100, val: 10 },
                  { label: "Saturation", min: -100, max: 100, val: 5 },
                  { label: "Temperature", min: -100, max: 100, val: -5 },
                  { label: "Highlights", min: -100, max: 100, val: -10 },
                  { label: "Shadows", min: -100, max: 100, val: 15 },
                  { label: "Sharpness", min: 0, max: 100, val: 20 },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: "#64748B" }}>{s.label}</span>
                      <span style={{ fontSize: 10, color: "#475569" }}>{s.val}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} defaultValue={s.val} style={{ width: "100%" }} />
                  </div>
                ))}
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginTop: 4 }}>LUT PRESETS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  {EFFECTS.slice(0, 6).map(e => (
                    <button key={e.id} className="ctrl-btn" style={{ fontSize: 10, padding: "5px 6px" }}>{e.name}</button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === "audio" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>AUDIO MIXER</div>
                {TRACKS.filter(t => t.type === "audio").map(t => (
                  <div key={t.id} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}>{t.label}</span>
                      <span style={{ fontSize: 10, color: "#22C55E" }}>-6 dB</span>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Volume</div>
                      <input type="range" min={0} max={200} defaultValue={100} style={{ width: "100%" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>Pan</div>
                      <input type="range" min={-100} max={100} defaultValue={0} style={{ width: "100%" }} />
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>AI AUDIO TOOLS</div>
                {["Noise Removal", "Voice Enhance", "Auto Ducking", "EQ Presets"].map(a => (
                  <button key={a} className="ctrl-btn" style={{ textAlign: "left", width: "100%", fontSize: 11 }}>⚙ {a}</button>
                ))}
              </div>
            )}

            {activePanel === "growth" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>CREATOR ANALYTICS</div>
                {/* Viral Score */}
                <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, padding: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 10, color: "#64748B" }}>Viral Score</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: viralScore >= 70 ? "#22C55E" : "#F59E0B" }}>{viralScore}</span>
                  </div>
                  <div className="viral-bar">
                    <div className="viral-fill" style={{ width: `${viralScore}%` }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>Good potential! Add a stronger hook.</div>
                </div>

                {[
                  { label: "Hook Strength", val: 65, color: "#F59E0B" },
                  { label: "Retention Score", val: 82, color: "#22C55E" },
                  { label: "Pacing", val: 71, color: "#60A5FA" },
                  { label: "CTR Potential", val: 58, color: "#EC4899" },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: "#64748B" }}>{m.label}</span>
                      <span style={{ fontSize: 10, color: m.color, fontWeight: 600 }}>{m.val}%</span>
                    </div>
                    <div style={{ height: 4, background: "#1E293B", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${m.val}%`, height: "100%", background: m.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}

                <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginTop: 4 }}>AI SUGGESTIONS</div>
                {[
                  "🎯 Start with a question hook",
                  "⚡ Cut first 5s of silence",
                  "🔤 Add animated captions",
                  "#️⃣ Use #fyp #viral tags",
                ].map(s => (
                  <div key={s} style={{ fontSize: 10, color: "#94A3B8", padding: "6px 8px", background: "#0F172A", borderRadius: 6, border: "1px solid #1E293B", lineHeight: 1.4 }}>{s}</div>
                ))}

                <button className="ctrl-btn primary" style={{ width: "100%", marginTop: 4, fontSize: 11 }}>✦ Generate SEO Metadata</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
      {exportOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setExportOpen(false)}>
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 16, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0" }}>Export Video</span>
              <button style={{ background: "transparent", border: "none", color: "#64748B", cursor: "pointer", fontSize: 18 }} onClick={() => setExportOpen(false)}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 8 }}>Destination</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {[
                    { label: "YouTube", icon: "▶" },
                    { label: "TikTok", icon: "♪" },
                    { label: "Reels", icon: "◎" },
                    { label: "Shorts", icon: "⚡" },
                    { label: "Square", icon: "■" },
                    { label: "Custom", icon: "⚙" },
                  ].map(d => (
                    <button key={d.label} className="ctrl-btn" style={{ fontSize: 11, padding: "8px 6px", textAlign: "center" }}>{d.icon}<br />{d.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 8 }}>Resolution</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["720p", "1080p", "2K", "4K"].map(r => (
                    <button key={r} className={`ctrl-btn ${r === "1080p" ? "primary" : ""}`} style={{ flex: 1, fontSize: 11 }}>{r}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>Frame Rate</div>
                  <select style={{ background: "#1E293B", border: "1px solid #334155", color: "#CBD5E1", borderRadius: 6, padding: "6px 8px", width: "100%", fontFamily: "inherit", fontSize: 12 }}>
                    <option>24 fps</option>
                    <option selected>30 fps</option>
                    <option>60 fps</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>Format</div>
                  <select style={{ background: "#1E293B", border: "1px solid #334155", color: "#CBD5E1", borderRadius: 6, padding: "6px 8px", width: "100%", fontFamily: "inherit", fontSize: 12 }}>
                    <option selected>MP4 (H.264)</option>
                    <option>MOV (ProRes)</option>
                    <option>WebM</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "#0A0A14", borderRadius: 8, padding: "10px 14px", border: "1px solid #1E293B", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>Estimated file size</span>
                <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}>~142 MB</span>
              </div>

              <button className="export-btn" style={{ width: "100%", padding: "12px" }}>
                ↗ Export 1080p MP4
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
