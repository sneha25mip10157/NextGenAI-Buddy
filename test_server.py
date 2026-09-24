#!/usr/bin/env python3
"""
Test suite verifying NextGenAI Buddy server.py database initialization and REST handlers
"""
import os
import sys
import json
import sqlite3
from server import init_db, DB_PATH, evaluate_user_code, generate_ai_response, evaluate_interview_answer

def run_tests():
    print("Testing NextGenAI Buddy Backend...")

    # 1. Database Init
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    init_db()
    assert os.path.exists(DB_PATH), "Database file was not created!"
    print("✓ SQLite database initialized successfully.")

    # 2. Verify Tables and Seed User
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, email, xp, streak FROM users WHERE email = 'sneha.rao@vit.ac.in'")
    user = c.fetchone()
    assert user is not None, "Seed user not found!"
    assert user[1] == "sneha.rao@vit.ac.in", "User email mismatch!"
    print(f"✓ Seed user verified: ID={user[0]}, Email={user[1]}, XP={user[2]}, Streak={user[3]}")

    c.execute("SELECT count(*) FROM topic_progress")
    t_count = c.fetchone()[0]
    assert t_count >= 16, f"Expected 16 topics, got {t_count}"
    print(f"✓ Topic progress seeded: {t_count} topics verified.")

    c.execute("SELECT count(*) FROM mistakes")
    m_count = c.fetchone()[0]
    assert m_count >= 3, f"Expected at least 3 seeded mistakes, got {m_count}"
    print(f"✓ Mistake intelligence seeded: {m_count} mistakes verified.")
    conn.close()

    # 3. Test Code Evaluation Engine
    two_sum_code = """
def twoSum(nums, target):
    lookup = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in lookup:
            return [lookup[diff], i]
        lookup[n] = i
    return []
"""
    result = evaluate_user_code("two-sum", "python", two_sum_code)
    assert result["passed"] is True, f"Code evaluation failed: {result}"
    print("✓ Optimal Two-Sum evaluation passed with full assertions.")

    # Test Off-by-one bug detection
    buggy_binary_search = """
def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
"""
    bug_result = evaluate_user_code("binary-search", "python", buggy_binary_search)
    assert bug_result["passed"] is False, "Expected buggy binary search to fail!"
    assert bug_result["mistake_classification"]["type"] == "Off-by-One", "Expected Off-by-One mistake classification!"
    print(f"✓ Mistake Intelligence correctly identified: {bug_result['mistake_classification']['type']}")

    # 4. Test AI Tutor & Citations
    ai_reply, citations = generate_ai_response("Explain two sum hash map invariant", "explain", "arrays")
    assert len(citations) >= 2, "Expected citations in AI response!"
    assert "lookup" in ai_reply or "Hash" in ai_reply, "AI response missing key explanation content!"
    print(f"✓ AI Tutor generated response with {len(citations)} academic citations.")

    # 5. Test Interview Rubric
    interview_eval = evaluate_interview_answer("How would you invert a binary tree?", "First, check if root is null. Then recursively invert left and right subtrees. Time complexity is O(n), auxiliary stack space O(h).", "technical")
    assert interview_eval["overall_score"] >= 80, f"Expected passing rubric score, got {interview_eval['overall_score']}"
    assert "approach" in interview_eval["rubric"], "Rubric missing approach!"
    print(f"✓ Interview Rubric evaluation passed with score {interview_eval['overall_score']}/100.")

    print("\n🎉 ALL BACKEND CHECKS PASSED SUCCESSFULLY!\n")

if __name__ == "__main__":
    run_tests()
