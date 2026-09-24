# System Architecture & Technical Design Document

This document outlines the architectural blueprints, data models, state synchronization, and calculation engines powering **NextGenAI Buddy**.

---

## 1. System Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     Client Browser (React 18 SPA)                     │
│                                                                        │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │ Hash/Path Router      │   │ 3-Way Theme Manager                  │  │
│  │ (18 Functional Routes)│   │ (Light #F8F6F1 / Dark / System Sync) │  │
│  └───────────┬───────────┘   └──────────────────┬───────────────────┘  │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Core Application Modules                      │  │
│  │  - 8-Structure Visualizer     - Mistake Intelligence Hub         │  │
│  │  - Multi-Language Playground  - AI Learning Twin Engine          │  │
│  │  - Evaluated Quiz Engine      - Concept Dependency Graph         │  │
│  │  - FAANG Interview Arena      - AI Study Planner                 │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   Universal Data Service                         │  │
│  │  - Primary: REST API Client with JWT Authorization               │  │
│  │  - Fallback: LocalStorage Database Engine (Identical Schemas)    │  │
│  └─────────────────┬──────────────────────────────┬─────────────────┘  │
└────────────────────┼──────────────────────────────┼────────────────────┘
                     │ HTTP / JSON                  │ Local Fallback
                     ▼                              ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│  Python 3.14 Production Backend      │   │  Browser LocalStorage       │
│  (server.py)                         │   │  (Offline / Static Preview) │
│                                      │   └─────────────────────────────┘
│  - REST Router (/api/*)              │
│  - Static SPA File Serving           │
│  - Sandboxed Code Runner             │
│  - PBKDF2 Cryptographic Security     │
│  - SQLite Database (nextgenai.db)    │
└──────────────────────────────────────┘
```

---

## 2. Database Schema (SQLite: `nextgenai.db`)

The relational database consists of 10 tables:

### 1. `users`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `email` (TEXT UNIQUE NOT NULL)
- `password_hash` (TEXT NOT NULL)
- `salt` (TEXT NOT NULL)
- `name` (TEXT NOT NULL)
- `avatar` (TEXT)
- `bio` (TEXT)
- `target_role` (TEXT)
- `xp` (INTEGER DEFAULT 1240)
- `streak` (INTEGER DEFAULT 7)
- `last_active_date` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 2. `topic_progress`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `topic_id` (TEXT NOT NULL)
- `completed_lessons` (INTEGER DEFAULT 0)
- `total_lessons` (INTEGER DEFAULT 5)
- `mastery_score` (INTEGER DEFAULT 0)
- `last_active` (TEXT)
- `UNIQUE(user_id, topic_id)`

### 3. `submissions`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `problem_id` (TEXT NOT NULL)
- `language` (TEXT NOT NULL)
- `code` (TEXT NOT NULL)
- `status` (TEXT NOT NULL) — 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'
- `runtime` (TEXT)
- `memory` (TEXT)
- `passed_count` (INTEGER)
- `total_count` (INTEGER)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 4. `quiz_results`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `quiz_id` (TEXT NOT NULL)
- `topic_id` (TEXT NOT NULL)
- `score` (INTEGER NOT NULL)
- `total_questions` (INTEGER NOT NULL)
- `time_spent` (INTEGER NOT NULL)
- `answers_json` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 5. `mistakes` (Mistake Intelligence)
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `source_type` (TEXT NOT NULL) — 'code' or 'quiz'
- `item_id` (TEXT NOT NULL) — problem_id or question_id
- `topic_id` (TEXT NOT NULL)
- `mistake_type` (TEXT NOT NULL) — 'Off-by-One', 'Null / Edge Case', 'Time Limit Exceeded', 'Space Complexity', 'Logic / Inversion', 'Syntax'
- `concept` (TEXT NOT NULL)
- `description` (TEXT NOT NULL)
- `snippet` (TEXT)
- `ai_recommendation` (TEXT)
- `resolved` (INTEGER DEFAULT 0)
- `resolved_at` (TIMESTAMP)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 6. `chat_sessions`
- `id` (TEXT PRIMARY KEY)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `title` (TEXT NOT NULL)
- `topic_context` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 7. `chat_messages`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `session_id` (TEXT NOT NULL, FK -> chat_sessions.id)
- `role` (TEXT NOT NULL) — 'user' or 'assistant'
- `content` (TEXT NOT NULL)
- `mode` (TEXT)
- `citations_json` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 8. `achievements`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `achievement_id` (TEXT NOT NULL)
- `unlocked_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `UNIQUE(user_id, achievement_id)`

### 9. `study_plans`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `title` (TEXT NOT NULL)
- `target_company` (TEXT)
- `target_date` (TEXT)
- `hours_per_week` (INTEGER DEFAULT 10)
- `milestones_json` (TEXT)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### 10. `learning_activity`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `user_id` (INTEGER NOT NULL, FK -> users.id)
- `activity_date` (TEXT NOT NULL)
- `minutes_spent` (INTEGER DEFAULT 0)
- `xp_earned` (INTEGER DEFAULT 0)
- `problems_solved` (INTEGER DEFAULT 0)
- `UNIQUE(user_id, activity_date)`

---

## 3. Real Progress & AI Learning Twin Engine

### Topic Mastery Calculation
Topic mastery is calculated as a composite weighted average across four objective metrics:

$$\text{Mastery}(T) = 0.35 \times \text{LessonCompletion}(T) + 0.30 \times \text{CodingPassRate}(T) + 0.20 \times \text{QuizAccuracy}(T) + 0.15 \times \text{RecencyFactor}(T)$$

Where:
- $\text{LessonCompletion}(T) = \frac{\text{Completed Lessons}}{\text{Total Lessons}} \times 100$
- $\text{CodingPassRate}(T) = \frac{\text{Accepted Submissions}}{\text{Total Attempts}} \times 100$
- $\text{QuizAccuracy}(T) = \frac{\text{Correct Quiz Answers}}{\text{Total Quiz Questions}} \times 100$
- $\text{RecencyFactor}(T) = \max(0, 100 - 5 \times \text{DaysSinceLastActivity})$

### AI Learning Twin Archetype Classification
- **Strong Topics**: Topics with $\text{Mastery}(T) \ge 75\%$.
- **Weak Topics**: Topics with $\text{Mastery}(T) < 50\%$ or $> 2$ logged unresolved mistakes.
- **Archetype**:
  - $\ge 5$ Strong Topics $\rightarrow$ *Adaptive Analytical Problem Solver*
  - $3-4$ Strong Topics $\rightarrow$ *Algorithmic Strategist*
  - $< 3$ Strong Topics $\rightarrow$ *Growth Apprentice*

---

## 4. Mistake Intelligence Classification Pipeline

When code is submitted or a quiz is evaluated:
1. **Assertion Inspection**: Code is executed against public and hidden test cases.
2. **Error Pattern Matching**: If tests fail, the AST and source code are scanned for known anti-patterns:
   - Nested loops without memoization $\rightarrow$ **Time Limit Exceeded**
   - `< hi` on closed intervals or `lo = mid` $\rightarrow$ **Off-by-One Boundary Invariant**
   - Unhandled empty inputs or missing null checks $\rightarrow$ **Null / Edge Case**
   - Inverted condition branches $\rightarrow$ **Logic / Inversion**
3. **Database Logging**: The error is saved to `mistakes` with problem metadata and code snippet.
4. **Remedial Guidance**: The AI tutor synthesizes a targeted correction and links to related drills.
5. **Resolution Lifecycle**: When the user re-attempts and passes the problem, the status flips to `resolved = 1` and unresolved counters update across all views.

---

## 5. Coding Playground Test Runner Architecture

```text
[User Code (Python/JS/C++/Java)]
             │
             ▼
   [Syntax & Safety Check]
   - Disallow os, subprocess, sys, network, file-io
             │
             ▼
   [Subprocess Isolation Sandbox]
   - Ephemeral temp file execution
   - 2000ms CPU execution timeout
   - Resource limits (memory cap 64MB)
             │
             ▼
   [Assertion Verification Suite]
   - Case 1: Standard positive case
   - Case 2: Multi-branch / negative case
   - Case 3: Edge boundary (single element, empty)
             │
             ▼
   [JSON Output Parsing & Big-O Estimation]
   - Returns { passed, runtime, memory, testResults, feedback }
```
