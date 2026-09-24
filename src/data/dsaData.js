/**
 * NextGenAI Buddy — Complete Domain Data
 * 16 Topics, Comprehensive Curricula, Real Test Suites,
 * Quizzes, Interview Tracks, and Concept Dependency Graph.
 */

export const TOPICS_DATA = [
  {
    id: "arrays",
    name: "Arrays & Dynamic Arrays",
    difficulty: "Easy",
    time: "2.5 hrs",
    category: "Beginner",
    summary: "Contiguous blocks of memory enabling O(1) random access, cache spatial locality, and two-pointer/sliding window patterns.",
    prerequisites: [],
    objectives: [
      "Master two-pointer and sliding window techniques",
      "Understand prefix sums and difference arrays",
      "Analyze contiguous memory layout and cache spatial locality",
      "Implement dynamic array amortized resizing algorithms"
    ],
    concepts: ["Dynamic vs Static", "Prefix Sums", "Two Pointers", "Sliding Window", "Dutch National Flag", "Kadane's Algorithm"],
    timeComp: "O(1) access · O(n) insert/delete",
    spaceComp: "O(n) memory allocation",
    pitfalls: "Off-by-one errors on boundary conditions; allocating duplicate arrays inside nested loops causing memory bloat.",
    interviewTips: "Always clarify if array is sorted, whether duplicates exist, and if in-place modification is required.",
    practiceQuestions: ["two-sum", "max-subarray", "container-with-most-water"],
    lessons: [
      {
        id: "arr-1",
        title: "Memory Layout & Cache Locality",
        duration: "20 min",
        content: `### Contiguous Memory Allocation
Arrays store homogeneous elements in adjacent memory locations. Because memory addresses are consecutive ($Address(i) = Base + i \\times Size$), looking up index $i$ takes exactly **$O(1)$ constant time**.

#### Cache Locality Advantage
Modern CPU caches load memory in 64-byte **cache lines**. Scanning an array linearly triggers hardware pre-fetching, making array traversals drastically faster in wall-clock time than pointer-chasing structures like linked lists.`,
        codeExample: `# Python Dynamic Array Amortized Expansion
arr = []
for i in range(10):
    arr.append(i) # O(1) amortized insertion`
      },
      {
        id: "arr-2",
        title: "Two-Pointer Strategy",
        duration: "25 min",
        content: `### Two Pointers: Left & Right Bounds
When an array is sorted or monotonic, two pointers starting at opposite ends can eliminate a full dimension of search, dropping brute-force $O(n^2)$ down to $O(n)$.

- Inward convergence: Used in Two Sum II, Container With Most Water.
- Fast & slow runners: In-place duplicate removal.`,
        codeExample: `def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target: return [lo, hi]
        elif s < target: lo += 1
        else: hi -= 1
    return []`
      }
    ]
  },
  {
    id: "strings",
    name: "Strings & Pattern Hashing",
    difficulty: "Easy",
    time: "2.0 hrs",
    category: "Beginner",
    summary: "Immutable and mutable character sequences, rolling hashing, and pattern-matching foundations.",
    prerequisites: ["arrays"],
    objectives: [
      "Master string manipulation without excessive allocation",
      "Learn Rabin-Karp rolling hash and KMP prefix functions",
      "Solve palindrome, anagram, and substring challenges"
    ],
    concepts: ["Immutability", "Rabin-Karp Hashing", "Trie Prefixes", "Anagram Frequency Arrays", "Manacher's Algorithm"],
    timeComp: "O(n) traversal · O(m+n) matching",
    spaceComp: "O(1) to O(n) space",
    pitfalls: "Repeated string concatenation inside loops causing O(n²) time in Java/Python.",
    interviewTips: "Use fixed size 26 or 128 int arrays for ASCII character frequencies instead of heavy hash maps.",
    practiceQuestions: ["valid-anagram", "longest-substring-without-repeating-characters"],
    lessons: [
      {
        id: "str-1",
        title: "Immutability & Buffer Allocation",
        duration: "20 min",
        content: `In languages like Java and Python, strings are **immutable**. Executing \`s += c\` creates a brand-new string of size $k$ every time, resulting in an inadvertent $O(n^2)$ runtime for simple loops. Always use a \`StringBuilder\` or a character list \`"".join(chars)\`.`
      }
    ]
  },
  {
    id: "linkedlists",
    name: "Linked Lists",
    difficulty: "Easy",
    time: "2.5 hrs",
    category: "Beginner",
    summary: "Pointer-connected node chains providing dynamic size allocation and fast O(1) head/tail insertions.",
    prerequisites: [],
    objectives: [
      "Master pointer manipulation and edge-case boundary management",
      "Implement fast/slow pointer (Floyd's Cycle Detection)",
      "Reverse lists iteratively and recursively"
    ],
    concepts: ["Singly vs Doubly Linked", "Sentinel Dummy Nodes", "Floyd's Tortoise & Hare", "In-Place Reversal"],
    timeComp: "O(n) search · O(1) insertion at head",
    spaceComp: "O(1) auxiliary in-place",
    pitfalls: "Losing head pointer references or creating accidental memory cycles during node re-linking.",
    interviewTips: "Always introduce a dummy head node before modifying head to eliminate NULL checks.",
    practiceQuestions: ["reverse-linked-list", "linked-list-cycle-ii"],
    lessons: [
      {
        id: "ll-1",
        title: "Iterative Pointer Reversal",
        duration: "25 min",
        content: `### Reversing in O(1) Space
To reverse a singly linked list in-place:
1. Maintain three pointers: \`prev\`, \`curr\`, and \`next\`.
2. Before updating \`curr.next = prev\`, cache \`next = curr.next\`.
3. Shift \`prev = curr\` and \`curr = next\`.`,
        codeExample: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
      }
    ]
  },
  {
    id: "stacks",
    name: "Stacks & Monotonic Evaluation",
    difficulty: "Easy",
    time: "2.0 hrs",
    category: "Beginner",
    summary: "LIFO (Last-In, First-Out) structures driving monotonic evaluation, parenthesis matching, and recursion call stacks.",
    prerequisites: ["arrays"],
    objectives: [
      "Master monotonic increasing and decreasing stacks",
      "Evaluate postfix/prefix expressions accurately",
      "Handle parenthesis matching and syntax parsing"
    ],
    concepts: ["LIFO Property", "Monotonic Stack", "Next Greater Element", "Expression Evaluation"],
    timeComp: "O(1) push/pop/peek",
    spaceComp: "O(n) auxiliary",
    pitfalls: "Calling pop() on an empty stack; neglecting monotonic condition boundaries.",
    interviewTips: "If problem asks for 'nearest greater/smaller element on left or right', immediately think monotonic stack.",
    practiceQuestions: ["valid-parentheses", "daily-temperatures"],
    lessons: [
      {
        id: "st-1",
        title: "Monotonic Stack Pattern",
        duration: "30 min",
        content: `### Linear Time Range Queries
A **monotonic stack** maintains its elements in strictly sorted order. When a new element violates monotonicity, we pop elements and resolve queries (like *Next Greater Element* or *Largest Rectangle in Histogram*) in aggregate $O(n)$ time because each element enters and leaves the stack at most once.`
      }
    ]
  },
  {
    id: "queues",
    name: "Queues & Deques",
    difficulty: "Easy",
    time: "1.5 hrs",
    category: "Beginner",
    summary: "FIFO (First-In, First-Out) buffers and double-ended queues essential for level-order traversals and sliding window maximums.",
    prerequisites: ["arrays", "linkedlists"],
    objectives: [
      "Implement circular ring buffers and double-ended queues",
      "Power BFS graph and tree traversals",
      "Design rate limiters and task schedulers"
    ],
    concepts: ["Circular Queues", "Monotonic Deque", "Breadth-First Buffering", "Priority Queue Interop"],
    timeComp: "O(1) enqueue/dequeue",
    spaceComp: "O(n) capacity",
    pitfalls: "Inefficient array shifts O(n) instead of ring buffer or pointer head in custom implementations.",
    interviewTips: "Use collections.deque in Python or java.util.ArrayDeque in Java rather than LinkedList for lower overhead.",
    practiceQuestions: ["sliding-window-maximum", "implement-queue-using-stacks"],
    lessons: [
      {
        id: "q-1",
        title: "Circular Buffer Mechanics",
        duration: "20 min",
        content: `A circular queue uses modulo arithmetic \`rear = (rear + 1) % capacity\` to prevent wasted memory when elements are dequeued from the front.`
      }
    ]
  },
  {
    id: "trees",
    name: "Binary Trees",
    difficulty: "Medium",
    time: "3.5 hrs",
    category: "Intermediate",
    summary: "Hierarchical acyclic structures modeling file systems, decision branches, and recursive topologies.",
    prerequisites: ["stacks", "queues"],
    objectives: [
      "Master Pre-order, In-order, Post-order, and Level-order traversals",
      "Calculate depths, diameters, and lowest common ancestors",
      "Serialize and deserialize binary trees"
    ],
    concepts: ["DFS & BFS", "Tree Diameter", "Lowest Common Ancestor", "Serialization", "Path Sums"],
    timeComp: "O(n) traversal · O(h) recursive depth",
    spaceComp: "O(h) call stack (h = log n to n)",
    pitfalls: "Failing to handle null tree roots; confusing balanced tree height log(n) with degenerate linked list O(n).",
    interviewTips: "90% of binary tree problems reduce to: what information do I need from my left child, and right child?",
    practiceQuestions: ["maximum-depth-of-binary-tree", "lowest-common-ancestor"],
    lessons: [
      {
        id: "tr-1",
        title: "Recursive Tree Invariants",
        duration: "30 min",
        content: `### Bottom-Up Post-Order Reasoning
Most tree problems require computing subproblems on left and right subtrees before forming the parent answer. For example, tree height is \`1 + max(left_h, right_h)\`.`
      }
    ]
  },
  {
    id: "bst",
    name: "Binary Search Trees",
    difficulty: "Medium",
    time: "2.5 hrs",
    category: "Intermediate",
    summary: "Ordered tree invariant where all left descendants are strictly less than parent, and right descendants are greater.",
    prerequisites: ["trees"],
    objectives: [
      "Validate BST invariants using bounded ranges (-inf, +inf)",
      "Perform O(log n) searches, insertions, and deletions",
      "Understand AVL and Red-Black self-balancing mechanisms"
    ],
    concepts: ["BST Invariant", "In-Order Monotonicity", "Successor & Predecessor", "Self-Balancing Trees"],
    timeComp: "O(h) search/insert (h = log n average)",
    spaceComp: "O(h) recursive stack",
    pitfalls: "Only checking node.left < node without propagating ancestor min/max bounds.",
    interviewTips: "Remember that In-Order traversal of a BST always yields elements in strictly ascending sorted order.",
    practiceQuestions: ["validate-binary-search-tree", "kth-smallest-element-in-a-bst"],
    lessons: [
      {
        id: "bst-1",
        title: "BST Range Invariant",
        duration: "25 min",
        content: `To validate a BST, pass \`(low, high)\` bounds recursively: \`is_valid(node.left, low, node.val)\` and \`is_valid(node.right, node.val, high)\`.`
      }
    ]
  },
  {
    id: "heaps",
    name: "Heaps & Priority Queues",
    difficulty: "Medium",
    time: "2.5 hrs",
    category: "Intermediate",
    summary: "Complete binary trees stored contiguously in arrays providing O(1) access to min/max and O(log n) insertions.",
    prerequisites: ["trees", "arrays"],
    objectives: [
      "Implement binary heap array indexing: parent(i) = (i-1)//2",
      "Solve Top-K Frequent Elements and Kth Largest problems",
      "Understand Dijkstra's shortest path priority queues"
    ],
    concepts: ["Min-Heap vs Max-Heap", "Sift-Up & Sift-Down", "Heapify in O(n)", "Two-Heap Median Pattern"],
    timeComp: "O(1) peek · O(log n) push/pop · O(n) heapify",
    spaceComp: "O(n) storage",
    pitfalls: "Building a heap with n successive pushes O(n log n) instead of bottom-up heapify in O(n).",
    interviewTips: "To find Kth largest elements, use a Min-Heap of size K (not a Max-Heap).",
    practiceQuestions: ["kth-largest-element-in-an-array", "find-median-from-data-stream"],
    lessons: [
      {
        id: "hp-1",
        title: "The K-Size Min-Heap Trick",
        duration: "25 min",
        content: `By keeping a Min-Heap of fixed size $k$, the top of the heap is always the $k$-th largest element seen so far. Total time: $O(n \\log k)$, auxiliary space: $O(k)$.`
      }
    ]
  },
  {
    id: "hashmaps",
    name: "Hash Tables & Sets",
    difficulty: "Easy",
    time: "2.0 hrs",
    category: "Beginner",
    summary: "Key-value associative mappings using hash functions, bucket arrays, and collision resolution strategies.",
    prerequisites: ["arrays"],
    objectives: [
      "Understand hash collision resolution: chaining vs open addressing",
      "Analyze load factors and rehashing costs",
      "Apply hash maps for O(1) frequency counting and compliments"
    ],
    concepts: ["Hash Functions", "Collision Resolution", "Load Factor", "Rolling Hash", "Ordered Dict / LRU"],
    timeComp: "O(1) average lookup/insert · O(n) worst case",
    spaceComp: "O(n) auxiliary",
    pitfalls: "Using unhashable mutable keys; forgetting worst-case hash collision degradation to O(n).",
    interviewTips: "Combine Hash Map + Doubly Linked List to implement an O(1) LRU Cache.",
    practiceQuestions: ["two-sum", "group-anagrams", "lru-cache"],
    lessons: [
      {
        id: "hm-1",
        title: "Amortized O(1) & Resizing",
        duration: "20 min",
        content: `When the load factor exceeds 0.75, the hash table doubles its bucket capacity and rehashes all elements in $O(n)$ time. This yields $O(1)$ amortized insertion.`
      }
    ]
  },
  {
    id: "graphs",
    name: "Graphs & Topological Sort",
    difficulty: "Medium",
    time: "4.0 hrs",
    category: "Intermediate",
    summary: "Networks of vertices connected by directed or undirected edges modeling routes, dependencies, and social graphs.",
    prerequisites: ["trees", "queues", "stacks"],
    objectives: [
      "Represent graphs via Adjacency List vs Adjacency Matrix",
      "Detect cycles in directed and undirected graphs",
      "Implement Kahn's Algorithm for Topological Sorting"
    ],
    concepts: ["Adjacency Representation", "Cycle Detection", "Topological Sort", "Connected Components", "Bipartite Graphs"],
    timeComp: "O(V + E) traversal",
    spaceComp: "O(V) recursion stack / queue",
    pitfalls: "Failing to mark visited vertices resulting in infinite recursion cycles.",
    interviewTips: "Whenever you see 'prerequisites' or 'build order', immediately think Directed Acyclic Graph + Topological Sort.",
    practiceQuestions: ["course-schedule", "number-of-islands", "clone-graph"],
    lessons: [
      {
        id: "gr-1",
        title: "Kahn's BFS In-Degree Algorithm",
        duration: "30 min",
        content: `Compute in-degrees for all vertices. Enqueue all vertices with in-degree 0. As vertices are dequeued, decrement neighbors' in-degrees. If processed count < total vertices, a cycle exists!`
      }
    ]
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    difficulty: "Hard",
    time: "5.0 hrs",
    category: "Advanced",
    summary: "Breaking complex combinatorial problems into overlapping subproblems with optimal substructure.",
    prerequisites: ["recursion", "trees"],
    objectives: [
      "Distinguish Top-Down (Memoization) vs Bottom-Up (Tabulation)",
      "Formulate recurrence relations and base cases",
      "Optimize state space from O(n) to O(1) space"
    ],
    concepts: ["Overlapping Subproblems", "Optimal Substructure", "Memoization", "Tabulation", "0/1 Knapsack", "State Machine DP"],
    timeComp: "Polynomial: O(n), O(n²), O(n×W)",
    spaceComp: "O(n) table down to O(1) rolling variables",
    pitfalls: "Misidentifying the state parameters; missing edge base cases like amount = 0.",
    interviewTips: "Start with brute force recursive tree. Draw redundant nodes to prove overlapping subproblems before writing memoization.",
    practiceQuestions: ["climbing-stairs", "coin-change", "longest-increasing-subsequence"],
    lessons: [
      {
        id: "dp-1",
        title: "The 4-Step DP Framework",
        duration: "35 min",
        content: `1. Define State: What does \`dp[i]\` represent?
2. Recurrence: How does \`dp[i]\` relate to \`dp[i-1]\` or \`dp[i-2]\`?
3. Base Cases: What are the smallest non-recursive answers?
4. Iteration Direction: Top-down or bottom-up?`
      }
    ]
  },
  {
    id: "backtracking",
    name: "Backtracking & Recursion",
    difficulty: "Medium",
    time: "3.5 hrs",
    category: "Intermediate",
    summary: "Systematically searching solution trees and pruning invalid search paths via backtracking.",
    prerequisites: ["recursion", "trees"],
    objectives: [
      "Master the Choose-Explore-Unchoose template",
      "Prune search branches to avoid factorial explosions",
      "Generate permutations, combinations, and subsets"
    ],
    concepts: ["Decision Trees", "Pruning", "Subsets", "Permutations", "N-Queens", "Sudoku Solver"],
    timeComp: "Exponential / Factorial: O(2^n) or O(n!)",
    spaceComp: "O(n) call stack depth",
    pitfalls: "Modifying mutable list without reverting changes in backtracking step (failing to unchoose).",
    interviewTips: "Always draw the decision tree with branches labeled by decision to keep constraints clear.",
    practiceQuestions: ["subsets", "permutations", "n-queens"],
    lessons: [
      {
        id: "bt-1",
        title: "The Backtracking Template",
        duration: "25 min",
        content: `\`\`\`python
def backtrack(path, options):
    if is_solution(path):
        res.append(path.copy())
        return
    for opt in options:
        if is_valid(opt):
            path.append(opt)       # Choose
            backtrack(path, rest)  # Explore
            path.pop()             # Unchoose
\`\`\``
      }
    ]
  },
  {
    id: "greedy",
    name: "Greedy Algorithms",
    difficulty: "Medium",
    time: "2.5 hrs",
    category: "Intermediate",
    summary: "Making locally optimal choices at each stage with the goal of finding a global optimum.",
    prerequisites: ["arrays"],
    objectives: [
      "Prove greedy choice property and optimal substructure",
      "Solve interval scheduling and jump game problems",
      "Implement Huffman coding and fractional knapsack"
    ],
    concepts: ["Greedy Choice Property", "Interval Scheduling", "Jump Game", "Gas Station", "Huffman Trees"],
    timeComp: "O(n log n) sorting + O(n) greedy scan",
    spaceComp: "O(1) to O(n) auxiliary",
    pitfalls: "Applying greedy heuristic without mathematical proof of global optimality.",
    interviewTips: "Sorting intervals by end time is the key trick for non-overlapping interval scheduling.",
    practiceQuestions: ["jump-game", "merge-intervals", "task-scheduler"],
    lessons: [
      {
        id: "grd-1",
        title: "Interval Scheduling",
        duration: "25 min",
        content: `Sorting intervals by their end-time greedily leaves the maximum remaining time available for subsequent intervals.`
      }
    ]
  },
  {
    id: "twopointers",
    name: "Two Pointers Technique",
    difficulty: "Easy",
    time: "2.0 hrs",
    category: "Beginner",
    summary: "Coordinated pointer traversal across linear structures reducing quadratic searches to linear time.",
    prerequisites: ["arrays"],
    objectives: [
      "Master inward convergence on sorted sequences",
      "Master fast/slow runner pointer pairs",
      "Partition arrays in Dutch National Flag"
    ],
    concepts: ["Opposite Ends", "Fast & Slow", "Collision Detection", "Dutch National Flag Partition"],
    timeComp: "O(n) linear scan",
    spaceComp: "O(1) constant auxiliary space",
    pitfalls: "Neglecting loop termination when lo == hi; updating pointers prematurely.",
    interviewTips: "If problem specifies 'in-place with O(1) extra space', two pointers is almost always the answer.",
    practiceQuestions: ["two-sum", "container-with-most-water", "trapping-rain-water"],
    lessons: [
      {
        id: "tp-1",
        title: "Inward Convergence",
        duration: "20 min",
        content: `Move the pointer that cannot possibly contribute to a better solution, strictly shrinking the candidate space.`
      }
    ]
  },
  {
    id: "slidingwindow",
    name: "Sliding Window Pattern",
    difficulty: "Medium",
    time: "2.5 hrs",
    category: "Intermediate",
    summary: "Expanding and contracting sub-arrays or sub-strings to capture optimal range properties in O(n) time.",
    prerequisites: ["arrays", "hashmaps"],
    objectives: [
      "Differentiate fixed-size vs dynamic-size sliding windows",
      "Maintain running window state with auxiliary frequency tables",
      "Shrink window from left until validity invariant is restored"
    ],
    concepts: ["Fixed Window", "Dynamic Window", "Auxiliary Frequency Table", "Minimum Window Substring"],
    timeComp: "O(n) amortized (each element enters and exits window at most once)",
    spaceComp: "O(k) where k is character alphabet size",
    pitfalls: "Recalculating window sum or properties from scratch instead of updating with delta (+incoming, -outgoing).",
    interviewTips: "Keep an expanding right pointer, and shrink left pointer only while window invariant is violated.",
    practiceQuestions: ["longest-substring-without-repeating-characters", "minimum-window-substring"],
    lessons: [
      {
        id: "sw-1",
        title: "Dynamic Window Mechanics",
        duration: "30 min",
        content: `\`\`\`python
l = 0
for r in range(len(s)):
    add_to_window(s[r])
    while invalid_window():
        remove_from_window(s[l])
        l += 1
    update_best(r - l + 1)
\`\`\``
      }
    ]
  },
  {
    id: "trie",
    name: "Trie (Prefix Tree)",
    difficulty: "Medium",
    time: "2.5 hrs",
    category: "Intermediate",
    summary: "Tree structure storing strings where each node represents a common character prefix.",
    prerequisites: ["trees"],
    objectives: [
      "Implement TrieNode with children dictionary and is_end flag",
      "Support O(L) insert, search, and startsWith operations",
      "Solve Autocomplete and Boggle Word Search challenges"
    ],
    concepts: ["Prefix Sharing", "TrieNode Structure", "Bitwise XOR Trie", "Word Search II"],
    timeComp: "O(L) per word of length L",
    spaceComp: "O(N × L) total characters",
    pitfalls: "Memory overhead of storing 26 null child pointers per node in sparse alphabets.",
    interviewTips: "Prefix matching in O(length of query) regardless of how many millions of words exist in the dictionary.",
    practiceQuestions: ["implement-trie-prefix-tree", "word-search-ii"],
    lessons: [
      {
        id: "tr-1",
        title: "TrieNode Architecture",
        duration: "25 min",
        content: `Each node stores \`children = {}\` and a boolean \`is_end = True\` designating word termination.`
      }
    ]
  }
];

