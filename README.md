# 🚀 NextGenAI Buddy — Complete AI-Powered DSA Platform

> **"Learn Smarter. Code Better. Build the Future."**  
> A production-grade, deployment-ready Data Structures & Algorithms (DSA) learning and interview preparation platform featuring an AI Learning Twin, 8-algorithm visualizers, genuine Mistake Intelligence, real multi-case IDE execution, and academic citations.

---

## 🌟 Quick Start Options

### Option 1: 1-Click Launch (Zero Configuration Required)
Run the full-stack platform immediately on macOS with SQLite persistence and the Python REST API:
1. Double-click **`Launch_Website.command`** in Finder.  
   *(Detects an open port, launches `server.py`, and opens your default browser).*
2. **Or run via Terminal**:
   ```bash
   cd /Users/snehamehta/.gemini/antigravity/scratch/nextgenai-buddy
   python3 server.py
   ```
   Then open `http://localhost:8000` in Chrome, Safari, or Edge.

---

### Option 2: Standalone Static Mode
If running in an environment without backend access:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/standalone.html`. The frontend will automatically detect the absence of the backend server and seamlessly persist all progress, mistakes, and achievements to browser `localStorage` using an identical database schema!

---

## 🧠 Core Functional Capabilities

### 1. Dual-Mode Architecture & Real Persistence
- **Full-Stack REST Backend**: High-performance Python standard library server (`server.py`) with SQLite database (`nextgenai.db`).
- **Synchronized Fallback**: If offline or hosted statically on CDN, the frontend seamlessly syncs to browser `localStorage` with identical schema and models.
- **Real Progress Engine**: Tracks lessons started/completed, topic mastery scores, code submissions, quiz accuracy, streaks, and XP.

### 2. AI Learning Twin
- Analyzes user activity dynamically to calculate:
  - Strong topics (mastery $\ge 75\%$)
  - Weak topics (mastery $< 50\%$)
  - Frequently repeated algorithmic slips
  - Confidence rating and learner archetype (e.g. *Adaptive Analytical Problem Solver*)
  - Concrete next-step recommendations derived from data, not hardcoded.

### 3. Mistake Intelligence Hub (`/mistakes`)
- Automatically captures failing code submissions and wrong quiz answers.
- Classifies bugs into 6 distinct root causes:
  - *Off-by-One Boundary Invariants*
  - *Null / Uninitialized Pointer Dereference*
  - *Edge Case / Single-Element Omission*
  - *Time Limit Exceeded (Suboptimal Asymptotics)*
  - *Logic / Inverted Comparison Conditions*
  - *Syntax / Empty Submission Errors*
- Displays faulty snippets, AI remedial explanations, and targeted drills.
- Allows students to mark mistakes as resolved once mastered.

### 4. Interactive 8-Data Structure Visualizer (`/visualizer`)
Interactive step-by-step state animations with Play, Pause, Step Forward, Step Back, Reset, Speed Slider, and live natural language "What is happening?" explanations:
1. **Sorting**: Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort (bars with compare, swap, and finalized colors).
2. **Binary Search**: Low, Mid, and High pointers with dynamic interval narrowing.
3. **Stack**: Visual LIFO container with Push, Pop, Peek, top pointer, and overflow warnings.
4. **Queue**: Circular ring buffer & linear FIFO mode with Front and Rear pointer tracking.
5. **Linked List**: Visual node blocks with pointer arrows and animated in-place reversal.
6. **Binary Search Tree (BST)**: Hierarchical node tree with insertions and in-order traversal sorting.
7. **Graph BFS**: Node network with queue state and visited wavefront traversal.
8. **Graph DFS**: Node network with recursive call stack and backtracking paths.

### 5. Coding Playground & Multi-Case IDE (`/playground`)
- Multi-language support: **Python 3**, **JavaScript**, **C++ 20**, and **Java 17**.
- Multi-case test runner verifying actual outputs against expected assertions.
- Asymptotic Complexity Audit inspecting Time and Auxiliary Space bounds.
- Socratic AI Hints guiding students through problem invariants.
- Failing assertions automatically log to the **Mistake Intelligence Engine**.

### 6. Evaluated Assessment Quiz Engine (`/quiz`)
- Configurable quizzes by topic, difficulty, and question count.
- Countdown timer, score calculation, explanations, and instant XP awards.
- Automatically records incorrect choices into the learner's mistake profile.

### 7. FAANG Mock Interview Arena (`/interview`)
- Company tracks: Google, Meta, Amazon, Microsoft, Apple, Netflix, Uber.
- Mock scenario simulator with candidate response input.
- Structured AI Interviewer Rubric evaluating:
  - *Algorithmic Approach*
  - *Correctness & Invariant Preservation*
  - *Complexity Analysis (Big-O)*
  - *Edge Case Management*
  - *Technical Communication*
  - *Code Quality & Cleanliness*

### 8. Concept Dependency Graph (`/learn`)
- Interactive directed acyclic graph (DAG) mapping prerequisite paths:
  `Arrays -> Strings -> Two Pointers -> Sliding Window -> Stacks -> Trees -> Graphs -> DP`
- Nodes dynamically colored by the user's real mastery percentage.
- Click any node to navigate directly to lessons or practice.

### 9. Exact 3-Mode Theme System
- ☀ **Light Mode**: Strictly adheres to required design tokens (`#F8F6F1` Background, `#F2EFE8` Secondary, `#FFFDF8` Cards, `#FFFFFF` White, `#4F6BFF` Primary, `#6D63D9` Indigo, `#171923` Text, `#626775` Secondary Text, `#E6E1D8` Border).
- 🌙 **Dark Mode**: Carefully balanced dark palette (`#0B0F19` Background, `#1A243B` Cards, `#F8FAFC` Text).
- 🖥 **System Mode**: Detects and listens to OS `prefers-color-scheme` dynamically.
- Zero flash on page reload with persistence in `localStorage`.

