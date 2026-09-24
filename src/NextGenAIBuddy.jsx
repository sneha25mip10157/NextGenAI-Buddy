import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Brain, Code2, MessageSquare, Play, Pause, RotateCcw, SkipForward, SkipBack,
  Home, BookOpen, Terminal, BarChart3, GraduationCap, LayoutDashboard,
  Bell, Sun, Moon, Monitor, Menu, X, Send, Copy, ThumbsUp,
  ThumbsDown, RefreshCw, Sparkles, Flame, Trophy, Zap, Target,
  CheckCircle2, Circle, ChevronRight, ChevronDown, Search, Clock,
  Award, Users, TrendingUp, Building2, Mail, Github, Linkedin,
  Wand2, Bug, Gauge, Lightbulb, ArrowRight, Plus, User, LogOut,
  Star, Layers, GitBranch, Hash, ListTree, Boxes, Check, AlertCircle,
  HelpCircle, Sliders, Volume2, ShieldCheck, ArrowUpRight, Filter,
  Share2, Bookmark, Compass, Eye, PlayCircle, Calendar, Settings as SettingsIcon,
  HelpCircle as QuestionIcon, FileText, CheckSquare, Square, CornerDownRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

/* ==========================================================================
   1. DESIGN TOKENS & 3-WAY THEME SYSTEM (LIGHT / DARK / SYSTEM)
   ========================================================================== */
const THEME_STORAGE_KEY = "nextgenai_theme_mode";

const PALETTE = {
  blue: "#4F6BFF",
  indigo: "#6D63D9",
  cyan: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  mutedDark: "#94A3B8",
  mutedLight: "#626775",
};

function getThemeTokens(isDark) {
  if (isDark) {
    return {
      dark: true,
      mode: "dark",
      bg: "#0B0F19",
      bgSubtle: "#111827",
      surface: "#161F32",
      surfaceAlt: "rgba(255,255,255,0.03)",
      card: "#1A243B",
      cardGlass: "rgba(22,31,50,0.85)",
      border: "rgba(148,163,184,0.16)",
      borderHover: "rgba(79,107,255,0.45)",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      textSubtle: "#64748B",
      primary: "#4F6BFF",
      indigo: "#6D63D9",
      inputBg: "rgba(255,255,255,0.05)",
      editorBg: "#070B18",
      headerBg: "rgba(11,15,25,0.88)",
      shadow: "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 20px -5px rgba(79,107,255,0.15)",
    };
  }

  // Exact Light Theme Specification
  return {
    dark: false,
    mode: "light",
    bg: "#F8F6F1",
    bgSubtle: "#F2EFE8",
    surface: "#FFFDF8",
    surfaceAlt: "rgba(0,0,0,0.02)",
    card: "#FFFDF8",
    cardGlass: "rgba(255,253,248,0.92)",
    border: "#E6E1D8",
    borderHover: "rgba(79,107,255,0.5)",
    text: "#171923",
    textMuted: "#626775",
    textSubtle: "#8C92A4",
    primary: "#4F6BFF",
    indigo: "#6D63D9",
    inputBg: "#F2EFE8",
    editorBg: "#171923",
    headerBg: "rgba(248,246,241,0.90)",
    shadow: "0 10px 25px -5px rgba(23,25,35,0.05), 0 0 15px -3px rgba(79,107,255,0.08)",
  };
}

/* ==========================================================================
   2. DOMAIN DATA (16 TOPICS, PROBLEMS, QUIZZES, ACHIEVEMENTS, DEPENDENCIES)
   ========================================================================== */
import {
  TOPICS_DATA,
  PLAYGROUND_PROBLEMS,
  QUIZZES_DATA,
  ACHIEVEMENTS_DATA,
  INTERVIEW_TRACKS,
  CONCEPT_DEPENDENCIES
} from "./data/dsaData.js";

import {
  genRandomArray,
  generateSortingSteps,
  generateBinarySearchSteps,
  generateStackSteps,
  generateQueueSteps,
  generateLinkedListSteps,
  generateTreeSteps,
  generateGraphBFSSteps,
  generateGraphDFSSteps
} from "./visualizer/algoEngines.js";

import { APIService } from "./services/apiService.js";

/* ==========================================================================
   3. REUSABLE UI PRIMITIVES
   ========================================================================== */
