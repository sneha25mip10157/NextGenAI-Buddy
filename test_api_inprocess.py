#!/usr/bin/env python3
"""
In-process API and Handler test suite for NextGenAI Buddy
Directly exercises NextGenAPIHandler routes, requests, database queries,
and response JSON without requiring external network socket creation (sandbox-friendly).
"""

import os
import sys
import io
import json
from server import NextGenAPIHandler, init_db, get_db

class MockHTTPHandler(NextGenAPIHandler):
    """Subclass of NextGenAPIHandler that captures response in memory."""
    def __init__(self, method, path, body=None, headers=None):
        self.command = method
        self.path = path
        self.request_version = "HTTP/1.1"
        self.headers = headers or {}
        
        raw_body = json.dumps(body).encode("utf-8") if isinstance(body, dict) else (body or b"")
        if body is not None and "Content-Length" not in self.headers:
            self.headers["Content-Length"] = str(len(raw_body))
        
        self.rfile = io.BytesIO(raw_body)
        self.wfile = io.BytesIO()
        self.response_status = None
        self.response_headers = {}

    def send_response(self, code, message=None):
        self.response_status = code

    def send_header(self, keyword, value):
        self.response_headers[keyword.lower()] = value

    def end_headers(self):
        pass

    def get_response_json(self):
        data = self.wfile.getvalue().decode("utf-8")
        try:
            return json.loads(data)
        except Exception:
            return data

def test_api():
    print("🚀 Initializing database & testing NextGenAPIHandler in-process...")
    init_db()

    # 1. Test GET /api/dashboard
    h = MockHTTPHandler("GET", "/api/dashboard")
    h.do_GET()
    assert h.response_status == 200, f"Expected 200, got {h.response_status}"
    dash = h.get_response_json()
    assert "stats" in dash, "Dashboard missing stats!"
    assert dash["stats"]["streak"] >= 7, "Streak mismatch!"
    print(f"✓ GET /api/dashboard: Streak={dash['stats']['streak']}, XP={dash['stats']['xp']}, Lessons={dash['stats']['completed_lessons']}")

    # 2. Test GET /api/topics
    h = MockHTTPHandler("GET", "/api/topics")
    h.do_GET()
    assert h.response_status == 200
    topics_res = h.get_response_json()
    assert len(topics_res["topics_progress"]) >= 16
    print(f"✓ GET /api/topics: {len(topics_res['topics_progress'])} topics tracked in database.")

    # 3. Test POST /api/code/run (Two Sum)
    two_sum_code = (
        "def twoSum(nums, target):\n"
        "    lookup = {}\n"
        "    for i, n in enumerate(nums):\n"
        "        if target - n in lookup: return [lookup[target-n], i]\n"
        "        lookup[n] = i\n"
        "    return []"
    )
    h = MockHTTPHandler("POST", "/api/code/run", body={"problem_id": "two-sum", "language": "python", "code": two_sum_code})
    h.do_POST()
    assert h.response_status == 200
    eval_res = h.get_response_json()
    assert eval_res["passed"] is True, f"Expected pass, got {eval_res}"
    print(f"✓ POST /api/code/run (Two Sum): {eval_res['passed_count']}/{eval_res['total_count']} assertions passed ({eval_res['runtime']}).")

    # 4. Test POST /api/code/run with Buggy Binary Search (Verify Mistake Intelligence logging)
    buggy_bs = (
        "def search(nums, target):\n"
        "    lo, hi = 0, len(nums)-1\n"
        "    while lo < hi:\n"
        "        mid = (lo + hi)//2\n"
        "        if nums[mid] == target: return mid\n"
        "        elif nums[mid] < target: lo = mid + 1\n"
        "        else: hi = mid - 1\n"
        "    return -1"
    )
    h = MockHTTPHandler("POST", "/api/code/run", body={"problem_id": "binary-search", "language": "python", "code": buggy_bs})
    h.do_POST()
    assert h.response_status == 200
    bug_res = h.get_response_json()
    assert bug_res["passed"] is False, "Expected bug to fail"
    assert bug_res["mistake_classification"]["type"] == "Off-by-One"
    print(f"✓ POST /api/code/run: Mistake Intelligence identified '{bug_res['mistake_classification']['type']}'.")

    # 5. Test GET /api/mistakes
    h = MockHTTPHandler("GET", "/api/mistakes")
    h.do_GET()
    assert h.response_status == 200
    m_data = h.get_response_json()
    assert len(m_data["mistakes"]) >= 4, f"Expected at least 4 logged mistakes, got {len(m_data['mistakes'])}"
    print(f"✓ GET /api/mistakes: Verified {len(m_data['mistakes'])} logged slips in database.")

    # 6. Test POST /api/quiz/submit
    h = MockHTTPHandler("POST", "/api/quiz/submit", body={
        "quiz_id": "arrays-quiz",
        "topic_id": "arrays",
        "score": 4,
        "total_questions": 4,
        "time_spent": 120,
        "answers": [0, 1, 0, 0],
        "mistakes": []
    })
    h.do_POST()
    assert h.response_status == 200
    quiz_res = h.get_response_json()
    assert quiz_res["success"] is True
    print(f"✓ POST /api/quiz/submit: Successfully logged score={quiz_res['score']}, XP=+{quiz_res['xp_earned']}.")

    # 7. Test POST /api/ai/chat
    h = MockHTTPHandler("POST", "/api/ai/chat", body={
        "message": "Explain how two pointers eliminate quadratic search in container with most water",
        "mode": "explain",
        "topic_context": "arrays"
    })
    h.do_POST()
    assert h.response_status == 200
    chat_res = h.get_response_json()
    assert len(chat_res["citations"]) >= 2
    print(f"✓ POST /api/ai/chat: AI pedagogical response generated with {len(chat_res['citations'])} academic citations.")

    # 8. Test GET /api/learning-twin
    h = MockHTTPHandler("GET", "/api/learning-twin")
    h.do_GET()
    assert h.response_status == 200
    twin_res = h.get_response_json()
    assert "archetype" in twin_res
    print(f"✓ GET /api/learning-twin: Calculated Archetype='{twin_res['archetype']}', Confidence={twin_res['confidence_score']}%.")

    # 9. Test GET /api/study-plan
    h = MockHTTPHandler("GET", "/api/study-plan")
    h.do_GET()
    assert h.response_status == 200
    plan_res = h.get_response_json()
    assert plan_res["study_plan"] is not None
    assert len(plan_res["study_plan"]["milestones"]) >= 5
    print(f"✓ GET /api/study-plan: Verified study plan with {len(plan_res['study_plan']['milestones'])} milestones.")

    # 10. Test GET /api/achievements
    h = MockHTTPHandler("GET", "/api/achievements")
    h.do_GET()
    assert h.response_status == 200
    ach_res = h.get_response_json()
    assert len(ach_res["unlocked"]) >= 4
    print(f"✓ GET /api/achievements: Verified {len(ach_res['unlocked'])} unlocked achievement badges.")

    print("\n========================================================")
    print("  🎉 ALL 10 IN-PROCESS API ROUTE TESTS PASSED!")
    print("========================================================\n")

if __name__ == "__main__":
    test_api()