export const CONCEPT_DEPENDENCIES = [
  { from: "arrays", to: "strings" },
  { from: "arrays", to: "stacks" },
  { from: "arrays", to: "twopointers" },
  { from: "arrays", to: "hashmaps" },
  { from: "arrays", to: "slidingwindow" },
  { from: "arrays", to: "greedy" },
  { from: "linkedlists", to: "queues" },
  { from: "stacks", to: "trees" },
  { from: "queues", to: "trees" },
  { from: "trees", to: "bst" },
  { from: "trees", to: "heaps" },
  { from: "trees", to: "graphs" },
  { from: "trees", to: "trie" },
  { from: "graphs", to: "dp" },
  { from: "trees", to: "backtracking" },
  { from: "backtracking", to: "dp" }
];

export const PLAYGROUND_PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hash Table",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Exactly one valid answer exists."],
    hints: [
      "A brute force approach checks all pairs in O(n²) time. Can we store seen numbers in O(1) lookup?",
      "As you iterate through the array, calculate complement = target - nums[i]. Check if complement is in your hash map.",
      "Store each number and its index in the hash map after checking."
    ],
    starter: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    lookup = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in lookup:
            return [lookup[diff], i]
        lookup[n] = i
    return []`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> lookup;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (lookup.find(complement) != lookup.end()) {
                return {lookup[complement], i};
            }
            lookup[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
    },
    testCases: [
      { input: "nums = [2, 7, 11, 15], target = 9", expected: "[0, 1]" },
      { input: "nums = [3, 2, 4], target = 6", expected: "[1, 2]" },
      { input: "nums = [3, 3], target = 6", expected: "[0, 1]" }
    ]
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    hints: [
      "Use a Last-In First-Out (LIFO) stack.",
      "When encountering an opening bracket, push it onto the stack.",
      "When encountering a closing bracket, verify that the top of the stack matches its counterpart."
    ],
    starter: {
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ")": "(", "}": "{", "]": "[" };
  for (let c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> st;
        std::unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (map.count(c)) {
                if (st.empty() || st.top() != map[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    testCases: [
      { input: "s = '()[]{}'", expected: "true" },
      { input: "s = '(]'", expected: "false" },
      { input: "s = '([)]'", expected: "false" }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Arrays & Searching",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1 in O(log n) runtime.",
    constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
    hints: [
      "Maintain lo and hi search boundary pointers.",
      "Check mid = lo + (hi - lo) // 2.",
      "Use while lo <= hi to include single-element boundary matches."
    ],
    starter: {
      python: `def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      javascript: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    let mid = Math.floor(lo + (hi - lo) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int lo = 0, hi = nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`
    },
    testCases: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", expected: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", expected: "-1" },
      { input: "nums = [5], target = 5", expected: "0" }
    ]
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray (Kadane's)",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum in O(n) time.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: [
      "Kadane's algorithm: At index i, either extend the previous subarray sum (cur + num) or start fresh (num).",
      "cur_sum = max(num, cur_sum + num)."
    ],
    starter: {
      python: `def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]
    cur_sum = 0
    for n in nums:
        cur_sum = max(n, cur_sum + n)
        max_sum = max(max_sum, cur_sum)
    return max_sum`,
      javascript: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let curSum = 0;
  for (let n of nums) {
    curSum = Math.max(n, curSum + n);
    maxSum = Math.max(maxSum, curSum);
  }
  return maxSum;
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int maxSubArray(std::vector<int>& nums) {
        int maxSum = nums[0], curSum = 0;
        for (int n : nums) {
            curSum = std::max(n, curSum + n);
            maxSum = std::max(maxSum, curSum);
        }
        return maxSum;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0], curSum = 0;
        for (int n : nums) {
            curSum = Math.max(n, curSum + n);
            maxSum = Math.max(maxSum, curSum);
        }
        return maxSum;
    }
}`
    },
    testCases: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "nums = [1]", expected: "1" },
      { input: "nums = [5,4,-1,7,8]", expected: "23" }
    ]
  }
];

