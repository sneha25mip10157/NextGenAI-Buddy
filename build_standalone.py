#!/usr/bin/env python3
"""
Build tool: Bundles modular src/ code into standalone.html
for zero-install, instant browser execution via Launch_Website.command
and static HTTP hosting.
"""

import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")

def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def clean_exports(code):
    # Replace 'export const', 'export function', 'export default function', etc.
    code = re.sub(r'export\s+(const|let|var|function|class)\s+', r'\1 ', code)
    # Remove 'export default ...'
    code = re.sub(r'export\s+default\s+[^;]+;', '', code)
    # Remove 'export { ... }'
    code = re.sub(r'export\s*\{[^}]*\};?', '', code)
    return code

def main():
    print("Bundling NextGenAI Buddy into standalone.html...")

    tokens_code = clean_exports(read_file(os.path.join(SRC, "theme", "tokens.js")))
    dsa_code = clean_exports(read_file(os.path.join(SRC, "data", "dsaData.js")))
    engines_code = clean_exports(read_file(os.path.join(SRC, "visualizer", "algoEngines.js")))
    api_code = clean_exports(read_file(os.path.join(SRC, "services", "apiService.js")))

    buddy_raw = read_file(os.path.join(SRC, "NextGenAIBuddy.jsx"))

    # Strip local module imports from NextGenAIBuddy.jsx since they are now inlined
    buddy_code = re.sub(r'import\s*\{[^}]*\}\s*from\s*["\']\./data/dsaData\.js["\'];?', '', buddy_raw)
    buddy_code = re.sub(r'import\s*\{[^}]*\}\s*from\s*["\']\./visualizer/algoEngines\.js["\'];?', '', buddy_code)
    buddy_code = re.sub(r'import\s*\{[^}]*\}\s*from\s*["\']\./services/apiService\.js["\'];?', '', buddy_code)
    buddy_code = re.sub(r'export\s*\{\s*NextGenAIBuddyApp\s+as\s+NextGenAIBuddy\s*\};?', '', buddy_code)

    # HTML Shell with modern CDN importmap, Tailwind, and Babel Standalone
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NextGenAI Buddy — AI-Powered DSA Learning &amp; Interview Preparation Platform</title>
  <link rel="icon" type="image/svg+xml" href="public/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          fontFamily: {{
            sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }},
          colors: {{
            brand: {{
              50: '#EEF2FF',
              500: '#4F6BFF',
              600: '#3B57E8',
              700: '#2A44D1',
            }}
          }}
        }}
      }}
    }}
  </script>
  <script type="importmap">
  {{
    "imports": {{
      "react": "https://esm.sh/react@18.2.0",
      "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime",
      "react-dom": "https://esm.sh/react-dom@18.2.0",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
      "lucide-react": "https://esm.sh/lucide-react@0.344.0?external=react",
      "recharts": "https://esm.sh/recharts@2.12.0?external=react,react-dom"
    }}
  }}
  </script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    html, body {{
      width: 100%; min-height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      scroll-behavior: smooth;
    }}
    code, pre {{ font-family: 'JetBrains Mono', monospace; }}
    ::-webkit-scrollbar {{ width: 8px; height: 8px; }}
    ::-webkit-scrollbar-track {{ background: transparent; }}
    ::-webkit-scrollbar-thumb {{ background: rgba(148,163,184,0.25); border-radius: 4px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: rgba(148,163,184,0.45); }}
  </style>
</head>
<body style="margin: 0;">
  <div id="root">
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0B0F19; color: #F8FAFC; font-family: 'Inter', sans-serif;">
      <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #4F6BFF, #6D63D9); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 0 35px rgba(79,107,255,0.4);">
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

  <script type="text/babel" data-type="module">
// Inlined Domain Tokens
{tokens_code}

// Inlined Domain Data
{dsa_code}

// Inlined Visualizer Engines
{engines_code}

// Inlined Universal API & Local Persistence Service
{api_code}

// Application Component
{buddy_code}

// React 18 Application Mount
import ReactDOM from 'react-dom/client';
const rootElement = document.getElementById('root');
if (rootElement) {{
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <NextGenAIBuddyApp />
    </React.StrictMode>
  );
}}
  </script>
</body>
</html>
"""

    out_path = os.path.join(ROOT, "standalone.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html_template)

    print(f"✓ Successfully generated {out_path} ({len(html_template)} bytes)")

if __name__ == "__main__":
    main()
