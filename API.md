# NextGenAI Buddy — REST API Reference Documentation

All API endpoints return JSON and accept standard JSON payloads.  
Base URL: `http://localhost:8000/api`

---

## 1. Authentication Endpoints

### `POST /api/auth/signup`
Creates a new learner account with salted PBKDF2 password hashing.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@university.edu",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "header.payload.signature",
    "user": {
      "id": 2,
      "name": "Jane Doe",
      "email": "jane@university.edu",
      "xp": 100,
      "streak": 1
    }
  }
  ```

### `POST /api/auth/login`
Authenticates user credentials and returns a signed JWT token.
- **Request Body**:
  ```json
  {
    "email": "sneha.rao@vit.ac.in",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "header.payload.signature",
    "user": {
      "id": 1,
      "email": "sneha.rao@vit.ac.in",
      "name": "Sneha Rao",
      "xp": 1480,
      "streak": 7
    }
  }
  ```

### `GET /api/auth/me`
Retrieves currently authenticated user profile based on `Authorization: Bearer <token>` header.

### `POST /api/auth/profile`
Updates profile information.
- **Request Body**:
  ```json
  {
    "name": "Sneha Rao",
    "bio": "Targeting Google & Meta SDE Roles",
    "target_role": "Software Development Engineer"
  }
  ```

---

## 2. Topics & Progress

### `GET /api/topics`
Returns dictionary mapping `topic_id` to user progress metrics.
- **Response (200 OK)**:
  ```json
  {
    "topics_progress": {
      "arrays": {
        "topic_id": "arrays",
        "completed_lessons": 5,
        "total_lessons": 5,
        "mastery_score": 85,
        "last_active": "2026-09-24"
      }
    }
  }
  ```

### `POST /api/progress/topic`
Records completed lessons and updates mastery score.
- **Request Body**:
  ```json
  {
    "topic_id": "trees",
    "completed_lessons": 1,
    "mastery_score": 55
  }
  ```

---

## 3. Dashboard & Analytics

### `GET /api/dashboard`
Returns aggregated statistics for the personalized command center.
- **Response (200 OK)**:
  ```json
  {
    "user": { "id": 1, "name": "Sneha Rao", "xp": 1480, "streak": 7 },
    "stats": {
      "streak": 7,
      "xp": 1480,
      "problems_solved": 24,
      "completed_lessons": 44,
      "avg_mastery": 55,
      "quiz_accuracy": 88,
      "unresolved_mistakes": 2
    },
    "weekly_activity": [
      { "activity_date": "2026-09-24", "minutes_spent": 45, "xp_earned": 140, "problems_solved": 2 }
    ],
    "achievements": [
      { "achievement_id": "first_code", "unlocked_at": "2026-09-20" }
    ]
  }
  ```

### `GET /api/analytics`
Returns breakdown of mistakes by category, topic mastery distribution, and submission history.

### `GET /api/learning-twin`
Returns the dynamically calculated AI Learning Twin learner profile.
- **Response (200 OK)**:
  ```json
  {
    "archetype": "Adaptive Analytical Problem Solver",
    "confidence_score": 82,
    "strong_topics": ["arrays", "stacks", "twopointers"],
    "weak_topics": ["dp", "backtracking"],
    "frequent_mistakes": [["Off-by-One", 2], ["Time Limit Exceeded", 1]],
    "recommendations": [
      "Focus targeted revision on 'DP' to boost foundational confidence.",
      "Frequent slip detected: 'Off-by-One'. Double-check boundary loop invariants."
    ]
  }
  ```

---

## 4. Code Execution & Testing

### `POST /api/code/run`
Executes user code in a sandboxed subprocess and validates against problem test assertions.
- **Request Body**:
  ```json
  {
    "problem_id": "two-sum",
    "language": "python",
    "code": "def twoSum(nums, target):\n    lookup = {}\n    for i, n in enumerate(nums):\n        if target - n in lookup: return [lookup[target-n], i]\n        lookup[n] = i\n    return []"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "passed": true,
    "runtime": "38 ms",
    "memory": "14.8 MB",
    "passed_count": 3,
    "total_count": 3,
    "testResults": [
      { "caseNum": 1, "input": "nums = [2,7,11,15], target = 9", "expected": "[0, 1]", "actual": "[0, 1]", "status": "Passed" }
    ],
    "feedback": {
      "bugs": "No syntax or invariant violations.",
      "timeComplexity": "O(n) Linear scan with hash map",
      "spaceComplexity": "O(n) Auxiliary hash table",
      "optimization": "Optimal time and space bounds achieved."
    }
  }
  ```

### `POST /api/code/submit`
Evaluates code, stores formal submission record in `submissions`, awards XP, and updates daily activity.

---

## 5. Mistake Intelligence

### `GET /api/mistakes`
Returns all logged slips and invariant failures for the authenticated user.

### `POST /api/mistakes/resolve`
Marks a logged mistake as mastered.
- **Request Body**:
  ```json
  { "mistake_id": 1 }
  ```

---

## 6. AI Buddy & Mock Interview

### `POST /api/ai/chat`
Generates Socratic pedagogical guidance and verified academic citations.
- **Request Body**:
  ```json
  {
    "message": "Explain Kadane's algorithm invariant",
    "mode": "explain",
    "topic_context": "arrays"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "session_id": "sess_abc123",
    "reply": "### Kadane's Algorithm Invariant\nAt index i, either extend current subarray or start fresh...",
    "citations": [
      { "title": "Introduction to Algorithms (CLRS)", "url": "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" }
    ]
  }
  ```

### `POST /api/ai/interview-eval`
Evaluates candidate answer against FAANG 6-dimension rubric.

---

## 7. Study Plan & Gamification

### `GET /api/study-plan`
Retrieves user's active acceleration roadmap.

### `PUT /api/study-plan/milestone`
Toggles milestone completion status.
- **Request Body**:
  ```json
  { "milestone_id": "m1", "done": true }
  ```

### `GET /api/achievements`
Returns list of unlocked badge IDs and timestamps.