export const QUIZZES_DATA = [
  {
    id: "arrays-quiz",
    title: "Arrays, Pointers & Complexity Mastery",
    topic: "arrays",
    difficulty: "Intermediate",
    timeLimit: 300,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the amortized time complexity of appending an element to a dynamically resizing array (e.g. std::vector or Python list)?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        answer: 0,
        explanation: "Doubling capacity when full costs O(n) occasionally, but amortizes across all n insertions to exactly O(1) per element."
      },
      {
        id: "q2",
        type: "true_false",
        question: "Two-pointer inward convergence guarantees finding two sum indices on an UNSORTED array in O(n) time.",
        options: ["True", "False"],
        answer: 1,
        explanation: "Inward convergence requires sorted monotonicity. On unsorted arrays, you must sort first O(n log n) or use a hash map O(n)."
      },
      {
        id: "q3",
        type: "code",
        question: "Given: `nums = [1, 2, 3, 4, 5]`. What is the prefix sum array `P` where `P[i] = sum(nums[0..i])`?",
        options: ["[1, 3, 6, 10, 15]", "[0, 1, 3, 6, 10]", "[1, 2, 3, 4, 5]", "[15, 14, 12, 9, 5]"],
        answer: 0,
        explanation: "P[0]=1, P[1]=1+2=3, P[2]=3+3=6, P[3]=6+4=10, P[4]=10+5=15."
      },
      {
        id: "q4",
        type: "mcq",
        question: "Why is computing mid as `(lo + hi) / 2` discouraged in C++ and Java?",
        options: [
          "It triggers integer overflow when lo + hi exceeds 2^31 - 1",
          "It rounds towards zero instead of floor",
          "It fails on negative numbers",
          "Compilers cannot vectorize the division"
        ],
        answer: 0,
        explanation: "When indices are large, lo + hi can exceed standard 32-bit signed integer limits. Always use `lo + (hi - lo) / 2`."
      }
    ]
  },
  {
    id: "trees-quiz",
    title: "Trees, BST & Recursion Invariants",
    topic: "trees",
    difficulty: "Medium",
    timeLimit: 360,
    questions: [
      {
        id: "tq1",
        type: "mcq",
        question: "Which traversal of a Binary Search Tree (BST) visits nodes in strictly ascending sorted order?",
        options: ["In-order (Left, Root, Right)", "Pre-order (Root, Left, Right)", "Post-order (Left, Right, Root)", "Level-order (BFS)"],
        answer: 0,
        explanation: "In-order traversal visits all smaller elements on the left, then the root, then larger elements on the right."
      },
      {
        id: "tq2",
        type: "mcq",
        question: "What is the worst-case time complexity of searching a value in an un-balanced degenerate BST with N nodes?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answer: 0,
        explanation: "When elements are inserted in already sorted order without balancing, the BST degenerates into a linear linked list of height N."
      }
    ]
  }
];

