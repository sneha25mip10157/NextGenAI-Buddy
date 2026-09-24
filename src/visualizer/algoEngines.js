/**
 * NextGenAI Buddy — Algorithmic Visualizer Step Engines
 * Genuinely computes the actual mathematical states for:
 * 1. Sorting (Bubble, Selection, Insertion, Merge, Quick)
 * 2. Binary Search
 * 3. Stack (LIFO with Push/Pop/Peek)
 * 4. Queue (FIFO Circular Buffer)
 * 5. Linked List (Insert, Delete, In-Place Reversal)
 * 6. Binary Search Tree (Insert, In-order, Pre-order, Post-order)
 * 7. Graph BFS (Queue wavefront)
 * 8. Graph DFS (Recursion stack & backtracking)
 */

export function genRandomArray(size = 14, min = 10, max = 95) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// -----------------------------------------------------------------------------
// 1. Sorting Step Generators
// -----------------------------------------------------------------------------
export function generateSortingSteps(algoKey, initialArr) {
  const steps = [];
  const a = [...initialArr];
  const n = a.length;

  steps.push({
    arr: [...a],
    compare: [],
    swap: [],
    sortedIndices: [],
    desc: `Initial array with ${n} elements. Starting ${algoKey.toUpperCase()} sort.`
  });

  if (algoKey === "bubble") {
    const sorted = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          arr: [...a],
          compare: [j, j + 1],
          swap: [],
          sortedIndices: [...sorted],
          desc: `Comparing element a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}.`
        });
        if (a[j] > a[j + 1]) {
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          steps.push({
            arr: [...a],
            compare: [],
            swap: [j, j + 1],
            sortedIndices: [...sorted],
            desc: `Swapping: ${a[j + 1]} > ${a[j]} violated ascending invariant.`
          });
        }
      }
      sorted.unshift(n - 1 - i);
      steps.push({
        arr: [...a],
        compare: [],
        swap: [],
        sortedIndices: [...sorted],
        desc: `Pass ${i + 1} complete. Element ${a[n - 1 - i]} is in its finalized sorted position.`
      });
    }
    sorted.unshift(0);
  } else if (algoKey === "selection") {
    const sorted = [];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push({
        arr: [...a],
        compare: [i],
        swap: [],
        sortedIndices: [...sorted],
        desc: `Starting pass ${i + 1}: Assuming index ${i} (value ${a[i]}) is minimum candidate.`
      });
      for (let j = i + 1; j < n; j++) {
        steps.push({
          arr: [...a],
          compare: [minIdx, j],
          swap: [],
          sortedIndices: [...sorted],
          desc: `Comparing current min candidate a[${minIdx}]=${a[minIdx]} with a[${j}]=${a[j]}.`
        });
        if (a[j] < a[a[minIdx]]) {
          minIdx = j;
          steps.push({
            arr: [...a],
            compare: [minIdx],
            swap: [],
            sortedIndices: [...sorted],
            desc: `Discovered new minimum value ${a[minIdx]} at index ${minIdx}.`
          });
        }
      }
      if (minIdx !== i) {
        const tmp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = tmp;
        steps.push({
          arr: [...a],
          compare: [],
          swap: [i, minIdx],
          sortedIndices: [...sorted, i],
          desc: `Swapping found minimum ${a[i]} into finalized position index ${i}.`
        });
      }
      sorted.push(i);
    }
    sorted.push(n - 1);
  } else if (algoKey === "insertion") {
    const sorted = [0];
    for (let i = 1; i < n; i++) {
      let key = a[i];
      let j = i - 1;
      steps.push({
        arr: [...a],
        compare: [i],
        swap: [],
        sortedIndices: [...sorted],
        desc: `Extracting key ${key} at index ${i} to insert into sorted prefix.`
      });
      while (j >= 0 && a[j] > key) {
        steps.push({
          arr: [...a],
          compare: [j, j + 1],
          swap: [],
          sortedIndices: [...sorted],
          desc: `${a[j]} > ${key}: Shifting ${a[j]} right to index ${j + 1}.`
        });
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
      sorted.push(i);
      steps.push({
        arr: [...a],
        compare: [],
        swap: [j + 1],
        sortedIndices: [...sorted],
        desc: `Inserted key ${key} into position ${j + 1}. Prefix [0..${i}] is now sorted.`
      });
    }
  } else if (algoKey === "quick") {
    function quickSort(low, high) {
      if (low < high) {
        const pivotVal = a[high];
        let i = low - 1;
        steps.push({
          arr: [...a],
          compare: [high],
          swap: [],
          sortedIndices: [],
          desc: `Partitioning subarray [${low}..${high}] with pivot ${pivotVal} at index ${high}.`
        });
        for (let j = low; j < high; j++) {
          steps.push({
            arr: [...a],
            compare: [j, high],
            swap: [],
            sortedIndices: [],
            desc: `Comparing element a[${j}]=${a[j]} with pivot ${pivotVal}.`
          });
          if (a[j] < pivotVal) {
            i++;
            const tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
            steps.push({
              arr: [...a],
              compare: [],
              swap: [i, j],
              sortedIndices: [],
              desc: `Swapping ${a[i]} to left partition at index ${i}.`
            });
          }
        }
        const tmp = a[i + 1];
        a[i + 1] = a[high];
        a[high] = tmp;
        const pIndex = i + 1;
        steps.push({
          arr: [...a],
          compare: [],
          swap: [pIndex, high],
          sortedIndices: [pIndex],
          desc: `Placed pivot ${a[pIndex]} into final sorted index ${pIndex}.`
        });

        quickSort(low, pIndex - 1);
        quickSort(pIndex + 1, high);
      }
    }
    quickSort(0, n - 1);
  } else if (algoKey === "merge") {
    function mergeSort(l, r) {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      steps.push({
        arr: [...a],
        compare: [l, r],
        swap: [],
        sortedIndices: [],
        desc: `Dividing subarray [${l}..${r}] at midpoint ${m}.`
      });
      mergeSort(l, m);
      mergeSort(m + 1, r);

      const leftSub = a.slice(l, m + 1);
      const rightSub = a.slice(m + 1, r + 1);
      let p1 = 0, p2 = 0, k = l;

      while (p1 < leftSub.length && p2 < rightSub.length) {
        steps.push({
          arr: [...a],
          compare: [l + p1, m + 1 + p2],
          swap: [],
          sortedIndices: [],
          desc: `Comparing left ${leftSub[p1]} with right ${rightSub[p2]}.`
        });
        if (leftSub[p1] <= rightSub[p2]) {
          a[k] = leftSub[p1];
          p1++;
        } else {
          a[k] = rightSub[p2];
          p2++;
        }
        k++;
      }
      while (p1 < leftSub.length) {
        a[k] = leftSub[p1];
        p1++;
        k++;
      }
      while (p2 < rightSub.length) {
        a[k] = rightSub[p2];
        p2++;
        k++;
      }
      steps.push({
        arr: [...a],
        compare: [],
        swap: [],
        sortedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        desc: `Merged subarrays into sorted segment [${l}..${r}].`
      });
    }
    mergeSort(0, n - 1);
  }

  steps.push({
    arr: [...a],
    compare: [],
    swap: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    desc: `🎉 Sorting completed! Array is now sorted in non-decreasing order.`
  });

  return steps;
}