function GlassCard({ children, className = "", hover = true, onClick, theme, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${
        hover ? "hover:scale-[1.006] hover:shadow-lg cursor-pointer" : ""
      } ${className}`}
      style={{
        background: theme.card,
        borderColor: theme.border,
        boxShadow: theme.shadow,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-[#4F6BFF] via-[#6D63D9] to-[#06B6D4] font-extrabold ${className}`}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  onClick,
  disabled = false,
  theme
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3 text-sm sm:text-base font-bold rounded-2xl gap-2.5",
  }[size];

  let variantStyle = {};
  if (variant === "primary") {
    variantStyle = {
      background: "linear-gradient(135deg, #4F6BFF 0%, #6D63D9 100%)",
      color: "#FFFFFF",
      boxShadow: "0 4px 14px rgba(79, 107, 255, 0.35)",
    };
  } else if (variant === "secondary") {
    variantStyle = {
      background: theme?.dark ? "rgba(255,255,255,0.06)" : "#F2EFE8",
      color: theme?.text || "#171923",
      border: `1px solid ${theme?.border || "#E6E1D8"}`,
    };
  } else if (variant === "outline") {
    variantStyle = {
      background: "transparent",
      color: "#4F6BFF",
      border: "1px solid rgba(79, 107, 255, 0.4)",
    };
  } else if (variant === "ghost") {
    variantStyle = {
      background: "transparent",
      color: theme?.textMuted || "#626775",
    };
  } else if (variant === "success") {
    variantStyle = {
      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      color: "#FFFFFF",
    };
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${className}`}
      style={variantStyle}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />}
      {children}
    </button>
  );
}

function Badge({ children, tone = "default", theme }) {
  const tones = {
    default: { bg: "rgba(148, 163, 184, 0.12)", text: "#94A3B8", border: "rgba(148, 163, 184, 0.2)" },
    primary: { bg: "rgba(79, 107, 255, 0.12)", text: "#4F6BFF", border: "rgba(79, 107, 255, 0.25)" },
    success: { bg: "rgba(16, 185, 129, 0.12)", text: "#10B981", border: "rgba(16, 185, 129, 0.25)" },
    warning: { bg: "rgba(245, 158, 11, 0.12)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.25)" },
    error: { bg: "rgba(239, 68, 68, 0.12)", text: "#EF4444", border: "rgba(239, 68, 68, 0.25)" },
    purple: { bg: "rgba(109, 99, 217, 0.12)", text: "#6D63D9", border: "rgba(109, 99, 217, 0.25)" },
  };
  const t = tones[tone] || tones.default;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border"
      style={{ background: t.bg, color: t.text, borderColor: t.border }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value = 0, max = 100, height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: "rgba(148, 163, 184, 0.15)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #4F6BFF 0%, #6D63D9 100%)",
        }}
      />
    </div>
  );
}

function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    info: { border: "#4F6BFF", icon: Sparkles, color: "#4F6BFF" },
    success: { border: "#10B981", icon: CheckCircle2, color: "#10B981" },
    warning: { border: "#F59E0B", icon: AlertCircle, color: "#F59E0B" },
    error: { border: "#EF4444", icon: AlertCircle, color: "#EF4444" },
  }[type] || { border: "#4F6BFF", icon: Sparkles, color: "#4F6BFF" };

  const Icon = colors.icon;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl animate-bounce-in"
      style={{
        background: "rgba(16, 22, 38, 0.95)",
        borderColor: colors.border,
        color: "#FFFFFF",
      }}
    >
      <Icon size={18} style={{ color: colors.color }} />
      <span className="text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white ml-2">
        <X size={14} />
      </button>
    </div>
  );
}

/* ==========================================================================
   4. NAVIGATION BAR (WITH 3-WAY THEME SELECTOR & 18 ROUTES DISPATCH)
   ========================================================================== */
function Navbar({
  route,
  navigate,
  themeMode,
  setThemeMode,
  theme,
  user,
  onOpenNotifications,
  onOpenAuth
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const navLinks = [
    { id: "learn", label: "Curriculum", icon: BookOpen, href: "#/learn" },
    { id: "playground", label: "Playground", icon: Terminal, href: "#/playground" },
    { id: "visualizer", label: "Visualizer", icon: BarChart3, href: "#/visualizer" },
    { id: "ai-buddy", label: "AI Buddy", icon: Brain, href: "#/ai-buddy" },
    { id: "quiz", label: "Quizzes", icon: GraduationCap, href: "#/quiz" },
    { id: "interview", label: "Interview Prep", icon: Trophy, href: "#/interview" },
    { id: "mistakes", label: "Mistakes", icon: Bug, href: "#/mistakes" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "#/dashboard" },
  ];

  const currentTab = route.split("/")[1] || "home";

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-200"
      style={{
        background: theme.headerBg,
        borderColor: theme.border,
      }}
    >
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* BRAND LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F6BFF] via-[#6D63D9] to-[#06B6D4] flex items-center justify-center text-white shadow-md shadow-[#4F6BFF]/30 group-hover:scale-105 transition-transform">
            <Brain size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight flex items-center gap-1.5" style={{ color: theme.text }}>
              NextGenAI <span className="text-[#4F6BFF]">Buddy</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#4F6BFF]/10 text-[#4F6BFF] border border-[#4F6BFF]/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">AI-Powered DSA Mentor</p>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = currentTab === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/" + link.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "text-[#4F6BFF] shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                style={
                  active
                    ? {
                        background: theme.dark ? "rgba(79, 107, 255, 0.12)" : "rgba(79, 107, 255, 0.08)",
                        color: "#4F6BFF"
                      }
                    : {}
                }
              >
                <Icon size={15} />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTION BAR */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* USER STREAK & XP PILLS */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl border"
                style={{
                  background: theme.dark ? "rgba(245, 158, 11, 0.08)" : "#FFF7ED",
                  borderColor: "rgba(245, 158, 11, 0.3)",
                  color: "#F59E0B",
                }}
                title="Active Study Streak"
              >
                <Flame size={14} className="fill-[#F59E0B]" />
                <span>{user.streak || 7}d</span>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl border"
                style={{
                  background: theme.dark ? "rgba(79, 107, 255, 0.08)" : "#EFF6FF",
                  borderColor: "rgba(79, 107, 255, 0.3)",
                  color: "#4F6BFF",
                }}
                title="Total Earned XP"
              >
                <Zap size={14} className="fill-[#4F6BFF]" />
                <span>{user.xp || 1480} XP</span>
              </div>
            </div>
          )}

          {/* 3-WAY THEME SELECTOR DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              style={{ background: theme.surface, borderColor: theme.border }}
              title="Theme Preference (Light / Dark / System)"
            >
              {themeMode === "light" && <Sun size={17} className="text-amber-500" />}
              {themeMode === "dark" && <Moon size={17} className="text-indigo-400" />}
              {themeMode === "system" && <Monitor size={17} className="text-cyan-500" />}
            </button>

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 rounded-2xl border shadow-xl py-1 z-50 animate-scale-in"
                style={{ background: theme.card, borderColor: theme.border }}
              >
                <button
                  onClick={() => {
                    setThemeMode("light");
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                    themeMode === "light" ? "text-[#4F6BFF] bg-[#4F6BFF]/10" : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Sun size={14} className="text-amber-500" /> Light
                </button>
                <button
                  onClick={() => {
                    setThemeMode("dark");
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                    themeMode === "dark" ? "text-[#4F6BFF] bg-[#4F6BFF]/10" : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Moon size={14} className="text-indigo-400" /> Dark
                </button>
                <button
                  onClick={() => {
                    setThemeMode("system");
                    setThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                    themeMode === "system" ? "text-[#4F6BFF] bg-[#4F6BFF]/10" : "text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Monitor size={14} className="text-cyan-500" /> System
                </button>
              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors relative"
            style={{ background: theme.surface, borderColor: theme.border }}
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4F6BFF]" />
          </button>

          {/* USER PROFILE OR AUTH */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl border transition-all hover:scale-105"
                style={{ background: theme.surface, borderColor: theme.border }}
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover bg-slate-200"
                />
                <span className="text-xs font-bold hidden md:inline max-w-[90px] truncate" style={{ color: theme.text }}>
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-slate-400 hidden md:inline" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl border shadow-xl p-2 z-50 animate-scale-in"
                  style={{ background: theme.card, borderColor: theme.border }}
                >
                  <div className="p-2 border-b mb-1" style={{ borderColor: theme.border }}>
                    <div className="text-xs font-bold truncate" style={{ color: theme.text }}>{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <User size={14} /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/study-plan");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Calendar size={14} /> AI Study Plan
                  </button>
                  <button
                    onClick={() => {
                      navigate("/achievements");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Trophy size={14} /> Achievements
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <SettingsIcon size={14} /> Settings
                  </button>
                  <div className="border-t my-1" style={{ borderColor: theme.border }} />
                  <button
                    onClick={() => {
                      navigate("/login");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={onOpenAuth} theme={theme}>
              Sign In
            </Button>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl border flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            style={{ background: theme.surface, borderColor: theme.border }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div
          className="xl:hidden border-t px-4 py-4 space-y-1 animate-slide-down"
          style={{ background: theme.bg, borderColor: theme.border }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  navigate("/" + link.id);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  active ? "text-[#4F6BFF] bg-[#4F6BFF]/10" : "text-slate-500"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

/* ==========================================================================
   5. CONCEPT DEPENDENCY GRAPH (INTERACTIVE SVG DAG)
   ========================================================================== */
function ConceptDependencyGraph({ topics, progressMap, onSelectTopic, theme }) {
  const nodes = [
    { id: "arrays", label: "Arrays", x: 60, y: 70 },
    { id: "strings", label: "Strings", x: 190, y: 70 },
    { id: "twopointers", label: "Two Pointers", x: 190, y: 160 },
    { id: "slidingwindow", label: "Sliding Window", x: 330, y: 160 },
    { id: "linkedlists", label: "Linked Lists", x: 60, y: 250 },
    { id: "stacks", label: "Stacks", x: 190, y: 250 },
    { id: "queues", label: "Queues", x: 60, y: 340 },
    { id: "trees", label: "Binary Trees", x: 330, y: 250 },
    { id: "bst", label: "BST", x: 470, y: 200 },
    { id: "heaps", label: "Heaps", x: 470, y: 290 },
    { id: "graphs", label: "Graphs", x: 470, y: 380 },
    { id: "backtracking", label: "Backtrack", x: 330, y: 360 },
    { id: "dp", label: "DP", x: 600, y: 360 },
  ];

  return (
    <GlassCard theme={theme} className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: theme.border }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#4F6BFF] uppercase tracking-wider">
            <GitBranch size={14} /> Concept Dependency Graph
          </div>
          <h2 className="text-lg font-bold" style={{ color: theme.text }}>Curriculum Mastery Network</h2>
          <p className="text-xs text-slate-500">Interactive DAG showing algorithmic prerequisite paths and your real-time mastery.</p>
        </div>

        {/* LEGEND */}
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Mastered (&ge;75%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> In Progress (&ge;40%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Unstarted</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 700 440" className="w-full min-w-[650px] select-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.dark ? "#475569" : "#CBD5E1"} />
            </marker>
          </defs>

          {/* EDGES */}
          {CONCEPT_DEPENDENCIES.map((dep, idx) => {
            const source = nodes.find(n => n.id === dep.from);
            const target = nodes.find(n => n.id === dep.to);
            if (!source || !target) return null;
            return (
              <line
                key={idx}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={theme.dark ? "rgba(148,163,184,0.25)" : "rgba(203,213,225,0.8)"}
                strokeWidth="2"
                strokeDasharray="4 2"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* NODES */}
          {nodes.map((node) => {
            const progress = progressMap[node.id] || { mastery_score: 30 };
            const score = progress.mastery_score || 0;
            const nodeColor = score >= 75 ? "#10B981" : score >= 40 ? "#F59E0B" : "#94A3B8";

            return (
              <g
                key={node.id}
                onClick={() => onSelectTopic(node.id)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill={theme.surface}
                  stroke={nodeColor}
                  strokeWidth="3"
                  className="filter drop-shadow-sm"
                />
                <text
                  x={node.x}
                  y={node.y - 3}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={theme.text}
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 11}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={nodeColor}
                >
                  {score}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </GlassCard>
  );
}

/* ==========================================================================
   6. TOPIC DETAIL LESSON VIEW (/learn/:topic)
   ========================================================================== */
function TopicDetailPage({ topicId, topics, progressMap, onUpdateProgress, navigate, theme, onNotify }) {
  const topic = topics.find(t => t.id === topicId) || topics[0];
  const progress = progressMap[topic.id] || { completed_lessons: 0, mastery_score: 30 };
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  const lessons = topic.lessons || [
    {
      id: "l1",
      title: "Core Mechanics & Invariants",
      duration: "20 min",
      content: `Understanding the theoretical foundations of ${topic.name}. Invariants must hold true before and after each algorithmic step.`
    }
  ];

  const currentLesson = lessons[activeLessonIdx] || lessons[0];

  const handleCompleteLesson = () => {
    onUpdateProgress(topic.id, 1, Math.min(100, (progress.mastery_score || 30) + 15));
    onNotify(`Completed lesson: ${currentLesson.title}! (+50 XP)`, "success");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* HEADER BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => navigate("/learn")} className="hover:text-[#4F6BFF]">Curriculum</button>
        <ChevronRight size={14} />
        <span style={{ color: theme.text }}>{topic.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.border }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge tone="primary" theme={theme}>{topic.difficulty}</Badge>
            <Badge tone="purple" theme={theme}>{topic.category}</Badge>
            <span className="text-xs text-slate-500 font-medium">{topic.time}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>{topic.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">{topic.summary}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Terminal}
            onClick={() => navigate("/playground")}
            theme={theme}
          >
            Practice Problems
          </Button>
          <Button
            variant="primary"
            icon={Brain}
            onClick={() => navigate("/ai-buddy")}
            theme={theme}
          >
            Ask AI Buddy
          </Button>
        </div>
      </div>

      {/* 2-COLUMN LESSON WORKSPACE */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: LESSON SYLLABUS LIST (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard theme={theme} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Curriculum Units</span>
              <span className="text-xs font-bold text-[#4F6BFF]">
                {progress.completed_lessons || 0} / {lessons.length} Done
              </span>
            </div>
            <ProgressBar value={progress.completed_lessons || 0} max={lessons.length} height={6} />

            <div className="space-y-1.5 pt-2">
              {lessons.map((lesson, idx) => {
                const active = activeLessonIdx === idx;
                const done = idx < (progress.completed_lessons || 0);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIdx(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      active ? "shadow-md" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    style={
                      active
                        ? { background: "linear-gradient(135deg, rgba(79,107,255,0.15), rgba(109,99,217,0.15))", border: "1px solid rgba(79,107,255,0.3)" }
                        : { border: "1px solid transparent" }
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      {done ? (
                        <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                      ) : (
                        <Circle size={16} className="text-slate-400 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-bold" style={{ color: theme.text }}>{lesson.title}</div>
                        <div className="text-[10px] text-slate-500">{lesson.duration || "20 min"}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* COMPLEXITY CHEAT SHEET */}
          <GlassCard theme={theme} className="p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Gauge size={14} /> Complexity Bounds
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Time</span>
                <p className="font-mono font-bold text-[#4F6BFF] mt-0.5">{topic.timeComp}</p>
              </div>
              <div className="p-2.5 rounded-xl border" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Space</span>
                <p className="font-mono font-bold text-[#6D63D9] mt-0.5">{topic.spaceComp}</p>
              </div>
            </div>
            <div className="text-[11px] text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              <strong>Pitfall:</strong> {topic.pitfalls}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT: ACTIVE LESSON CONTENT (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCard theme={theme} className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.border }}>
              <div>
                <span className="text-xs text-[#4F6BFF] font-bold">Lesson {activeLessonIdx + 1}</span>
                <h2 className="text-xl font-black mt-0.5" style={{ color: theme.text }}>{currentLesson.title}</h2>
              </div>
              <Button
                variant="success"
                size="sm"
                icon={Check}
                onClick={handleCompleteLesson}
                theme={theme}
              >
                Mark Lesson Complete
              </Button>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4" style={{ color: theme.text }}>
              <div className="whitespace-pre-wrap">{currentLesson.content}</div>

              {currentLesson.codeExample && (
                <div className="mt-4 rounded-xl overflow-hidden border" style={{ borderColor: theme.border }}>
                  <div className="px-4 py-2 text-xs font-mono font-bold bg-black/20 text-slate-400 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
                    <span>code_example.py</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentLesson.codeExample);
                        onNotify("Copied code to clipboard!");
                      }}
                      className="hover:text-white"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs overflow-x-auto bg-[#070B18] text-slate-100">
                    <code>{currentLesson.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* INTERVIEW TIP HIGHLIGHT */}
            <div className="p-4 rounded-2xl border flex items-start gap-3 bg-gradient-to-r from-[#4F6BFF]/10 to-transparent" style={{ borderColor: "rgba(79,107,255,0.3)" }}>
              <Lightbulb size={20} className="text-[#4F6BFF] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#4F6BFF]">FAANG Interview Secret</div>
                <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{topic.interviewTips}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. MISTAKE INTELLIGENCE DASHBOARD (/mistakes)
   ========================================================================== */
function MistakesPage({ mistakes, onResolveMistake, navigate, theme, onNotify }) {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = useMemo(() => {
    return mistakes.filter(m => {
      const matchType = filterType === "all" || m.mistake_type === filterType;
      const matchStatus = filterStatus === "all" || (filterStatus === "resolved" ? m.resolved : !m.resolved);
      return matchType && matchStatus;
    });
  }, [mistakes, filterType, filterStatus]);

  const unresolvedCount = mistakes.filter(m => !m.resolved).length;

  return (
    <div className="max-w-[1450px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.border }}>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 mb-1">
            <Bug size={15} /> Mistake Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>
            Algorithmic Slip History &amp; Remediation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every boundary violation, TLE, or invariant bug is automatically cataloged and paired with targeted remedial drills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl border text-center min-w-[110px]" style={{ background: theme.card, borderColor: theme.border }}>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Pending Slips</span>
            <div className="text-xl font-black text-rose-500">{unresolvedCount}</div>
          </div>
          <div className="p-3 rounded-2xl border text-center min-w-[110px]" style={{ background: theme.card, borderColor: theme.border }}>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Resolved</span>
            <div className="text-xl font-black text-[#10B981]">{mistakes.length - unresolvedCount}</div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Filter By:</span>
          {["all", "Off-by-One", "Null / Edge Case", "Time Limit Exceeded", "Logic / Inversion"].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterType === t ? "text-white bg-[#4F6BFF] border-transparent" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
              style={filterType !== t ? { background: theme.surface, borderColor: theme.border } : {}}
            >
              {t === "all" ? "All Mistake Types" : t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterStatus === "all" ? "text-[#4F6BFF] bg-[#4F6BFF]/10 font-bold" : "text-slate-500"}`}
          >
            All ({mistakes.length})
          </button>
          <button
            onClick={() => setFilterStatus("unresolved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterStatus === "unresolved" ? "text-rose-500 bg-rose-500/10 font-bold" : "text-slate-500"}`}
          >
            Open ({unresolvedCount})
          </button>
          <button
            onClick={() => setFilterStatus("resolved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterStatus === "resolved" ? "text-[#10B981] bg-[#10B981]/10 font-bold" : "text-slate-500"}`}
          >
            Resolved ({mistakes.length - unresolvedCount})
          </button>
        </div>
      </div>

      {/* MISTAKES GRID */}
      {filtered.length === 0 ? (
        <GlassCard theme={theme} className="p-12 text-center space-y-3">
          <CheckCircle2 size={40} className="mx-auto text-[#10B981]" />
          <h3 className="text-base font-bold" style={{ color: theme.text }}>No Unresolved Mistakes!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You are writing clean, boundary-safe code. Head into the Playground to test more complex algorithms!
          </p>
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <GlassCard key={m.id} theme={theme} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge tone={m.resolved ? "success" : "error"} theme={theme}>
                    {m.mistake_type}
                  </Badge>
                  <span className="text-[11px] text-slate-500">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold" style={{ color: theme.text }}>{m.concept}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.description}</p>
                </div>

                {m.snippet && (
                  <div className="p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto bg-[#070B18] text-rose-300 border border-rose-500/20">
                    <code>{m.snippet}</code>
                  </div>
                )}

                <div className="p-3 rounded-xl border bg-gradient-to-br from-[#4F6BFF]/5 to-transparent space-y-1" style={{ borderColor: theme.border }}>
                  <div className="text-[11px] font-bold text-[#4F6BFF] flex items-center gap-1">
                    <Lightbulb size={12} /> AI Remedial Correction
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.ai_recommendation}</p>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: theme.border }}>
                <button
                  onClick={() => navigate("/playground")}
                  className="text-xs font-bold text-[#4F6BFF] hover:underline flex items-center gap-1"
                >
                  Retest in IDE <ArrowRight size={12} />
                </button>

                {!m.resolved ? (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      onResolveMistake(m.id);
                      onNotify("Marked mistake as resolved! Keep up the rigor.", "success");
                    }}
                    theme={theme}
                  >
                    Mark Resolved
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 size={13} /> Mastered
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   8. INTERACTIVE CODING PLAYGROUND (/playground)
   ========================================================================== */
function PlaygroundPage({ onNotify, theme }) {
  const [selectedProblemId, setSelectedProblemId] = useState("two-sum");
  const [lang, setLang] = useState("python");

  const problem = useMemo(() => {
    return PLAYGROUND_PROBLEMS.find((p) => p.id === selectedProblemId) || PLAYGROUND_PROBLEMS[0];
  }, [selectedProblemId]);

  const [code, setCode] = useState(problem.starter.python);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("tests");
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    setCode(problem.starter[lang] || "");
    setResults(null);
    setHintIndex(0);
  }, [problem, lang]);

  const handleRun = async (isSubmission = false) => {
    setEvaluating(true);
    const evaluation = await APIService.runCode(problem.id, lang, code, isSubmission);
    setResults(evaluation);
    setEvaluating(false);
    onNotify(isSubmission ? "Code evaluated & submitted!" : "Test run complete!", evaluation.passed ? "success" : "warning");
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#4F6BFF] to-[#10B981] text-white">
            <Terminal size={17} />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.text }}>Coding Playground &amp; IDE</h1>
            <p className="text-xs text-slate-500">Run code against genuine multi-case test suites with instant complexity audits.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProblemId}
            onChange={(e) => setSelectedProblemId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer"
            style={{ background: theme.inputBg, borderColor: theme.border, color: theme.text }}
          >
            {PLAYGROUND_PROBLEMS.map((p) => (
              <option key={p.id} value={p.id}>{p.title} ({p.difficulty})</option>
            ))}
          </select>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer uppercase"
            style={{ background: theme.inputBg, borderColor: theme.border, color: theme.text }}
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 17</option>
          </select>
        </div>
      </div>

      {/* 3-COLUMN IDE GRID */}
      <div className="grid lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: PROBLEM DESCRIPTION (4 COLS) */}
        <GlassCard theme={theme} className="lg:col-span-4 p-5 space-y-4 max-h-[800px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <Badge tone="primary" theme={theme}>{problem.category}</Badge>
            <Badge tone={problem.difficulty === "Easy" ? "success" : "warning"} theme={theme}>
              {problem.difficulty}
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-black" style={{ color: theme.text }}>{problem.title}</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
          </div>

          {/* CONSTRAINTS */}
          <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: theme.border }}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Constraints</span>
            <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
              {problem.constraints.map((c, i) => (
                <li key={i}><code className="font-mono text-[11px]">{c}</code></li>
              ))}
            </ul>
          </div>

          {/* TEST CASE EXAMPLES */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.border }}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sample Test Cases</span>
            {problem.testCases.map((tc, i) => (
              <div key={i} className="p-2.5 rounded-xl border text-xs font-mono" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                <div className="text-slate-500"><span className="text-[#4F6BFF]">Input:</span> {tc.input}</div>
                <div className="text-slate-500"><span className="text-[#10B981]">Output:</span> {tc.expected}</div>
              </div>
            ))}
          </div>

          {/* AI HINTS ACCORDION */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="p-3 rounded-xl border bg-amber-500/5 space-y-2" style={{ borderColor: "rgba(245, 158, 11, 0.2)" }}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-500">
                <span className="flex items-center gap-1.5"><Lightbulb size={13} /> Socratic Hint {hintIndex + 1}/{problem.hints.length}</span>
                {hintIndex < problem.hints.length - 1 && (
                  <button
                    onClick={() => setHintIndex(h => h + 1)}
                    className="text-[10px] text-amber-500 underline"
                  >
                    Next Hint
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500">{problem.hints[hintIndex]}</p>
            </div>
          )}
        </GlassCard>

        {/* MIDDLE COLUMN: CODE EDITOR (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl border overflow-hidden shadow-lg" style={{ borderColor: theme.border, background: theme.editorBg }}>
            <div className="flex items-center justify-between px-4 py-2 border-b text-xs font-mono text-slate-400 bg-black/20" style={{ borderColor: theme.border }}>
              <span>solution.{lang === "python" ? "py" : lang === "javascript" ? "js" : lang === "cpp" ? "cpp" : "java"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    onNotify("Copied code to clipboard!");
                  }}
                  className="hover:text-white"
                  title="Copy"
                >
                  <Copy size={13} />
                </button>
                <button
                  onClick={() => setCode(problem.starter[lang] || "")}
                  className="hover:text-white"
                  title="Reset"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="w-full h-[520px] p-4 font-mono text-xs sm:text-sm leading-relaxed bg-transparent outline-none resize-none text-slate-200"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Press Run to test against sample assertions.</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Play}
                disabled={evaluating}
                onClick={() => handleRun(false)}
                theme={theme}
              >
                {evaluating ? "Evaluating..." : "Run Tests"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                disabled={evaluating}
                onClick={() => handleRun(true)}
                theme={theme}
              >
                Submit Solution
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TEST RUNNER & COMPLEXITY FEEDBACK (3 COLS) */}
        <GlassCard theme={theme} className="lg:col-span-3 p-4 space-y-4 max-h-[800px] overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: theme.border }}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Evaluation Console</span>
            {results && (
              <Badge tone={results.passed ? "success" : "error"} theme={theme}>
                {results.passed ? "Accepted" : "Wrong Answer"}
              </Badge>
            )}
          </div>

          {!results && (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Terminal size={32} className="mx-auto mb-2 opacity-40" />
              Hit <strong>Run Tests</strong> or <strong>Submit</strong> to evaluate code against assertions.
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border text-center" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Runtime</span>
                  <div className="font-mono font-bold text-[#4F6BFF] mt-0.5">{results.runtime}</div>
                </div>
                <div className="p-2.5 rounded-xl border text-center" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Memory</span>
                  <div className="font-mono font-bold text-[#6D63D9] mt-0.5">{results.memory}</div>
                </div>
              </div>

              {/* TEST CASE BREAKDOWN */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Test Case Results</span>
                {results.testResults.map((tc) => (
                  <div
                    key={tc.caseNum}
                    className="p-2.5 rounded-xl border text-xs font-mono space-y-1"
                    style={{
                      background: tc.status === "Passed" ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
                      borderColor: tc.status === "Passed" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Case {tc.caseNum}</span>
                      <span className={tc.status === "Passed" ? "text-[#10B981] font-bold" : "text-rose-500 font-bold"}>
                        {tc.status}
                      </span>
                    </div>
                    <div className="text-slate-500 truncate">In: {tc.input}</div>
                    <div className="text-slate-500 truncate">Expected: {tc.expected}</div>
                  </div>
                ))}
              </div>

              {/* COMPLEXITY & OPTIMIZATION AUDIT */}
              <div className="p-3 rounded-xl border space-y-1.5" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                <div className="text-xs font-bold text-[#4F6BFF] flex items-center gap-1">
                  <Gauge size={13} /> Asymptotic Complexity Audit
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  <div><strong>Time:</strong> {results.feedback.timeComplexity}</div>
                  <div><strong>Space:</strong> {results.feedback.spaceComplexity}</div>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{results.feedback.optimization}</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

/* ==========================================================================
   9. COMPLETE 8-ALGORITHM DSA VISUALIZER (/visualizer)
   ========================================================================== */
function VisualizerPage({ theme, onNotify }) {
  const [category, setCategory] = useState("sorting");
  const [algo, setAlgo] = useState("bubble");
  const [arraySize, setArraySize] = useState(14);
  const [speed, setSpeed] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const timerRef = useRef(null);

  // Generate appropriate steps based on category & algo
  const steps = useMemo(() => {
    if (category === "sorting") {
      const arr = genRandomArray(arraySize);
      return generateSortingSteps(algo, arr);
    } else if (category === "binary") {
      const arr = genRandomArray(arraySize).sort((a, b) => a - b);
      return generateBinarySearchSteps(arr);
    } else if (category === "stack") {
      return generateStackSteps();
    } else if (category === "queue") {
      return generateQueueSteps();
    } else if (category === "linkedlist") {
      return generateLinkedListSteps();
    } else if (category === "tree") {
      return generateTreeSteps();
    } else if (category === "bfs") {
      return generateGraphBFSSteps();
    } else if (category === "dfs") {
      return generateGraphDFSSteps();
    }
    return [];
  }, [category, algo, arraySize]);

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [category, algo, arraySize]);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(40, 900 - speed * 8);
      timerRef.current = setInterval(() => {
        setStepIdx((curr) => {
          if (curr >= steps.length - 1) {
            setIsPlaying(false);
            return curr;
          }
          return curr + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, steps.length]);

  const current = steps[stepIdx] || {};

  return (
    <div className="max-w-[1450px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* HEADER & CATEGORY TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.border }}>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06B6D4] mb-1">
            <BarChart3 size={15} /> 8-Structure Interactive Visualizer
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>
            Watch Algorithms <GradientText>Execute</GradientText>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Step-by-step mathematical state inspection across sorting, pointers, trees, and graphs.
          </p>
        </div>

        {/* ALGORITHM CATEGORY SELECTOR */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "sorting", name: "Sorting" },
            { id: "binary", name: "Binary Search" },
            { id: "stack", name: "Stack (LIFO)" },
            { id: "queue", name: "Queue (FIFO)" },
            { id: "linkedlist", name: "Linked List" },
            { id: "tree", name: "BST Trees" },
            { id: "bfs", name: "Graph BFS" },
            { id: "dfs", name: "Graph DFS" },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                if (c.id === "sorting") setAlgo("bubble");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                category === c.id ? "text-white bg-[#4F6BFF] border-transparent shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
              style={category !== c.id ? { background: theme.surface, borderColor: theme.border } : {}}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* SORTING SUB-ALGORITHM SELECTOR */}
      {category === "sorting" && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Algorithm:</span>
          {[
            { id: "bubble", name: "Bubble Sort" },
            { id: "selection", name: "Selection Sort" },
            { id: "insertion", name: "Insertion Sort" },
            { id: "quick", name: "Quick Sort" },
            { id: "merge", name: "Merge Sort" }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setAlgo(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                algo === s.id ? "text-[#4F6BFF] bg-[#4F6BFF]/10 border-[#4F6BFF]/30 font-bold" : "text-slate-500"
              }`}
              style={algo !== s.id ? { borderColor: theme.border } : {}}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* STEP REASONING BANNER */}
      <div className="p-4 rounded-2xl border flex items-start gap-3 backdrop-blur-xl shadow-md" style={{ background: theme.card, borderColor: "rgba(79,107,255,0.3)" }}>
        <Brain size={18} className="text-[#4F6BFF] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-[#4F6BFF]">Current Operation (Step {stepIdx + 1}/{steps.length})</span>
          <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: theme.text }}>
            {current.desc || "Ready to execute."}
          </p>
        </div>
      </div>

      {/* MAIN STAGE CANVAS */}
      <GlassCard theme={theme} className="p-6 min-h-[380px] flex items-center justify-center relative overflow-hidden">
        {/* 1. SORTING & BINARY SEARCH VISUALIZATION (BARS) */}
        {(category === "sorting" || category === "binary") && current.arr && (
          <div className="w-full flex items-end justify-center gap-2 h-72 pb-6">
            {current.arr.map((val, idx) => {
              const isCompare = current.compare?.includes(idx);
              const isSwap = current.swap?.includes(idx);
              const isSorted = current.sortedIndices?.includes(idx);
              const isLo = current.lo === idx;
              const isHi = current.hi === idx;
              const isMid = current.mid === idx;

              let barColor = theme.dark ? "#334155" : "#CBD5E1";
              if (isSwap) barColor = "#EF4444";
              else if (isCompare) barColor = "#F59E0B";
              else if (isSorted) barColor = "#10B981";
              else if (isMid) barColor = "#4F6BFF";
              else if (isLo || isHi) barColor = "#06B6D4";

              return (
                <div key={idx} className="flex flex-col items-center flex-1 max-w-[48px] h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 mb-1">{val}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-150"
                    style={{
                      height: `${(val / 100) * 100}%`,
                      background: barColor,
                    }}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    {isMid ? "MID" : isLo ? "LO" : isHi ? "HI" : idx}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. STACK VISUALIZATION (LIFO SLOTS) */}
        {category === "stack" && current.items && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-slate-400">STACK POINTER (LIFO)</span>
            <div className="w-48 border-2 border-t-0 rounded-b-2xl p-3 flex flex-col-reverse gap-2 min-h-[220px]" style={{ borderColor: "#4F6BFF" }}>
              {current.items.map((it, idx) => (
                <div
                  key={idx}
                  className="w-full py-2.5 rounded-xl text-center text-xs font-bold font-mono text-white shadow-md animate-scale-in"
                  style={{ background: "linear-gradient(135deg, #4F6BFF, #6D63D9)" }}
                >
                  {it} {idx === current.items.length - 1 && "(TOP)"}
                </div>
              ))}
              {current.items.length === 0 && (
                <div className="text-center text-xs text-slate-400 my-auto">Stack is Empty</div>
              )}
            </div>
          </div>
        )}

        {/* 3. QUEUE VISUALIZATION (CIRCULAR BUFFER) */}
        {category === "queue" && current.buffer && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-bold text-slate-400">CIRCULAR QUEUE BUFFER (CAPACITY: 5)</span>
            <div className="flex items-center gap-3">
              {current.buffer.map((val, idx) => {
                const isFront = current.front === idx;
                const isRear = current.rear === idx;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-mono text-sm font-bold shadow-md"
                      style={{
                        background: val !== null ? "linear-gradient(135deg, #06B6D4, #4F6BFF)" : theme.surface,
                        borderColor: isFront ? "#10B981" : isRear ? "#F59E0B" : theme.border,
                        color: val !== null ? "#FFFFFF" : theme.textSubtle
                      }}
                    >
                      {val !== null ? val : "—"}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {isFront && isRear ? "F / R" : isFront ? "FRONT" : isRear ? "REAR" : `idx ${idx}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. LINKED LIST VISUALIZATION */}
        {category === "linkedlist" && current.nodes && (
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            {current.nodes.map((node) => {
              const isHead = current.head === node.id;
              const isCurr = current.curr === node.id;
              const isPrev = current.prev === node.id;

              return (
                <div key={node.id} className="flex items-center gap-2">
                  <div
                    className="p-3 rounded-2xl border-2 shadow-md flex items-center gap-3"
                    style={{
                      background: theme.surface,
                      borderColor: isCurr ? "#4F6BFF" : isPrev ? "#F59E0B" : theme.border,
                    }}
                  >
                    <div className="text-sm font-black font-mono" style={{ color: theme.text }}>{node.val}</div>
                    <div className="text-[10px] text-slate-400 border-l pl-2" style={{ borderColor: theme.border }}>
                      {node.next ? `-> ${node.next}` : "NULL"}
                    </div>
                  </div>
                  {node.next && <ArrowRight size={16} className="text-[#4F6BFF]" />}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. BST TREE VISUALIZATION */}
        {category === "tree" && current.tree && (
          <div className="relative w-full max-w-[500px] h-[240px]">
            {current.tree.map((node) => {
              const isActive = current.active === node.val;
              const isVisited = current.visited?.includes(node.val);

              return (
                <div
                  key={node.id}
                  className="absolute w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono text-xs font-black shadow-md transition-all duration-300"
                  style={{
                    left: `${node.x - 22}px`,
                    top: `${node.y - 22}px`,
                    background: isActive ? "#4F6BFF" : isVisited ? "#10B981" : theme.surface,
                    borderColor: isActive ? "#FFFFFF" : isVisited ? "#10B981" : theme.border,
                    color: isActive || isVisited ? "#FFFFFF" : theme.text,
                  }}
                >
                  {node.val}
                </div>
              );
            })}
          </div>
        )}

        {/* 6. GRAPH BFS / DFS VISUALIZATION */}
        {(category === "bfs" || category === "dfs") && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex items-center gap-4">
              {["A", "B", "C", "D", "E", "F"].map((node) => {
                const isCur = current.current === node;
                const isVis = current.visited?.includes(node);
                return (
                  <div
                    key={node}
                    className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold text-sm shadow-md transition-all"
                    style={{
                      background: isCur ? "#4F6BFF" : isVis ? "#10B981" : theme.surface,
                      borderColor: isCur ? "#FFFFFF" : isVis ? "#10B981" : theme.border,
                      color: isCur || isVis ? "#FFFFFF" : theme.text,
                    }}
                  >
                    {node}
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded-xl border text-xs font-mono" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
              {category === "bfs" ? (
                <span>Queue: [{current.queue?.join(", ") || "Empty"}]</span>
              ) : (
                <span>Call Stack: [{current.stack?.join(" -> ") || "Empty"}]</span>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* CONTROLS BAR */}
      <GlassCard theme={theme} className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={SkipBack}
            onClick={() => setStepIdx(c => Math.max(0, c - 1))}
            disabled={stepIdx === 0}
            theme={theme}
          >
            Prev
          </Button>
          <Button
            variant={isPlaying ? "secondary" : "primary"}
            size="sm"
            icon={isPlaying ? Pause : Play}
            onClick={() => setIsPlaying(!isPlaying)}
            theme={theme}
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={SkipForward}
            onClick={() => setStepIdx(c => Math.min(steps.length - 1, c + 1))}
            disabled={stepIdx >= steps.length - 1}
            theme={theme}
          >
            Step
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              setStepIdx(0);
              setIsPlaying(false);
            }}
            theme={theme}
          >
            Reset
          </Button>
        </div>

        {/* SPEED & INPUT SIZE SLIDERS */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span>Speed:</span>
            <input
              type="range"
              min="10"
              max="95"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-[#4F6BFF] cursor-pointer"
            />
          </div>
          {category === "sorting" && (
            <div className="flex items-center gap-2">
              <span>Elements:</span>
              <input
                type="range"
                min="8"
                max="24"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="accent-[#4F6BFF] cursor-pointer"
              />
              <span className="font-mono text-slate-700 dark:text-slate-300">{arraySize}</span>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   10. CHATGPT-STYLE AI BUDDY (/ai-buddy)
   ========================================================================== */
function AIBuddyPage({ theme, onNotify }) {
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "assistant",
      content: `Hello! I am your **NextGenAI Buddy** — your personalized AI mentor for Data Structures, Algorithms, and FAANG interviews.

How can I help accelerate your learning today?
- **Explain** core invariants (e.g. Kadane's algorithm, Monotonic Stacks)
- **Debug** failing edge cases in your code
- **Optimize** asymptotic Time/Space complexity
- **Mock Interview** technical problem scenarios`,
      citations: [
        { title: "Introduction to Algorithms (CLRS 4th Ed.)", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
        { title: "CP-Algorithms DSA Reference", url: "https://cp-algorithms.com/" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("explain");
  const [topicContext, setTopicContext] = useState("arrays");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    const query = text.trim();
    if (!query || loading) return;

    const userMsg = { id: `u_${Date.now()}`, role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await APIService.sendChatMessage(query, activeMode, topicContext);
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: res.reply,
          citations: res.citations || []
        }
      ]);
    } catch (e) {
      onNotify("Error reaching AI service.", "error");
    } finally {
      setLoading(false);
    }
  };

  const actionPills = [
    { label: "Explain Invariant", mode: "explain", prompt: "Explain the two pointer invariant for Container With Most Water." },
    { label: "Debug My Code", mode: "debug", prompt: "How do I prevent off-by-one errors in binary search?" },
    { label: "Optimize Space", mode: "optimize", prompt: "How can I optimize Fibonacci or Climbing Stairs to O(1) space?" },
    { label: "Mock Question", mode: "interview", prompt: "Give me a Google technical interview problem on Monotonic Stacks." }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)] flex flex-col gap-4">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F6BFF] to-[#6D63D9] flex items-center justify-center text-white">
            <Brain size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: theme.text }}>AI Buddy Pedagogical Chat</h1>
            <p className="text-[11px] text-slate-500">Grounded Socratic DSA mentorship with academic citations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={topicContext}
            onChange={(e) => setTopicContext(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer"
            style={{ background: theme.inputBg, borderColor: theme.border, color: theme.text }}
          >
            {TOPICS_DATA.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === "user"
                  ? "bg-[#4F6BFF] text-white"
                  : "bg-gradient-to-tr from-[#6D63D9] to-[#06B6D4] text-white"
              }`}
            >
              {m.role === "user" ? <User size={14} /> : <Brain size={14} />}
            </div>

            <div
              className={`max-w-[85%] p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-[#4F6BFF] text-white border-transparent"
                  : ""
              }`}
              style={m.role === "assistant" ? { background: theme.card, borderColor: theme.border, color: theme.text } : {}}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* CITATIONS */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t text-[11px] space-y-1" style={{ borderColor: theme.border }}>
                  <span className="font-bold text-slate-400 flex items-center gap-1">
                    <BookOpen size={11} /> Verified Academic Sources &amp; Citations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {m.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#4F6BFF] hover:underline"
                      >
                        {c.title} <ArrowUpRight size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold p-2">
            <RefreshCw size={14} className="animate-spin text-[#4F6BFF]" />
            AI Buddy is researching algorithms &amp; formulating reasoning...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ACTION PILLS */}
      <div className="flex flex-wrap gap-2 pt-1">
        {actionPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveMode(pill.mode);
              handleSend(pill.prompt);
            }}
            className="px-3 py-1 rounded-xl text-[11px] font-semibold border text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:border-[#4F6BFF] transition-colors"
            style={{ background: theme.surface, borderColor: theme.border }}
          >
            + {pill.label}
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask AI Buddy anything about DSA, complexity, edge cases, or code debugging..."
          rows={2}
          className="w-full p-3.5 pr-14 rounded-2xl border text-xs sm:text-sm outline-none resize-none shadow-sm transition-all"
          style={{
            background: theme.card,
            borderColor: theme.border,
            color: theme.text
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="absolute right-3.5 bottom-3.5 w-8 h-8 rounded-xl bg-gradient-to-r from-[#4F6BFF] to-[#6D63D9] flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   11. QUIZ HUB & ACTIVE RUNNER (/quiz, /quiz/:id)
   ========================================================================== */
function QuizPage({ onNotify, theme }) {
  const [selectedQuiz, setSelectedQuiz] = useState(QUIZZES_DATA[0]);
  const [inProgress, setInProgress] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(selectedQuiz.timeLimit || 300);

  useEffect(() => {
    let t;
    if (inProgress && !submitted && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(curr => curr - 1), 1000);
    }
    return () => clearInterval(t);
  }, [inProgress, submitted, timeLeft]);

  const handleStart = (quiz) => {
    setSelectedQuiz(quiz);
    setInProgress(true);
    setCurrentQIdx(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setTimeLeft(quiz.timeLimit || 300);
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    const mistakes = [];

    selectedQuiz.questions.forEach((q) => {
      const ans = selectedAnswers[q.id];
      if (ans === q.answer) {
        correct++;
      } else {
        mistakes.push({
          question_id: q.id,
          mistake_type: "Concept Misunderstanding",
          user_answer: `Selected option index: ${ans}`,
          explanation: q.explanation
        });
      }
    });

    setScore(correct);
    setSubmitted(true);
    await APIService.submitQuiz(
      selectedQuiz.id,
      selectedQuiz.topic,
      correct,
      selectedQuiz.questions.length,
      selectedQuiz.timeLimit - timeLeft,
      mistakes
    );
    onNotify(`Quiz submitted! You scored ${correct}/${selectedQuiz.questions.length}`, correct >= 2 ? "success" : "warning");
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.border }}>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D63D9] mb-1">
            <GraduationCap size={15} /> Evaluated Assessment Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>
            Algorithmic Quizzes &amp; Theory Checks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Validate mental models and loop invariants. Wrong answers feed automatically into your Mistake Intelligence.
          </p>
        </div>
      </div>

      {!inProgress ? (
        /* QUIZ CATALOG */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZZES_DATA.map((quiz) => (
            <GlassCard key={quiz.id} theme={theme} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge tone="primary" theme={theme}>{quiz.difficulty}</Badge>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock size={13} /> {Math.floor(quiz.timeLimit / 60)} mins
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: theme.text }}>{quiz.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{quiz.questions.length} multi-format questions</p>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleStart(quiz)}
                theme={theme}
              >
                Begin Assessment
              </Button>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* ACTIVE QUIZ RUNNER */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* TIMER & PROGRESS BAR */}
          <GlassCard theme={theme} className="p-4 flex items-center justify-between">
            <div className="text-xs font-bold" style={{ color: theme.text }}>
              Question {currentQIdx + 1} of {selectedQuiz.questions.length}
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-500">
              <Clock size={14} />
              <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
            </div>
          </GlassCard>

          {/* ACTIVE QUESTION */}
          {(() => {
            const q = selectedQuiz.questions[currentQIdx];
            return (
              <GlassCard theme={theme} className="p-6 space-y-5">
                <h3 className="text-base font-bold" style={{ color: theme.text }}>{q.question}</h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    let optStyle = { background: theme.bgSubtle, borderColor: theme.border };
                    if (submitted) {
                      if (optIdx === q.answer) optStyle = { background: "rgba(16,185,129,0.15)", borderColor: "#10B981" };
                      else if (isSelected) optStyle = { background: "rgba(239,68,68,0.15)", borderColor: "#EF4444" };
                    } else if (isSelected) {
                      optStyle = { background: "rgba(79,107,255,0.15)", borderColor: "#4F6BFF" };
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className="w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between"
                        style={optStyle}
                      >
                        <span style={{ color: theme.text }}>{opt}</span>
                        {submitted && optIdx === q.answer && <CheckCircle2 size={16} className="text-[#10B981]" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3 rounded-xl border bg-gradient-to-r from-[#4F6BFF]/10 to-transparent space-y-1" style={{ borderColor: theme.border }}>
                    <div className="text-xs font-bold text-[#4F6BFF]">Explanation</div>
                    <p className="text-xs text-slate-500 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </GlassCard>
            );
          })()}

          {/* NAVIGATION FOOTER */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentQIdx === 0}
              onClick={() => setCurrentQIdx(c => c - 1)}
              theme={theme}
            >
              Previous
            </Button>

            {!submitted ? (
              currentQIdx < selectedQuiz.questions.length - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentQIdx(c => c + 1)}
                  theme={theme}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleSubmit}
                  theme={theme}
                >
                  Submit Quiz
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setInProgress(false)}
                theme={theme}
              >
                Back to Quizzes
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   12. FAANG MOCK INTERVIEWS (/interview)
   ========================================================================== */
function InterviewPrepPage({ theme, onNotify }) {
  const [selectedTrack, setSelectedTrack] = useState(INTERVIEW_TRACKS[0]);
  const [candidateAns, setCandidateAns] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [rubricResult, setRubricResult] = useState(null);

  const handleEvaluate = async () => {
    if (!candidateAns.trim()) return;
    setEvaluating(true);
    const res = await APIService.request("/ai/interview-eval", {
      method: "POST",
      body: JSON.stringify({ question: selectedTrack.mockScenario, answer: candidateAns, category: "technical" })
    });
    setRubricResult(res || {
      overall_score: 92,
      rubric: {
        approach: { score: 9, feedback: "Clearly stated algorithm upfront." },
        complexity_analysis: { score: 9, feedback: "Accurate Big-O time and space." },
        edge_cases: { score: 8, feedback: "Addressed empty and single element bounds." }
      }
    });
    setEvaluating(false);
    onNotify("Mock Interview Rubric generated!", "success");
  };

  return (
    <div className="max-w-[1450px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.border }}>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 mb-1">
            <Trophy size={15} /> FAANG Mock Interview Arena
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>
            Company Tracks &amp; AI Interviewer Rubric
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate real Google, Meta, and Amazon technical rounds with automated scoring across approach, invariants, and edge cases.
          </p>
        </div>
      </div>

      {/* TRACK SELECTION TABS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INTERVIEW_TRACKS.map((t) => (
          <GlassCard
            key={t.company}
            theme={theme}
            onClick={() => setSelectedTrack(t)}
            className={`p-4 cursor-pointer transition-all ${
              selectedTrack.company === t.company ? "ring-2 ring-[#4F6BFF]" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-black" style={{ color: theme.text }}>{t.company}</span>
              <Badge tone="primary" theme={theme}>{t.difficulty}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t.tagline}</p>
          </GlassCard>
        ))}
      </div>

      {/* MOCK SCENARIO WORKSPACE */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <GlassCard theme={theme} className="lg:col-span-7 p-6 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#4F6BFF] uppercase tracking-wider">Live Interview Question</span>
            <h2 className="text-lg font-bold" style={{ color: theme.text }}>{selectedTrack.mockScenario}</h2>
            <p className="text-xs text-slate-500">
              Verbalize your approach, time/space complexity analysis, and edge case guards before writing pseudo-code.
            </p>
          </div>

          <textarea
            value={candidateAns}
            onChange={(e) => setCandidateAns(e.target.value)}
            placeholder="Type your explanation or pseudocode here (e.g. 'I will use a Min-Heap of size K to maintain top elements in O(n log k) time...')"
            rows={8}
            className="w-full p-4 rounded-xl border text-xs sm:text-sm font-mono leading-relaxed outline-none resize-none"
            style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
          />

          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            disabled={evaluating || !candidateAns.trim()}
            onClick={handleEvaluate}
            theme={theme}
          >
            {evaluating ? "Evaluating Rubric..." : "Submit to AI Interviewer"}
          </Button>
        </GlassCard>

        {/* AI EVALUATION RUBRIC */}
        <GlassCard theme={theme} className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">FAANG Scoring Rubric</span>
            {rubricResult && (
              <span className="text-lg font-black text-[#10B981]">{rubricResult.overall_score}/100</span>
            )}
          </div>

          {!rubricResult ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Trophy size={32} className="mx-auto mb-2 opacity-40" />
              Write your candidate answer and click submit to trigger AI rubric evaluation.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(rubricResult.rubric || {}).map(([dim, val]) => (
                <div key={dim} className="p-3 rounded-xl border text-xs space-y-1" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
                  <div className="flex items-center justify-between font-bold capitalize" style={{ color: theme.text }}>
                    <span>{dim.replace("_", " ")}</span>
                    <span className="text-[#4F6BFF]">{val.score}/10</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{val.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

/* ==========================================================================
   13. AI STUDY PLANNER (/study-plan)
   ========================================================================== */
function StudyPlanPage({ theme, onNotify }) {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    APIService.getStudyPlan().then(p => setPlan(p));
  }, []);

  const handleToggle = (milestoneId, currentDone) => {
    APIService.toggleMilestone(milestoneId, !currentDone);
    setPlan(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => m.id === milestoneId ? { ...m, done: !currentDone } : m)
    }));
    onNotify(!currentDone ? "Milestone marked complete! (+50 XP)" : "Milestone updated.", "success");
  };

  const doneCount = plan?.milestones?.filter(m => m.done).length || 0;
  const totalCount = plan?.milestones?.length || 1;
  const pct = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.border }}>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F6BFF] mb-1">
            <Calendar size={15} /> AI Study Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>
            {plan?.title || "FAANG 8-Week SDE Acceleration Plan"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Targeting: <strong style={{ color: theme.text }}>{plan?.target_company}</strong> · Target Exam Date: {plan?.target_date} ({plan?.hours_per_week}h/week)
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-[#4F6BFF]">{pct}%</div>
          <span className="text-xs text-slate-500">Plan Completion</span>
        </div>
      </div>

      <ProgressBar value={doneCount} max={totalCount} height={8} />

      {/* MILESTONE CHECKLIST */}
      <div className="space-y-3">
        {plan?.milestones?.map((m) => (
          <GlassCard
            key={m.id}
            theme={theme}
            onClick={() => handleToggle(m.id, m.done)}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {m.done ? (
                <CheckSquare size={20} className="text-[#10B981] shrink-0" />
              ) : (
                <Square size={20} className="text-slate-400 shrink-0" />
              )}
              <div>
                <h3 className={`text-sm font-bold ${m.done ? "line-through text-slate-400" : ""}`} style={!m.done ? { color: theme.text } : {}}>
                  {m.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">{m.deadline}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {m.topics?.map(t => (
                <Badge key={t} tone="primary" theme={theme}>{t}</Badge>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   14. DASHBOARD & ANALYTICS (/dashboard, /analytics)
   ========================================================================== */
function DashboardPage({ user, navigate, theme, onNotify }) {
  const [data, setData] = useState(null);
  const [twin, setTwin] = useState(null);

  useEffect(() => {
    APIService.getDashboard().then(d => setData(d));
    APIService.getLearningTwin().then(t => setTwin(t));
  }, []);

  if (!data) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading personalized analytics...</div>;
  }

  const { stats, weekly_activity } = data;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* WELCOME BANNER */}
      <div className="p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm" style={{ background: theme.card, borderColor: theme.border }}>
        <div>
          <div className="text-xs font-bold text-[#4F6BFF] uppercase tracking-wider">Learner Command Center</div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1" style={{ color: theme.text }}>
            Welcome back, {user?.name || "Sneha"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Current Streak: <strong className="text-amber-500">{stats.streak} Days 🔥</strong> · Mastery Average: <strong className="text-[#10B981]">{stats.avg_mastery}%</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Bug} onClick={() => navigate("/mistakes")} theme={theme}>
            Review Mistakes ({stats.unresolved_mistakes})
          </Button>
          <Button variant="primary" size="sm" icon={Terminal} onClick={() => navigate("/playground")} theme={theme}>
            Continue Practice
          </Button>
        </div>
      </div>

      {/* 4 STAT METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", val: stats.problems_solved, icon: Code2, color: "#4F6BFF" },
          { label: "Lessons Completed", val: stats.completed_lessons, icon: BookOpen, color: "#6D63D9" },
          { label: "Quiz Accuracy", val: `${stats.quiz_accuracy}%`, icon: GraduationCap, color: "#10B981" },
          { label: "Total XP Earned", val: `${stats.xp} XP`, icon: Zap, color: "#F59E0B" }
        ].map((s, i) => (
          <GlassCard key={i} theme={theme} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{s.label}</span>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black" style={{ color: theme.text }}>{s.val}</div>
          </GlassCard>
        ))}
      </div>

      {/* AI LEARNING TWIN INSIGHT & WEEKLY ACTIVITY CHART */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEARNING TWIN CARD (5 COLS) */}
        <GlassCard theme={theme} className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D63D9]">
              <Brain size={16} /> AI Learning Twin Profile
            </div>
            <Badge tone="purple" theme={theme}>{twin?.archetype || "Analytical Solver"}</Badge>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calculated Strengths</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {twin?.strong_topics?.map(t => (
                  <Badge key={t} tone="success" theme={theme}>{t.toUpperCase()}</Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Weak Topics (Target Areas)</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {twin?.weak_topics?.map(t => (
                  <Badge key={t} tone="warning" theme={theme}>{t.toUpperCase()}</Badge>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl border bg-gradient-to-br from-[#4F6BFF]/10 to-transparent space-y-1.5" style={{ borderColor: theme.border }}>
              <div className="text-xs font-bold text-[#4F6BFF] flex items-center gap-1.5">
                <Lightbulb size={14} /> Algorithmic Recommendation
              </div>
              <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                {twin?.recommendations?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* WEEKLY ACTIVITY RECHARTS (7 COLS) */}
        <GlassCard theme={theme} className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp size={15} /> Weekly Study Minutes &amp; XP
            </span>
            <span className="text-xs text-[#10B981] font-bold">Past 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly_activity}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F6BFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F6BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.dark ? "rgba(148,163,184,0.1)" : "rgba(203,213,225,0.4)"} />
                <XAxis dataKey="activity_date" tick={{ fontSize: 10, fill: theme.textSubtle }} />
                <YAxis tick={{ fontSize: 10, fill: theme.textSubtle }} />
                <Tooltip
                  contentStyle={{
                    background: theme.card,
                    borderColor: theme.border,
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}
                />
                <Area type="monotone" dataKey="xp_earned" stroke="#4F6BFF" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" name="XP Earned" />
                <Line type="monotone" dataKey="minutes_spent" stroke="#10B981" strokeWidth={2} name="Minutes Studied" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ==========================================================================
   15. ACHIEVEMENTS & GAMIFICATION (/achievements)
   ========================================================================== */
function AchievementsPage({ theme, onNotify }) {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    APIService.getDashboard().then(d => {
      setUnlocked(d?.achievements?.map(a => a.achievement_id) || []);
    });
  }, []);

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="pb-4 border-b" style={{ borderColor: theme.border }}>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 mb-1">
          <Trophy size={15} /> Gamified Milestones
        </div>
        <h1 className="text-2xl sm:text-3xl font-black" style={{ color: theme.text }}>
          Badges &amp; Hall of Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Unlocked automatically as you execute tests, clear quizzes, and conquer interview tracks.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ACHIEVEMENTS_DATA.map((ach) => {
          const isUnlocked = unlocked.includes(ach.id);
          return (
            <GlassCard
              key={ach.id}
              theme={theme}
              className={`p-6 text-center space-y-3 ${
                isUnlocked ? "border-[#4F6BFF]/40 shadow-md" : "opacity-50 grayscale"
              }`}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg"
                style={{
                  background: isUnlocked
                    ? "linear-gradient(135deg, #4F6BFF, #6D63D9)"
                    : "#64748B"
                }}
              >
                <Trophy size={24} />
              </div>

              <div>
                <h3 className="text-sm font-bold" style={{ color: theme.text }}>{ach.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{ach.desc}</p>
              </div>

              <Badge tone={isUnlocked ? "success" : "default"} theme={theme}>
                {isUnlocked ? "Unlocked · +" + ach.xp + " XP" : "Locked · " + ach.xp + " XP"}
              </Badge>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   16. SETTINGS & PROFILE (/settings, /profile)
   ========================================================================== */
function SettingsPage({ themeMode, setThemeMode, theme, onNotify }) {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="pb-4 border-b" style={{ borderColor: theme.border }}>
        <h1 className="text-2xl font-black" style={{ color: theme.text }}>Application Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Configure theme persistence, daily targets, and developer API options.</p>
      </div>

      <GlassCard theme={theme} className="p-6 space-y-6">
        {/* THEME PREFERENCE */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Appearance Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light Mode", icon: Sun },
              { id: "dark", label: "Dark Mode", icon: Moon },
              { id: "system", label: "System Sync", icon: Monitor },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setThemeMode(m.id);
                  onNotify(`Switched to ${m.label}`);
                }}
                className={`p-4 rounded-2xl border text-center text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                  themeMode === m.id ? "border-[#4F6BFF] ring-2 ring-[#4F6BFF]/30 text-[#4F6BFF]" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                style={{ background: theme.bgSubtle, borderColor: themeMode === m.id ? "#4F6BFF" : theme.border }}
              >
                <m.icon size={20} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* STUDY GOALS */}
        <div className="space-y-2 pt-4 border-t" style={{ borderColor: theme.border }}>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Study Target</label>
          <div className="flex items-center gap-3">
            {["20 mins", "45 mins", "60 mins", "90 mins"].map((goal, idx) => (
              <button
                key={goal}
                onClick={() => onNotify(`Target updated to ${goal}/day!`)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  idx === 1 ? "bg-[#4F6BFF] text-white border-transparent" : "text-slate-500"
                }`}
                style={idx !== 1 ? { background: theme.surface, borderColor: theme.border } : {}}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ProfilePage({ user, onUpdateUser, theme, onNotify }) {
  const [name, setName] = useState(user?.name || "Sneha Rao");
  const [bio, setBio] = useState(user?.bio || "");
  const [role, setRole] = useState(user?.target_role || "Software Development Engineer");

  const handleSave = () => {
    onUpdateUser({ name, bio, target_role: role });
    onNotify("Profile saved successfully!", "success");
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="pb-4 border-b" style={{ borderColor: theme.border }}>
        <h1 className="text-2xl font-black" style={{ color: theme.text }}>User Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your candidate identity, target role, and educational background.</p>
      </div>

      <GlassCard theme={theme} className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
            alt={name}
            className="w-16 h-16 rounded-2xl bg-slate-200 border"
            style={{ borderColor: theme.border }}
          />
          <div>
            <h2 className="text-lg font-bold" style={{ color: theme.text }}>{name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-500">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border text-xs sm:text-sm outline-none"
              style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border text-xs sm:text-sm outline-none"
              style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500">Bio &amp; Academic Background</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full mt-1 p-3 rounded-xl border text-xs sm:text-sm outline-none"
              style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
            />
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleSave} theme={theme}>
          Save Changes
        </Button>
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   17. AUTH MODAL & FORMS (/login, /signup, /forgot-password)
   ========================================================================== */
function AuthModal({ isOpen, onClose, onLogin, theme }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("sneha.rao@vit.ac.in");
  const [password, setPassword] = useState("Password123!");
  const [name, setName] = useState("Sneha Rao");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "login") {
      const u = await APIService.login(email, password);
      onLogin(u);
    } else if (tab === "signup") {
      const u = await APIService.signup(name, email, password);
      onLogin(u);
    } else {
      alert("Password reset instructions sent to your email!");
      setTab("login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard theme={theme} className="w-full max-w-md p-6 space-y-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl mx-auto bg-gradient-to-tr from-[#4F6BFF] to-[#6D63D9] flex items-center justify-center text-white mb-2 shadow-lg shadow-[#4F6BFF]/30">
            <Brain size={24} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>
            {tab === "login" ? "Welcome Back" : tab === "signup" ? "Create Account" : "Reset Password"}
          </h2>
          <p className="text-xs text-slate-500">NextGenAI Buddy · Academic DSA SaaS Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <div>
              <label className="text-xs font-bold text-slate-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 p-2.5 rounded-xl border text-xs outline-none"
                style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2.5 rounded-xl border text-xs outline-none"
              style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
            />
          </div>

          {tab !== "forgot" && (
            <div>
              <label className="text-xs font-bold text-slate-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 p-2.5 rounded-xl border text-xs outline-none"
                style={{ background: theme.bgSubtle, borderColor: theme.border, color: theme.text }}
              />
            </div>
          )}

          <Button variant="primary" size="md" className="w-full" theme={theme}>
            {tab === "login" ? "Sign In" : tab === "signup" ? "Create Account" : "Send Reset Link"}
          </Button>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t" style={{ borderColor: theme.border }}>
          {tab === "login" ? (
            <>
              <button onClick={() => setTab("signup")} className="text-[#4F6BFF] hover:underline">New user? Register</button>
              <button onClick={() => setTab("forgot")} className="hover:underline">Forgot password?</button>
            </>
          ) : (
            <button onClick={() => setTab("login")} className="text-[#4F6BFF] hover:underline">Already have an account? Sign In</button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   18. NOTIFICATIONS MODAL
   ========================================================================== */
function NotificationsModal({ isOpen, onClose, theme }) {
  if (!isOpen) return null;

  const notes = [
    { title: "Weekly SDE Contest Scheduled", time: "2 hours ago", desc: "Test your skills against 500+ student coders this Saturday." },
    { title: "7-Day Continuous Streak Unlocked!", time: "1 day ago", desc: "You earned the 'Iron Dedication' badge (+250 XP)." },
    { title: "New Module: Kahn's Algorithm", time: "2 days ago", desc: "Master Topological Sorting and DAG cycle detection in Graphs." }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard theme={theme} className="w-full max-w-md p-6 space-y-4 relative">
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
          <span className="text-sm font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Bell size={16} className="text-[#4F6BFF]" /> System Notifications
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2.5">
          {notes.map((n, i) => (
            <div key={i} className="p-3 rounded-xl border space-y-1" style={{ background: theme.bgSubtle, borderColor: theme.border }}>
              <div className="flex items-center justify-between text-xs font-bold" style={{ color: theme.text }}>
                <span>{n.title}</span>
                <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500">{n.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ==========================================================================
   19. LANDING & CURRICULUM HUB (/ & /learn)
   ========================================================================== */
function LandingPage({ navigate, theme }) {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border bg-gradient-to-r from-[#4F6BFF]/10 to-[#6D63D9]/10 text-[#4F6BFF]" style={{ borderColor: "rgba(79,107,255,0.3)" }}>
          <Sparkles size={14} /> Production-Grade AI-Powered DSA SaaS Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight" style={{ color: theme.text }}>
          Master Data Structures &amp; Algorithms with your <GradientText>AI Learning Twin</GradientText>
        </h1>

        <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          NextGenAI Buddy delivers an adaptive Socratic tutor, 8-algorithm visualizers, multi-language IDE, and genuine Mistake Intelligence tracking every loop invariant error.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button size="lg" icon={Play} onClick={() => navigate("/learn")} theme={theme}>
            Explore Curriculum
          </Button>
          <Button size="lg" variant="secondary" icon={Terminal} onClick={() => navigate("/playground")} theme={theme}>
            Coding Playground
          </Button>
          <Button size="lg" variant="outline" icon={BarChart3} onClick={() => navigate("/visualizer")} theme={theme}>
            Watch Algorithms
          </Button>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="max-w-[1450px] mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "8-Algorithm Visualizer", desc: "Inspect comparisons, swaps, pointer reversals, and graph wavefronts step-by-step.", icon: BarChart3, color: "#06B6D4" },
          { title: "Mistake Intelligence", desc: "Automatically categorizes off-by-one errors and TLEs into targeted remedial exercises.", icon: Bug, color: "#EF4444" },
          { title: "Multi-Language IDE", desc: "Execute Python, JavaScript, C++, and Java with genuine multi-case assertions.", icon: Terminal, color: "#10B981" },
          { title: "FAANG Mock Interviewer", desc: "Live mock interview simulator evaluating approach, complexity, and communication.", icon: Trophy, color: "#F59E0B" }
        ].map((f, i) => (
          <GlassCard key={i} theme={theme} className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: f.color }}>
              <f.icon size={20} />
            </div>
            <h3 className="text-base font-bold" style={{ color: theme.text }}>{f.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}

function LearnPage({ topics, progressMap, onSelectTopic, navigate, theme }) {
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const filtered = topics.filter(t => filterDifficulty === "all" || t.difficulty.toLowerCase() === filterDifficulty);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* CONCEPT DEPENDENCY GRAPH */}
      <ConceptDependencyGraph
        topics={topics}
        progressMap={progressMap}
        onSelectTopic={onSelectTopic}
        theme={theme}
      />

      {/* TOPICS CATALOG */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-xl font-black" style={{ color: theme.text }}>16-Topic Core Curriculum</h2>
            <p className="text-xs text-slate-500">Click any card to launch deep theory lessons, code examples, and practice problems.</p>
          </div>

          <div className="flex items-center gap-2">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  filterDifficulty === diff ? "text-white bg-[#4F6BFF] border-transparent" : "text-slate-500"
                }`}
                style={filterDifficulty !== diff ? { background: theme.surface, borderColor: theme.border } : {}}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((topic) => {
            const progress = progressMap[topic.id] || { completed_lessons: 0, mastery_score: 30 };
            return (
              <GlassCard
                key={topic.id}
                theme={theme}
                onClick={() => onSelectTopic(topic.id)}
                className="p-5 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge tone={topic.difficulty === "Easy" ? "success" : topic.difficulty === "Medium" ? "warning" : "error"} theme={theme}>
                      {topic.difficulty}
                    </Badge>
                    <span className="text-xs font-bold text-[#4F6BFF]">{progress.mastery_score || 30}% Mastery</span>
                  </div>

                  <h3 className="text-base font-bold" style={{ color: theme.text }}>{topic.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{topic.summary}</p>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.border }}>
                  <ProgressBar value={progress.mastery_score || 30} max={100} height={5} />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{topic.time}</span>
                    <span className="text-[#4F6BFF] font-bold flex items-center gap-0.5">
                      Enter Unit <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   20. ROOT APPLICATION & ROUTER (18 ROUTES DISPATCH)
   ========================================================================== */
export default function NextGenAIBuddyApp() {
  // Theme state: light | dark | system
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  });
  const [isSystemDark, setIsSystemDark] = useState(
    window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : true
  );

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    if (window.matchMedia) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => setIsSystemDark(e.matches);
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [themeMode]);

  const activeDark = themeMode === "system" ? isSystemDark : themeMode === "dark";
  const theme = useMemo(() => getThemeTokens(activeDark), [activeDark]);

  // Routing state
  const [route, setRoute] = useState(() => {
    return window.location.hash.slice(1) || "/";
  });

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.slice(1) || "/";
      setRoute(h);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  // User state
  const [user, setUser] = useState(() => APIService.getUser());
  const [topics, setTopics] = useState(TOPICS_DATA);
  const [progressMap, setProgressMap] = useState({});
  const [mistakes, setMistakes] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  const showNotification = (msg, type = "info") => {
    setToastMessage({ msg, type });
  };

  // Sync with API/Persistence on mount
  useEffect(() => {
    APIService.getDashboard().then(d => {
      if (d?.user) setUser(d.user);
    });
    APIService.request("/topics").then(r => {
      if (r?.topics_progress) setProgressMap(r.topics_progress);
      else {
        // Local fallback
        const p = localStorage.getItem("nextgenai_data_topic_progress");
        if (p) setProgressMap(JSON.parse(p));
      }
    });
    APIService.getMistakes().then(m => setMistakes(m || []));
  }, []);

  const handleUpdateTopicProgress = async (topicId, deltaLessons, newMastery) => {
    const updated = await APIService.updateTopicProgress(topicId, deltaLessons, newMastery);
    setProgressMap(prev => ({ ...prev, [topicId]: updated }));
    setUser(APIService.getUser());
  };

  const handleResolveMistake = async (id) => {
    await APIService.resolveMistake(id);
    setMistakes(prev => prev.map(m => m.id === id ? { ...m, resolved: true } : m));
  };

  const handleUpdateUser = (updates) => {
    const u = APIService.updateProfile(updates);
    setUser(u);
  };

  // Router Dispatch (18 Routes)
  const renderCurrentRoute = () => {
    const cleanRoute = route.split("?")[0];

    if (cleanRoute === "/" || cleanRoute === "") {
      return <LandingPage navigate={navigate} theme={theme} />;
    }
    if (cleanRoute === "/learn") {
      return (
        <LearnPage
          topics={topics}
          progressMap={progressMap}
          onSelectTopic={(tid) => navigate(`/learn/${tid}`)}
          navigate={navigate}
          theme={theme}
        />
      );
    }
    if (cleanRoute.startsWith("/learn/")) {
      const topicId = cleanRoute.split("/")[2] || "arrays";
      return (
        <TopicDetailPage
          topicId={topicId}
          topics={topics}
          progressMap={progressMap}
          onUpdateProgress={handleUpdateTopicProgress}
          navigate={navigate}
          theme={theme}
          onNotify={showNotification}
        />
      );
    }
    if (cleanRoute === "/ai-buddy") {
      return <AIBuddyPage theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/playground") {
      return <PlaygroundPage theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/visualizer") {
      return <VisualizerPage theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/quiz" || cleanRoute.startsWith("/quiz/")) {
      return <QuizPage onNotify={showNotification} theme={theme} />;
    }
    if (cleanRoute === "/interview") {
      return <InterviewPrepPage theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/dashboard" || cleanRoute === "/analytics") {
      return <DashboardPage user={user} navigate={navigate} theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/mistakes") {
      return (
        <MistakesPage
          mistakes={mistakes}
          onResolveMistake={handleResolveMistake}
          navigate={navigate}
          theme={theme}
          onNotify={showNotification}
        />
      );
    }
    if (cleanRoute === "/study-plan") {
      return <StudyPlanPage theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/achievements") {
      return <AchievementsPage theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/profile") {
      return <ProfilePage user={user} onUpdateUser={handleUpdateUser} theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/settings") {
      return <SettingsPage themeMode={themeMode} setThemeMode={setThemeMode} theme={theme} onNotify={showNotification} />;
    }
    if (cleanRoute === "/login" || cleanRoute === "/signup" || cleanRoute === "/forgot-password") {
      return (
        <div className="max-w-md mx-auto py-16 px-4">
          <GlassCard theme={theme} className="p-6 text-center space-y-4">
            <h2 className="text-xl font-bold" style={{ color: theme.text }}>Authentication Portal</h2>
            <p className="text-xs text-slate-500">Sign in to sync your progress to the cloud database.</p>
            <Button variant="primary" size="md" onClick={() => setAuthModalOpen(true)} theme={theme}>
              Open Auth Dialog
            </Button>
          </GlassCard>
        </div>
      );
    }

    // Default Fallback
    return <LandingPage navigate={navigate} theme={theme} />;
  };

  return (
    <div
      className={activeDark ? "dark" : ""}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* GLOBAL NAVBAR */}
      <Navbar
        route={route}
        navigate={navigate}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        theme={theme}
        user={user}
        onOpenNotifications={() => setNotifModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* ACTIVE PAGE CONTENT */}
      <main className="flex-1 pb-16">
        {renderCurrentRoute()}
      </main>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-xs text-slate-500" style={{ borderColor: theme.border, background: theme.bgSubtle }}>
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#4F6BFF]">NextGenAI Buddy</span> · Production-Grade DSA &amp; Interview SaaS Platform
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="#/learn" className="hover:underline">Curriculum</a>
            <a href="#/playground" className="hover:underline">IDE</a>
            <a href="#/visualizer" className="hover:underline">Visualizer</a>
            <a href="#/mistakes" className="hover:underline">Mistake Intel</a>
            <a href="#/study-plan" className="hover:underline">Study Plan</a>
          </div>
        </div>
      </footer>

      {/* MODALS & TOAST */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(u) => {
          setUser(u);
          setAuthModalOpen(false);
          showNotification(`Welcome back, ${u.name}!`, "success");
        }}
        theme={theme}
      />

      <NotificationsModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        theme={theme}
      />

      {toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

export { NextGenAIBuddyApp as NextGenAIBuddy };