export const ACHIEVEMENTS_DATA = [
  { id: "first_code", title: "First Compilation", desc: "Submit your first passing solution in the playground", icon: "Code2", xp: 100 },
  { id: "streak_7", title: "Iron Dedication", desc: "Maintain a 7-day continuous learning streak", icon: "Flame", xp: 250 },
  { id: "quiz_whiz", title: "Theory Champion", desc: "Complete any DSA quiz with 100% accuracy", icon: "Award", xp: 150 },
  { id: "array_ace", title: "Array Virtuoso", desc: "Attain 80%+ mastery across Arrays and Two Pointers", icon: "Boxes", xp: 200 },
  { id: "stack_master", title: "LIFO Commander", desc: "Master Stacks and Monotonic evaluation", icon: "Layers", xp: 200 },
  { id: "tree_conqueror", title: "Tree Arbiter", desc: "Solve LCA, Diameter, and BST validation", icon: "ListTree", xp: 300 },
  { id: "bug_hunter", title: "Bug Whisperer", desc: "Identify and resolve 5 logged mistake intelligence entries", icon: "Bug", xp: 250 },
  { id: "interview_ready", title: "FAANG Certified", desc: "Complete a full AI mock interview scoring 85%+", icon: "Trophy", xp: 500 }
];

export const INTERVIEW_TRACKS = [
  {
    company: "Google",
    tagline: "Algorithms, Graphs & Scalability",
    difficulty: "Hard",
    focus: ["Dynamic Programming", "Graph BFS/DFS", "Tries", "Amortized Complexity"],
    stages: ["Technical Phone Screen (45m)", "Onsite Coding 1 (Algorithms)", "Onsite Coding 2 (Data Structures)", "Googliness & Leadership"],
    mockScenario: "Design an autocomplete system serving 100,000 queries per second with sub-10ms prefix lookup."
  },
  {
    company: "Meta",
    tagline: "Speed, Clean Code & Invariance",
    difficulty: "Medium-Hard",
    focus: ["Binary Trees", "Two Pointers", "Sliding Window", "Graph Traversals"],
    stages: ["Initial Technical Screen (45m)", "Coding Onsite A (Speed)", "Coding Onsite B (System Architecture)", "Behavioral"],
    mockScenario: "Given a 2D grid modeling social connections, find the minimum degrees of separation between two target users."
  },
  {
    company: "Amazon",
    tagline: "Leadership Principles & Clean Solutions",
    difficulty: "Medium",
    focus: ["Trees & BFS", "Heaps / Priority Queues", "Design LRU", "Amazon Leadership Principles"],
    stages: ["Online Assessment (OA 2)", "Technical Coding Rounds", "Bar Raiser Interview"],
    mockScenario: "Design the storage inventory system to retrieve top-k trending products in real-time."
  },
  {
    company: "Microsoft",
    tagline: "Foundational DSA & System Collaboration",
    difficulty: "Medium",
    focus: ["Linked Lists", "Arrays", "Tree Traversals", "Clean Modular Code"],
    stages: ["Codility Assessment", "Virtual Onsite Technical", "Design & Team Collaboration"],
    mockScenario: "Reverse every k-group of nodes in a singly linked list in-place."
  }
];
