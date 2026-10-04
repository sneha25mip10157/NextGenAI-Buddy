#!/usr/bin/env python3
"""
NextGenAI Buddy — Standalone HTML Builder
Generates a self-contained standalone.html using:
- React + ReactDOM loaded as UMD globals (via CDN)
- Babel Standalone for in-browser JSX transformation
- No ES module import statements inside the Babel script
- All source code fully inlined
"""

import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "standalone.html")

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def remove_all_imports_exports(code):
    """
    Remove all ES module import/export statements from JS/JSX code.
    Handles both single-line and multi-line import blocks.
    """
    # Remove import ... from '...'; across single or multiple lines
    code = re.sub(r'import\s+[^;]*?from\s*["\'][^"\']*["\'];?\s*', '', code, flags=re.DOTALL)
    # Remove bare import "..." or import '...';
    code = re.sub(r'import\s+["\'][^"\']*["\'];?\s*', '', code)
    # Remove export statements
    code = re.sub(r'^export\s+default\s+', '', code, flags=re.MULTILINE)
    code = re.sub(r'^export\s+\{[^}]*\};\s*$', '', code, flags=re.MULTILINE)
    code = re.sub(r'^export\s+(const|let|var|function|class|async)\s+', r'\1 ', code, flags=re.MULTILINE)
    return code

# Read and clean source files
tokens_code = remove_all_imports_exports(read(os.path.join(SRC, "theme", "tokens.js")))
dsa_data_code = remove_all_imports_exports(read(os.path.join(SRC, "data", "dsaData.js")))
algo_engines_code = remove_all_imports_exports(read(os.path.join(SRC, "visualizer", "algoEngines.js")))
api_service_code = remove_all_imports_exports(read(os.path.join(SRC, "services", "apiService.js")))

# Read the main JSX — strip imports manually by finding where real code starts
main_jsx_raw = read(os.path.join(SRC, "NextGenAIBuddy.jsx"))
# Strip all import blocks from top (lines 1–109 are all imports/comments before real code)
main_jsx = remove_all_imports_exports(main_jsx_raw)
# Also strip export at bottom
main_jsx = re.sub(r'^export\s+\{[^}]*\};\s*$', '', main_jsx, flags=re.MULTILINE)

# Verify no imports remain
remaining_imports = re.findall(r'^import\s+', main_jsx, re.MULTILINE)
if remaining_imports:
    print(f"⚠️  Warning: {len(remaining_imports)} import statements still present in main_jsx")
    for m in re.finditer(r'^import\s+.*', main_jsx, re.MULTILINE):
        print(f"   Line: {m.group()[:80]}")

# The main component is named NextGenAIBuddyApp — verify it's there
if 'function NextGenAIBuddyApp' in main_jsx:
    print("✅ Found NextGenAIBuddyApp component")
else:
    print("❌ ERROR: NextGenAIBuddyApp not found in processed JSX!")