---

## 🗺️ Functional Routes (All 18 Supported)

| Route | Description |
|---|---|
| `/` | Landing page showcasing hero, value propositions, and quick launch |
| `/learn` | Curriculum hub with interactive Concept Dependency Graph and topic cards |
| `/learn/:topic` | In-depth topic theory, memory layouts, code examples, and lesson completion |
| `/ai-buddy` | ChatGPT-style pedagogical chat with academic citations and action pills |
| `/playground` | Coding IDE with multi-language runner, assertions, and complexity audits |
| `/visualizer` | 8-structure algorithm visualizer with step execution and reasoning banner |
| `/quiz` | Evaluated quiz hub with topic selections |
| `/quiz/:id` | Active quiz runner with countdown timer and score breakdown |
| `/interview` | FAANG company tracks and AI mock interviewer rubric |
| `/dashboard` | Command center with streak, XP, weekly activity chart, and today's plan |
| `/analytics` | Detailed mastery analysis, mistake breakdown, and submission stats |
| `/mistakes` | Mistake Intelligence dashboard with filters, remediation, and resolution |
| `/study-plan` | AI Study Planner with milestone checklists and timeline tracking |
| `/achievements` | Gamified badges, XP requirements, and unlock criteria |
| `/profile` | Candidate profile, avatar, target roles, and academic bio |
| `/settings` | 3-way theme selector, daily study targets, and configuration |
| `/login` | User authentication form |
| `/signup` | New account registration |
| `/forgot-password` | Password recovery workflow |

---

## 🏗️ Architecture & Tech Stack

```text
nextgenai-buddy/
├── Launch_Website.command     # macOS 1-click double-clickable launcher
├── server.py                  # Production Python REST API, SQLite DB & SPA server
├── build_standalone.py        # Bundler script for standalone.html
├── test_server.py             # Unit tests for database & evaluation engine
├── test_api_inprocess.py      # In-process HTTP & REST handler test suite
├── test_integration.py       # Full-stack integration test harness
├── standalone.html            # Standalone zero-setup web application
├── index.html                 # Vite HTML entry point
├── package.json               # Modern npm dependencies
├── vite.config.js             # Vite configuration
├── nextgenai.db               # SQLite database (auto-generated)
├── .env.example               # Environment variable specification
├── .gitignore                 # Git ignore rules
├── README.md                  # Comprehensive platform documentation
├── ARCHITECTURE.md            # Deep system architecture & data models
├── API.md                     # REST API reference documentation
├── DEPLOYMENT.md              # Deployment guide for Vercel, Netlify, Docker
└── src/
    ├── main.jsx               # React 18 mount point
    ├── App.jsx                # Root application wrapper
    ├── NextGenAIBuddy.jsx     # Complete modular DSA application
    ├── index.css              # Global styles & scrollbars
    ├── theme/
    │   └── tokens.js          # Design tokens & 3-way theme system
    ├── data/
    │   └── dsaData.js         # 16 Topics, problems, quizzes, interview tracks
    ├── services/
    │   └── apiService.js      # Universal data service (REST + LocalStorage)
    └── visualizer/
        └── algoEngines.js     # 8-structure step generation engines
```

- **Frontend**: React 18, Tailwind CSS, Lucide React, Recharts, Babel Standalone.
- **Backend**: Python 3.14 Standard Library (HTTP, SQLite3, HMAC/PBKDF2, Subprocess).
- **Database**: SQLite3 (`nextgenai.db`) with 10 relational tables.
- **Security**: PBKDF2 password hashing (100,000 rounds), URL-safe signed JWT tokens, CORS headers, sandboxed code runner.

---

## 🧪 Testing & Verification

Run the automated test suites:
```bash
# 1. Test database initialization, seed data, and code runner:
python3 test_server.py

# 2. Test all REST API handlers and database mutations:
python3 test_api_inprocess.py

# 3. Build standalone.html:
python3 build_standalone.py
```

---

## 🔒 Security Best Practices
- **No plaintext secrets**: API keys and secrets are loaded via environment variables (`.env`).
- **Cryptographic password hashing**: Passwords hashed with PBKDF2-HMAC-SHA256 and unique 16-byte cryptographic salts.
- **Sandboxed execution**: User code is executed with strict execution timeouts (2 seconds) and process isolation.
- **Defensive API routing**: Strict input sanitization and parameter binding to prevent SQL injection.

---

## 📜 License
MIT License. Built for students, developers, and educators.