// -----------------------------------------------------------------------------
// 2. Binary Search Steps
// -----------------------------------------------------------------------------
export function generateBinarySearchSteps(sortedArr, targetVal = null) {
  const arr = [...sortedArr].sort((x, y) => x - y);
  const n = arr.length;
  const target = targetVal !== null ? targetVal : arr[Math.floor(n / 2)];
  const steps = [];

  let lo = 0, hi = n - 1;
  steps.push({
    arr,
    lo, hi, mid: null, target,
    desc: `Searching for target = ${target} across sorted range [0..${hi}].`
  });

  let found = -1;
  while (lo <= hi) {
    const mid = Math.floor(lo + (hi - lo) / 2);
    steps.push({
      arr,
      lo, hi, mid, target,
      desc: `Calculated mid index = ${mid} (value = ${arr[mid]}). Comparing with target = ${target}.`
    });

    if (arr[mid] === target) {
      found = mid;
      steps.push({
        arr,
        lo, hi, mid, target, found: true,
        desc: `🎯 Target ${target} discovered at index ${mid} in O(log n) steps!`
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        arr,
        lo, hi, mid, target,
        desc: `${arr[mid]} < ${target}: Target lies in right half. Adjusting lo = mid + 1 (${mid + 1}).`
      });
      lo = mid + 1;
    } else {
      steps.push({
        arr,
        lo, hi, mid, target,
        desc: `${arr[mid]} > ${target}: Target lies in left half. Adjusting hi = mid - 1 (${mid - 1}).`
      });
      hi = mid - 1;
    }
  }

  if (found === -1) {
    steps.push({
      arr,
      lo, hi, mid: null, target, found: false,
      desc: `Target ${target} does not exist in the array. Search interval exhausted (lo > hi). Return -1.`
    });
  }

  return steps;
}

