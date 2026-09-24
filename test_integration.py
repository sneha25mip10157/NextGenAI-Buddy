#!/usr/bin/env python3
"""
Integration test suite for NextGenAI Buddy Full-Stack Platform
Spawns server.py on test port 8099, sends real HTTP requests,
and verifies every REST API endpoint, database mutation, and SPA fallback.
"""

import os
import sys
import time
import json
import socket
import urllib.request
import urllib.error
import subprocess

TEST_PORT = 8099
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"

def wait_for_server(port, timeout=5):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.5):
                return True
        except OSError:
            time.sleep(0.1)
    return False

def http_get(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
        return resp.status, json.loads(data.decode("utf-8")) if "application/json" in resp.headers.get("Content-Type", "") else data.decode("utf-8")

def http_post(path, payload):
    url = f"{BASE_URL}{path}"
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return resp.status, json.loads(resp.read().decode("utf-8"))

def run_integration():
    print("🚀 Launching NextGenAI Buddy integration test server on port 8099...")
    env = os.environ.copy()
    env["PORT"] = str(TEST_PORT)
    env["HOST"] = "127.0.0.1"
    proc = subprocess.Popen([sys.executable, "server.py"], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        if not wait_for_server(TEST_PORT, timeout=8):
            out, err = proc.communicate(timeout=1)
            print("Server stdout:", out.decode("utf-8", errors="ignore"))
            print("Server stderr:", err.decode("utf-8", errors="ignore"))
            raise AssertionError("Server failed to start within timeout!")
        print("✓ Server is listening on port 8099.")

        # 1. SPA Root Page
        status, html = http_get("/")
        assert status == 200, f"Expected 200 for /, got {status}"
        assert "NextGenAI Buddy" in html, "Root page missing NextGenAI Buddy title!"
        print("✓ GET / (SPA Root) returned 200 OK.")

        # 2. SPA Route Fallback (/learn/arrays)
        status, html_spa = http_get("/learn/arrays")
        assert status == 200, f"Expected 200 for SPA route, got {status}"
        print("✓ GET /learn/arrays (SPA dynamic route fallback) returned 200 OK.")

        # 3. /api/dashboard
        status, dash = http_get("/api/dashboard")
        assert status == 200, f"Expected 200 for dashboard, got {status}"
        assert "stats" in dash, "Dashboard missing stats!"
        assert dash["stats"]["streak"] >= 7, "Streak stat mismatch!"
        assert len(dash["weekly_activity"]) >= 7, "Weekly activity missing entries!"
        print(f"✓ GET /api/dashboard verified: Streak={dash['stats']['streak']}, XP={dash['stats']['xp']}")

        # 4. /api/topics
        status, topics = http_get("/api/topics")
        assert status == 200, f"Expected 200 for topics, got {status}"
        assert len(topics["topics_progress"]) >= 16, "Expected at least 16 topics!"
        print(f"✓ GET /api/topics verified: {len(topics['topics_progress'])} topics in database.")

        # 5. /api/code/run (Valid Two Sum)
        two_sum_code = "def twoSum(nums, target):\n    lookup = {}\n    for i, n in enumerate(nums):\n        if target - n in lookup: return [lookup[target-n], i]\n        lookup[n] = i\n    return []"
        status, eval_res = http_post("/api/code/run", {"problem_id": "two-sum", "language": "python", "code": two_sum_code})
        assert status == 200, f"Expected 200 for code run, got {status}"
        assert eval_res["passed"] is True, f"Code evaluation did not pass: {eval_res}"
        print("✓ POST /api/code/run (Two Sum) passed assertions.")

        # 6. /api/code/run (Buggy Binary Search -> Mistake Intelligence)
        buggy_bs = "def search(nums, target):\n    lo, hi = 0, len(nums)-1\n    while lo < hi:\n        mid = (lo + hi)//2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1"
        status, bug_res = http_post("/api/code/run", {"problem_id": "binary-search", "language": "python", "code": buggy_bs})
        assert status == 200
        assert bug_res["passed"] is False, "Expected buggy code to fail!"
        assert bug_res["mistake_classification"]["type"] == "Off-by-One"
        print(f"✓ POST /api/code/run correctly classified mistake: '{bug_res['mistake_classification']['type']}'.")

        # 7. /api/mistakes
        status, mistakes_data = http_get("/api/mistakes")
        assert status == 200
        assert len(mistakes_data["mistakes"]) >= 3
        print(f"✓ GET /api/mistakes verified: {len(mistakes_data['mistakes'])} logged slips in database.")

        # 8. /api/quiz/submit
        status, quiz_res = http_post("/api/quiz/submit", {
            "quiz_id": "arrays-quiz",
            "topic_id": "arrays",
            "score": 4,
            "total_questions": 4,
            "time_spent": 140,
            "answers": [0, 1, 0, 0],
            "mistakes": []
        })
        assert status == 200
        assert quiz_res["success"] is True
        print(f"✓ POST /api/quiz/submit verified: XP earned = +{quiz_res['xp_earned']} XP.")

        # 9. /api/ai/chat
        status, chat_res = http_post("/api/ai/chat", {
            "message": "Explain how two pointers eliminate quadratic search in container with most water",
            "mode": "explain",
            "topic_context": "arrays"
        })
        assert status == 200
        assert len(chat_res["citations"]) >= 2
        print(f"✓ POST /api/ai/chat verified: AI reply generated with {len(chat_res['citations'])} verified academic citations.")

        # 10. /api/learning-twin
        status, twin_res = http_get("/api/learning-twin")
        assert status == 200
        assert "archetype" in twin_res
        assert len(twin_res["strong_topics"]) >= 1
        print(f"✓ GET /api/learning-twin verified: Archetype='{twin_res['archetype']}', Confidence={twin_res['confidence_score']}%.")

        print("\n========================================================")
        print("  🎉 FULL-STACK INTEGRATION TEST SUITE PASSED (10/10)")
        print("========================================================\n")

    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    run_integration()