# Build the final HTML
html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NextGenAI Buddy — AI-Powered DSA Learning &amp; Interview Preparation Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              50: '#EEF2FF',
              500: '#4F6BFF',
              600: '#3B57E8',
              700: '#2A44D1',
            }
          }
        }
      }
    }
  </script>
  <!-- React 18 UMD (must load before Babel script) -->
  <script src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
  <!-- Recharts UMD -->
  <script src="https://unpkg.com/recharts@2.12.0/umd/Recharts.js"></script>
  <!-- Babel Standalone for JSX transpilation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; min-height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      scroll-behavior: smooth;
    }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.25); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.45); }
    .loading-screen {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #0B0F19; color: #F8FAFC;
      font-family: 'Inter', sans-serif;
    }
    .loading-logo {
      width: 56px; height: 56px; border-radius: 16px;
      background: linear-gradient(135deg, #4F6BFF, #6D63D9);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px; box-shadow: 0 0 35px rgba(79,107,255,0.4);
      animation: logoPulse 2s ease-in-out infinite;
    }
    @keyframes logoPulse {
      0%, 100% { box-shadow: 0 0 35px rgba(79,107,255,0.4); }
      50% { box-shadow: 0 0 55px rgba(79,107,255,0.8); }
    }
  </style>
</head>
<body style="margin: 0;">
  <div id="root">
    <div class="loading-screen">
      <div class="loading-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
          <path d="M12 12L2.5 7.5"></path>
          <path d="M12 12v9.5"></path>
        </svg>
      </div>
      <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em;">NextGenAI Buddy</h2>
      <p style="font-size: 0.85rem; color: #94A3B8;">Initializing AI-Powered DSA Learning Environment...</p>
    </div>
  </div>

  <script type="text/babel">
/* ============================================================
   UMD GLOBALS — React, ReactDOM, Recharts are window globals
   ============================================================ */
const { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext, memo } = React;
const {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} = window.Recharts || {};

/* ============================================================
   INLINE SVG ICON SYSTEM (replaces lucide-react package)
   ============================================================ */
function SvgIcon({ d, size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, fill = 'none', ...rest }) {
  if (!d) return <span className={className} style={{ display: 'inline-block', width: size, height: size, ...style }} />;
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      {...rest}
    >
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const ICONS = {
  Brain: ['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z', 'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z'],
  Code2: ['M8 18L2 12l6-6', 'M16 18l6-6-6-6'],
  MessageSquare: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  Play: ['M5 3l14 9-14 9V3z'],
  Pause: ['M6 4h4v16H6z', 'M14 4h4v16h-4z'],
  RotateCcw: ['M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8', 'M3 3v5h5'],
  SkipForward: ['M5 4l10 8-10 8V4z', 'M19 5v14'],
  SkipBack: ['M19 20L9 12l10-8v16z', 'M5 19V5'],
  Home: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  BookOpen: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
  Terminal: ['M4 17l6-6-6-6', 'M12 19h8'],
  BarChart3: ['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  GraduationCap: ['M22 10v6', 'M2 10l10-5 10 5-10 5z', 'M6 12v5c3 3 9 3 12 0v-5'],
  LayoutDashboard: ['M3 3h7v9H3z', 'M14 3h7v5h-7z', 'M14 12h7v9h-7z', 'M3 16h7v5H3z'],
  Bell: ['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0'],
  Sun: ['M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M12 2v2', 'M12 20v2', 'M4.93 4.93l1.41 1.41', 'M17.66 17.66l1.41 1.41', 'M2 12h2', 'M20 12h2', 'M6.34 17.66l-1.41 1.41', 'M19.07 4.93l-1.41 1.41'],
  Moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  Monitor: ['M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z', 'M8 21h8', 'M12 17v4'],
  Menu: ['M3 12h18', 'M3 6h18', 'M3 18h18'],
  X: ['M18 6 6 18', 'M6 6l12 12'],
  Send: ['M22 2 11 13', 'M22 2l-7 20-4-9-9-4 20-7z'],
  Copy: ['M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
  ThumbsUp: ['M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z', 'M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'],
  ThumbsDown: ['M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z', 'M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17'],
  RefreshCw: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5'],
  Sparkles: ['m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z', 'M5 3v4', 'M19 17v4', 'M3 5h4', 'M17 19h4'],
  Flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z'],
  Trophy: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', 'M18 2H6v7a6 6 0 0 0 12 0V2Z'],
  Zap: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
  Target: ['M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0', 'M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0', 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0'],
  CheckCircle2: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9 12l2 2 4-4'],
  Circle: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0'],
  ChevronRight: ['M9 18l6-6-6-6'],
  ChevronDown: ['M6 9l6 6 6-6'],
  ChevronLeft: ['M15 18l-6-6 6-6'],
  ChevronUp: ['M18 15l-6-6-6 6'],
  Search: ['M21 21l-4.35-4.35', 'M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0Z'],
  Clock: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 7v5l3 3'],
  Award: ['M12 15A6 6 0 1 0 12 3a6 6 0 0 0 0 12z', 'M8.21 13.89 7 23l5-3 5 3-1.21-9.12'],
  Users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  TrendingUp: ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
  TrendingDown: ['M22 17l-8.5-8.5-5 5L2 7', 'M16 17h6v-6'],
  Building2: ['M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z', 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2', 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2', 'M10 6h4', 'M10 10h4', 'M10 14h4', 'M10 18h4'],
  Mail: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
  Github: ['M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', 'M9 18c-4.51 2-5-2-7-2'],
  Linkedin: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z', 'M2 9h4v12H2z', 'M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  Wand2: ['M15 4V2', 'M15 16v-2', 'M8 9h2', 'M20 9h2', 'M17.8 11.8 19 13', 'M15 9h0', 'M17.8 6.2 19 5', 'M3 21l9-9', 'M12.2 6.2 11 5'],
  Bug: ['M8 2l1.88 1.88', 'M14.12 3.88 16 2', 'M9 7.13v-1a3.003 3.003 0 1 1 6 0v1', 'M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z', 'M12 20v2', 'M6 13H2', 'M22 13h-4', 'M6 17H2', 'M22 17h-4'],
  Gauge: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M4.22 10.22a8 8 0 0 1 15.56 0', 'M12 3V1'],
  Lightbulb: ['M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', 'M9 18h6', 'M10 22h4'],
  ArrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  ArrowLeft: ['M19 12H5', 'M12 19l-7-7 7-7'],
  ArrowUpRight: ['M7 17 17 7', 'M7 7h10v10'],
  Plus: ['M12 5v14', 'M5 12h14'],
  Minus: ['M5 12h14'],
  User: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  LogOut: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  Star: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'],
  Layers: ['M12 2 2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  GitBranch: ['M6 3v12', 'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 9a9 9 0 0 1-9 9'],
  Hash: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
  ListTree: ['M21 12h-8', 'M21 6H8', 'M21 18h-8', 'M3 6v4c0 1.1.9 2 2 2h3', 'M3 10v6c0 1.1.9 2 2 2h3'],
  Boxes: ['M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z', 'M7 16.5l-4.74-2.85', 'M7 16.5l5-3', 'M7 16.5V21', 'M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z', 'M17 16.5l-5-3', 'M17 16.5l4.74-2.85', 'M17 16.5V21', 'M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z', 'M12 8 7.26 5.15', 'M12 8l4.74-2.85', 'M12 13.5V8'],
  Check: ['M20 6 9 17l-5-5'],
  AlertCircle: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 8v4', 'M12 16h.01'],
  AlertTriangle: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  HelpCircle: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01'],
  Sliders: ['M4 21v-7', 'M4 10V3', 'M12 21V12', 'M12 6V3', 'M20 21v-4', 'M20 13V3', 'M1 14h6', 'M9 6h6', 'M17 17h6'],
  Volume2: ['M11 5 6 9H2v6h4l5 4V5z', 'M19.07 4.93a10 10 0 0 1 0 14.14', 'M15.54 8.46a5 5 0 0 1 0 7.07'],
  ShieldCheck: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'M9 12l2 2 4-4'],
  Filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
  Share2: ['M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M8.59 13.51l6.83 3.98', 'M15.41 6.51l-6.82 3.98'],
  Bookmark: ['M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'],
  Compass: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
  Eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  EyeOff: ['M9.88 9.88a3 3 0 1 0 4.24 4.24', 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68', 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61', 'M2 2l20 20'],
  PlayCircle: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M10 8l6 4-6 4V8z'],
  Calendar: ['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  FileText: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  CheckSquare: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  Square: ['M3 3h18v18H3z'],
  CornerDownRight: ['M15 10l5 5-5 5', 'M4 4v7a4 4 0 0 0 4 4h12'],
  Settings: ['M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  Lock: ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  Info: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 16v-4', 'M12 8h.01'],
  CheckCircle: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'M22 4 12 14.01l-3-3'],
  XCircle: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M15 9l-6 6', 'M9 9l6 6'],
  Activity: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  Database: ['M12 2a9 3 0 0 1 9 3c0 1.66-4.03 3-9 3s-9-1.34-9-3a9 3 0 0 1 9-3z', 'M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5', 'M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3'],
  MapPin: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  Flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'],
  Globe: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M3.6 9h16.8', 'M3.6 15h16.8', 'M11.5 3a17 17 0 0 0 0 18', 'M12.5 3a17 17 0 0 1 0 18'],
  Network: ['M9 2H4a2 2 0 0 0-2 2v4', 'M20 2h-5a2 2 0 0 1 2 2v4', 'M9 22H4a2 2 0 0 1-2-2v-4', 'M20 22h-5a2 2 0 0 0 2-2v-4', 'M7 12h10', 'M12 7v10'],
  Cpu: ['M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z', 'M10 8h4v8h-4z', 'M8 2v2', 'M16 2v2', 'M8 20v2', 'M16 20v2', 'M2 8h2', 'M2 16h2', 'M20 8h2', 'M20 16h2'],
  BookMarked: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20l-7-4-7 4V2a.5.5 0 0 1 .5-.5z', 'M12 7v4', 'M10 9h4'],
  MessageCircle: ['M7.9 20A9 9 0 1 0 4 16.1L2 22z'],
  Map: ['M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z', 'M8 2v16', 'M16 6v16'],
  Sigma: ['M18 7V4H6l6 8-6 8h12v-3'],
  Recycle: ['M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5', 'M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12', 'M14 16l3 3-3 3', 'M8.293 13.596 7.196 9.5 3.1 3.5', 'M9.344 5.811 10.5 3.5 12 5l1.5-1.5 1.1 2.311', 'M20.9 3.5l-4.096 6'],
};

// Icon component factory
function makeIcon(name) {
  return function LucideIconComponent(props) {
    const { size = 20, color = 'currentColor', strokeWidth = 2, className = '', style = {}, ...rest } = props;
    const paths = ICONS[name];
    if (!paths) return null;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        {...rest}
      >
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    );
  };
}

// Export all icons matching lucide-react API
const Brain = makeIcon('Brain');
const Code2 = makeIcon('Code2');
const MessageSquare = makeIcon('MessageSquare');
const Play = makeIcon('Play');
const Pause = makeIcon('Pause');
const RotateCcw = makeIcon('RotateCcw');
const SkipForward = makeIcon('SkipForward');
const SkipBack = makeIcon('SkipBack');
const Home = makeIcon('Home');
const BookOpen = makeIcon('BookOpen');
const Terminal = makeIcon('Terminal');
const BarChart3 = makeIcon('BarChart3');
const GraduationCap = makeIcon('GraduationCap');
const LayoutDashboard = makeIcon('LayoutDashboard');
const Bell = makeIcon('Bell');
const Sun = makeIcon('Sun');
const Moon = makeIcon('Moon');
const Monitor = makeIcon('Monitor');
const Menu = makeIcon('Menu');
const X = makeIcon('X');
const Send = makeIcon('Send');
const Copy = makeIcon('Copy');
const ThumbsUp = makeIcon('ThumbsUp');
const ThumbsDown = makeIcon('ThumbsDown');
const RefreshCw = makeIcon('RefreshCw');
const Sparkles = makeIcon('Sparkles');
const Flame = makeIcon('Flame');
const Trophy = makeIcon('Trophy');
const Zap = makeIcon('Zap');
const Target = makeIcon('Target');
const CheckCircle2 = makeIcon('CheckCircle2');
const Circle = makeIcon('Circle');
const ChevronRight = makeIcon('ChevronRight');
const ChevronDown = makeIcon('ChevronDown');
const ChevronLeft = makeIcon('ChevronLeft');
const ChevronUp = makeIcon('ChevronUp');
const Search = makeIcon('Search');
const Clock = makeIcon('Clock');
const Award = makeIcon('Award');
const Users = makeIcon('Users');
const TrendingUp = makeIcon('TrendingUp');
const TrendingDown = makeIcon('TrendingDown');
const Building2 = makeIcon('Building2');
const Mail = makeIcon('Mail');
const Github = makeIcon('Github');
const Linkedin = makeIcon('Linkedin');
const Wand2 = makeIcon('Wand2');
const Bug = makeIcon('Bug');
const Gauge = makeIcon('Gauge');
const Lightbulb = makeIcon('Lightbulb');
const ArrowRight = makeIcon('ArrowRight');
const ArrowLeft = makeIcon('ArrowLeft');
const ArrowUpRight = makeIcon('ArrowUpRight');
const Plus = makeIcon('Plus');
const Minus = makeIcon('Minus');
const User = makeIcon('User');
const LogOut = makeIcon('LogOut');
const Star = makeIcon('Star');
const Layers = makeIcon('Layers');
const GitBranch = makeIcon('GitBranch');
const Hash = makeIcon('Hash');
const ListTree = makeIcon('ListTree');
const Boxes = makeIcon('Boxes');
const Check = makeIcon('Check');
const AlertCircle = makeIcon('AlertCircle');
const AlertTriangle = makeIcon('AlertTriangle');
const HelpCircle = makeIcon('HelpCircle');
const Sliders = makeIcon('Sliders');
const Volume2 = makeIcon('Volume2');
const ShieldCheck = makeIcon('ShieldCheck');
const Filter = makeIcon('Filter');
const Share2 = makeIcon('Share2');
const Bookmark = makeIcon('Bookmark');
const Compass = makeIcon('Compass');
const Eye = makeIcon('Eye');
const EyeOff = makeIcon('EyeOff');
const PlayCircle = makeIcon('PlayCircle');
const Calendar = makeIcon('Calendar');
const FileText = makeIcon('FileText');
const CheckSquare = makeIcon('CheckSquare');
const Square = makeIcon('Square');
const CornerDownRight = makeIcon('CornerDownRight');
const Settings = makeIcon('Settings');
const SettingsIcon = makeIcon('Settings');
const QuestionIcon = makeIcon('HelpCircle');
const Lock = makeIcon('Lock');
const Info = makeIcon('Info');
const CheckCircle = makeIcon('CheckCircle');
const XCircle = makeIcon('XCircle');
const Activity = makeIcon('Activity');
const Database = makeIcon('Database');
const MapPin = makeIcon('MapPin');
const Flag = makeIcon('Flag');
const Globe = makeIcon('Globe');
const Network = makeIcon('Network');
const Cpu = makeIcon('Cpu');
const BookMarked = makeIcon('BookMarked');
const MessageCircle = makeIcon('MessageCircle');
const Map = makeIcon('Map');
const Sigma = makeIcon('Sigma');
const Recycle = makeIcon('Recycle');

/* ============================================================
   RECHARTS COMPONENT ALIASES (some may not be in the UMD bundle)
   ============================================================ */
const _R = window.Recharts || {};
const LineChartComp = _R.LineChart || function() { return null; };
const BarChartComp = _R.BarChart || function() { return null; };
const AreaChartComp = _R.AreaChart || function() { return null; };
const PieChartComp = _R.PieChart || function() { return null; };
const RadarChartComp = _R.RadarChart || function() { return null; };

"""

# Add the inlined module code
html += f"""
/* ============================================================
   INLINED: Theme Tokens
   ============================================================ */
{tokens_code}

/* ============================================================
   INLINED: DSA Domain Data
   ============================================================ */
{dsa_data_code}

/* ============================================================
   INLINED: Algorithm Visualizer Engines
   ============================================================ */
{algo_engines_code}

/* ============================================================
   INLINED: API Service (REST + localStorage fallback)
   ============================================================ */
{api_service_code}

/* ============================================================
   MAIN APPLICATION COMPONENT
   ============================================================ */
{main_jsx}

/* ============================================================
   REACT 18 MOUNT
   ============================================================ */
const _rootEl = document.getElementById('root');
if (_rootEl) {{
  const _root = ReactDOM.createRoot(_rootEl);
  _root.render(
    <React.StrictMode>
      <NextGenAIBuddyApp />
    </React.StrictMode>
  );
}}
  </script>
</body>
</html>"""

html_content = html

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html_content)

size_kb = os.path.getsize(OUT) / 1024
lines = html_content.count('\n')
print(f"✅ standalone.html built successfully!")
print(f"   Output: {OUT}")
print(f"   Size: {size_kb:.1f} KB ({lines:,} lines)")
print(f"   Approach: UMD globals — React/ReactDOM/Recharts loaded as globals")
print(f"   All JSX imports stripped. No ES module imports in Babel block.")

# Verify no imports remain
remaining = re.findall(r'^import\s+', html_content, re.MULTILINE)
if remaining:
    print(f"⚠️  {len(remaining)} import statements still found!")
else:
    print(f"✅ Zero import statements — Babel Standalone compatible!")