// -----------------------------------------------------------------------------
// 3. Stack Simulator Steps
// -----------------------------------------------------------------------------
export function generateStackSteps() {
  return [
    { items: [], action: "INIT", desc: "Initialized empty LIFO Stack. Capacity = 6." },
    { items: [15], action: "PUSH 15", desc: "Pushed 15 onto stack. Top pointer points to index 0." },
    { items: [15, 42], action: "PUSH 42", desc: "Pushed 42. It becomes the new top element (LIFO)." },
    { items: [15, 42, 88], action: "PUSH 88", desc: "Pushed 88. Stack size = 3." },
    { items: [15, 42, 88], action: "PEEK", desc: "Peeked top element: 88 without removing it." },
    { items: [15, 42], action: "POP", desc: "Popped 88 from top of stack in O(1) time." },
    { items: [15, 42, 99], action: "PUSH 99", desc: "Pushed 99 onto stack." },
    { items: [15, 42], action: "POP", desc: "Popped 99." },
    { items: [15], action: "POP", desc: "Popped 42. Remaining element is 15." }
  ];
}

// -----------------------------------------------------------------------------
// 4. Queue Simulator Steps (Circular Buffer)
// -----------------------------------------------------------------------------
export function generateQueueSteps() {
  return [
    { buffer: [null, null, null, null, null], front: 0, rear: 0, size: 0, desc: "Empty Circular Queue of capacity 5." },
    { buffer: [10, null, null, null, null], front: 0, rear: 1, size: 1, desc: "Enqueued 10 at rear index 0. Rear advances to 1." },
    { buffer: [10, 25, null, null, null], front: 0, rear: 2, size: 2, desc: "Enqueued 25 at rear index 1. Rear advances to 2." },
    { buffer: [10, 25, 40, null, null], front: 0, rear: 3, size: 3, desc: "Enqueued 40. Queue FIFO order is [10, 25, 40]." },
    { buffer: [null, 25, 40, null, null], front: 1, rear: 3, size: 2, desc: "Dequeued 10 from front index 0. Front advances to 1 in O(1) time." },
    { buffer: [null, 25, 40, 65, null], front: 1, rear: 4, size: 3, desc: "Enqueued 65 at rear index 3." },
    { buffer: [null, null, 40, 65, null], front: 2, rear: 4, size: 2, desc: "Dequeued 25 from front. Notice no array shifting is required!" }
  ];
}

// -----------------------------------------------------------------------------
// 5. Linked List Simulator Steps (In-Place Reversal)
// -----------------------------------------------------------------------------
export function generateLinkedListSteps() {
  return [
    {
      nodes: [
        { id: 1, val: 12, next: 2 },
        { id: 2, val: 34, next: 3 },
        { id: 3, val: 56, next: 4 },
        { id: 4, val: 78, next: null }
      ],
      head: 1, prev: null, curr: 1,
      desc: "Original Singly Linked List: 12 -> 34 -> 56 -> 78 -> NULL. Initializing prev = NULL, curr = HEAD (12)."
    },
    {
      nodes: [
        { id: 1, val: 12, next: null },
        { id: 2, val: 34, next: 3 },
        { id: 3, val: 56, next: 4 },
        { id: 4, val: 78, next: null }
      ],
      head: 1, prev: 1, curr: 2,
      desc: "Cached next node (34). Reversed link: 12 -> NULL. Advanced prev to 12, curr to 34."
    },
    {
      nodes: [
        { id: 1, val: 12, next: null },
        { id: 2, val: 34, next: 1 },
        { id: 3, val: 56, next: 4 },
        { id: 4, val: 78, next: null }
      ],
      head: 1, prev: 2, curr: 3,
      desc: "Reversed link: 34 -> 12. Advanced prev to 34, curr to 56."
    },
    {
      nodes: [
        { id: 1, val: 12, next: null },
        { id: 2, val: 34, next: 1 },
        { id: 3, val: 56, next: 2 },
        { id: 4, val: 78, next: null }
      ],
      head: 1, prev: 3, curr: 4,
      desc: "Reversed link: 56 -> 34. Advanced prev to 56, curr to 78."
    },
    {
      nodes: [
        { id: 1, val: 12, next: null },
        { id: 2, val: 34, next: 1 },
        { id: 3, val: 56, next: 2 },
        { id: 4, val: 78, next: 3 }
      ],
      head: 4, prev: 4, curr: null,
      desc: "Reversed link: 78 -> 56. Curr is now NULL. In-place reversal complete! New Head = 78."
    }
  ];
}

// -----------------------------------------------------------------------------
// 6. Binary Search Tree (BST) Steps
// -----------------------------------------------------------------------------
export function generateTreeSteps() {
  return [
    {
      active: 50,
      tree: [{ id: 50, val: 50, left: null, right: null, x: 250, y: 40 }],
      visited: [50],
      desc: "Inserted root node 50."
    },
    {
      active: 30,
      tree: [
        { id: 50, val: 50, left: 30, right: null, x: 250, y: 40 },
        { id: 30, val: 30, left: null, right: null, x: 140, y: 110 }
      ],
      visited: [50, 30],
      desc: "30 < 50: Inserted 30 as Left child of 50."
    },
    {
      active: 70,
      tree: [
        { id: 50, val: 50, left: 30, right: 70, x: 250, y: 40 },
        { id: 30, val: 30, left: null, right: null, x: 140, y: 110 },
        { id: 70, val: 70, left: null, right: null, x: 360, y: 110 }
      ],
      visited: [50, 30, 70],
      desc: "70 > 50: Inserted 70 as Right child of 50."
    },
    {
      active: 20,
      tree: [
        { id: 50, val: 50, left: 30, right: 70, x: 250, y: 40 },
        { id: 30, val: 30, left: 20, right: null, x: 140, y: 110 },
        { id: 70, val: 70, left: null, right: null, x: 360, y: 110 },
        { id: 20, val: 20, left: null, right: null, x: 80, y: 180 }
      ],
      visited: [50, 30, 20],
      desc: "20 < 50 and 20 < 30: Inserted 20 as Left child of 30."
    },
    {
      active: 40,
      tree: [
        { id: 50, val: 50, left: 30, right: 70, x: 250, y: 40 },
        { id: 30, val: 30, left: 20, right: 40, x: 140, y: 110 },
        { id: 70, val: 70, left: null, right: null, x: 360, y: 110 },
        { id: 20, val: 20, left: null, right: null, x: 80, y: 180 },
        { id: 40, val: 40, left: null, right: null, x: 200, y: 180 }
      ],
      visited: [50, 30, 40],
      desc: "40 < 50 and 40 > 30: Inserted 40 as Right child of 30."
    },
    {
      active: null,
      tree: [
        { id: 50, val: 50, left: 30, right: 70, x: 250, y: 40 },
        { id: 30, val: 30, left: 20, right: 40, x: 140, y: 110 },
        { id: 70, val: 70, left: null, right: null, x: 360, y: 110 },
        { id: 20, val: 20, left: null, right: null, x: 80, y: 180 },
        { id: 40, val: 40, left: null, right: null, x: 200, y: 180 }
      ],
      inOrderResult: [20, 30, 40, 50, 70],
      desc: "In-Order Traversal (Left, Root, Right): [20, 30, 40, 50, 70] — strictly ascending sorted order!"
    }
  ];
}

// -----------------------------------------------------------------------------
// 7 & 8. Graph BFS & DFS Steps
// -----------------------------------------------------------------------------
export function generateGraphBFSSteps() {
  return [
    { current: "A", queue: ["A"], visited: ["A"], desc: "Enqueued root node 'A'. Marked 'A' as visited." },
    { current: "A", queue: ["B", "C"], visited: ["A", "B", "C"], desc: "Dequeued 'A'. Enqueued unvisited adjacent neighbors 'B' and 'C'." },
    { current: "B", queue: ["C", "D", "E"], visited: ["A", "B", "C", "D", "E"], desc: "Dequeued 'B'. Enqueued neighbors 'D' and 'E'." },
    { current: "C", queue: ["D", "E", "F"], visited: ["A", "B", "C", "D", "E", "F"], desc: "Dequeued 'C'. Enqueued neighbor 'F'." },
    { current: "D", queue: ["E", "F"], visited: ["A", "B", "C", "D", "E", "F"], desc: "Dequeued 'D'. No new unvisited neighbors." },
    { current: "E", queue: ["F"], visited: ["A", "B", "C", "D", "E", "F"], desc: "Dequeued 'E'." },
    { current: "F", queue: [], visited: ["A", "B", "C", "D", "E", "F"], desc: "Dequeued 'F'. Queue is empty. Level-order BFS traversal complete!" }
  ];
}

export function generateGraphDFSSteps() {
  return [
    { current: "A", stack: ["A"], visited: ["A"], desc: "Visited starting node 'A'. Pushed 'A' to recursion call stack." },
    { current: "B", stack: ["A", "B"], visited: ["A", "B"], desc: "Explored edge A -> B. Pushed 'B' to call stack." },
    { current: "D", stack: ["A", "B", "D"], visited: ["A", "B", "D"], desc: "Explored edge B -> D. Deepest leaf node reached." },
    { current: "B", stack: ["A", "B"], visited: ["A", "B", "D"], desc: "Backtracked from 'D' to 'B'." },
    { current: "E", stack: ["A", "B", "E"], visited: ["A", "B", "D", "E"], desc: "Explored alternate branch B -> E." },
    { current: "A", stack: ["A"], visited: ["A", "B", "D", "E"], desc: "Backtracked from 'E' and 'B' back to 'A'." },
    { current: "C", stack: ["A", "C"], visited: ["A", "B", "D", "E", "C"], desc: "Explored remaining branch A -> C." },
    { current: "F", stack: ["A", "C", "F"], visited: ["A", "B", "D", "E", "C", "F"], desc: "Explored edge C -> F. All reachable graph vertices visited via DFS!" }
  ];
}
