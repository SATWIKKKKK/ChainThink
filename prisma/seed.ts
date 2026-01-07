import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const problems = [
  {
    title: 'Fibonacci Number',
    description: `Write a function to calculate the nth Fibonacci number.

The Fibonacci sequence is defined as:
- fib(0) = 0
- fib(1) = 1
- fib(n) = fib(n-1) + fib(n-2) for n > 1

Example:
fib(0) = 0
fib(1) = 1
fib(5) = 5
fib(10) = 55

Your task: Implement an efficient solution using dynamic programming.`,
    difficulty: 1,
    topic: 'dynamic-programming',
    orderIndex: 1,
    hints: [
      {
        level: 1,
        text: 'Start by identifying the base cases. What are the simplest inputs where you know the answer immediately?',
      },
      {
        level: 2,
        text: 'How does fib(n) relate to fib(n-1) and fib(n-2)? Can you express this as a formula?',
      },
      {
        level: 3,
        text: "Try calculating fib(4) by hand using recursion. Do you notice you're computing the same values multiple times?",
      },
      {
        level: 4,
        text: 'Here are the base cases:\nif n <= 1: return n\n\nNow, how would you build up from these base cases to avoid repeated calculations?',
      },
    ],
    solution: {
      approach: 'bottom-up dynamic programming',
      keyInsight: 'Build from base cases upward, storing previous results',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) with optimization, O(n) with array',
    },
  },
  {
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:
Input: n = 2
Output: 2
Explanation: Two ways: 1+1, or 2

Example 2:
Input: n = 3
Output: 3
Explanation: Three ways: 1+1+1, 1+2, or 2+1

Constraints: 1 ≤ n ≤ 45`,
    difficulty: 2,
    topic: 'dynamic-programming',
    orderIndex: 2,
    hints: [
      {
        level: 1,
        text: 'Start small. If there are 3 steps, can you list all possible ways to climb them?',
      },
      {
        level: 2,
        text: "Think about your first move. You can take 1 step or 2 steps. After that first move, what's left?",
      },
      {
        level: 3,
        text: 'If you take 1 step first, you have (n-1) steps remaining. If you take 2 steps first, you have (n-2) steps remaining. How does this help?',
      },
      {
        level: 4,
        text: 'The relationship is: ways(n) = ways(n-1) + ways(n-2)\nWhat are your base cases for n=1 and n=2?',
      },
    ],
    solution: {
      approach: 'bottom-up dynamic programming',
      keyInsight: 'Same structure as Fibonacci - each state depends on previous two',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) optimal',
    },
  },
  {
    title: 'House Robber',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed.

The constraint: Adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses are broken into on the same night.

Given an integer array nums representing the amount of money in each house, return the maximum amount of money you can rob tonight without alerting the police.

Example 1:
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) then house 3 (money = 3). Total = 1 + 3 = 4.

Example 2:
Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (2), house 3 (9), and house 5 (1). Total = 2 + 9 + 1 = 12.`,
    difficulty: 3,
    topic: 'dynamic-programming',
    orderIndex: 3,
    hints: [
      {
        level: 1,
        text: "For the first house, you have a simple choice: rob it or don't rob it. What does each choice leave you with?",
      },
      {
        level: 2,
        text: "When you're at house i, what are your two options? If you rob house i, what constraint does that create?",
      },
      {
        level: 3,
        text: 'If you rob house i, you get nums[i] + max money from houses up to i-2. If you skip house i, you get max money from houses up to i-1. Which should you choose?',
      },
      {
        level: 4,
        text: 'Try this formula:\ndp[i] = max(dp[i-1], nums[i] + dp[i-2])\n\nWhat are your base cases for dp[0] and dp[1]?',
      },
    ],
    solution: {
      approach: 'dynamic programming with choice optimization',
      keyInsight: 'At each house, choose max between robbing or not robbing',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1) with two variables',
    },
  },
  {
    title: 'Coin Change',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins needed to make up that amount. If that amount cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.

Example 1:
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1

Example 2:
Input: coins = [2], amount = 3
Output: -1
Explanation: Cannot make 3 with only coins of value 2

Example 3:
Input: coins = [1], amount = 0
Output: 0`,
    difficulty: 3,
    topic: 'dynamic-programming',
    orderIndex: 4,
    hints: [
      {
        level: 1,
        text: 'Start with the smallest amounts. How many coins do you need to make amount 0? Amount 1?',
      },
      {
        level: 2,
        text: "To make amount 11, you could use a coin of value 5, which means you'd need to make amount 6 next. Or use a coin of value 2, meaning you'd need amount 9. See the pattern?",
      },
      {
        level: 3,
        text: 'For each amount, try using each coin. If you use a coin of value c, you need to solve for (amount - c). Take the minimum across all coin choices.',
      },
      {
        level: 4,
        text: 'Build a DP array where dp[i] = minimum coins to make amount i.\n\nFor each amount, try each coin:\ndp[amount] = min(dp[amount], 1 + dp[amount - coin])',
      },
    ],
    solution: {
      approach: 'bottom-up DP with iteration over choices',
      keyInsight: 'Build up from amount 0, trying each coin at each step',
      timeComplexity: 'O(amount * coins.length)',
      spaceComplexity: 'O(amount)',
    },
  },
  {
    title: 'Longest Common Subsequence',
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

Example 1:
Input: text1 = "abcde", text2 = "ace"
Output: 3
Explanation: The longest common subsequence is "ace" with length 3.

Example 2:
Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: The longest common subsequence is "abc" with length 3.

Example 3:
Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: No common subsequence.`,
    difficulty: 4,
    topic: 'dynamic-programming',
    orderIndex: 5,
    hints: [
      {
        level: 1,
        text: 'Start with the last characters of both strings. What happens if they match? What if they don\'t?',
      },
      {
        level: 2,
        text: 'If the last characters match, they\'re part of the LCS. If they don\'t match, the LCS comes from either removing the last char of text1 OR removing the last char of text2.',
      },
      {
        level: 3,
        text: 'Try building a 2D table where dp[i][j] represents LCS length of text1[0...i] and text2[0...j]. What would dp[0][0] be?',
      },
      {
        level: 4,
        text: 'The recurrence:\n\nIf text1[i] == text2[j]:\n  dp[i][j] = 1 + dp[i-1][j-1]\nElse:\n  dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      },
    ],
    solution: {
      approach: '2D dynamic programming',
      keyInsight: 'Build table comparing all prefixes of both strings',
      timeComplexity: 'O(m * n)',
      spaceComplexity: 'O(m * n), optimizable to O(min(m,n))',
    },
  },
  {
    title: '0/1 Knapsack',
    description: `You are given weights and values of n items. Put these items in a knapsack of capacity W to get the maximum total value.

You cannot break an item - you either take it completely or don't take it (0/1 property).

Input:
- values[] = array of values
- weights[] = array of weights
- W = knapsack capacity

Example:
values = [60, 100, 120]
weights = [10, 20, 30]
W = 50

Output: 220
Explanation: Take items with value 100 and 120 (weights 20 + 30 = 50)`,
    difficulty: 4,
    topic: 'dynamic-programming',
    orderIndex: 6,
    hints: [
      {
        level: 1,
        text: 'For each item, you have two choices: include it or exclude it. What determines which choice is better?',
      },
      {
        level: 2,
        text: 'If you include item i (weight w[i], value v[i]), you get v[i] plus the best value you can get with remaining capacity (W - w[i]). How does this help?',
      },
      {
        level: 3,
        text: 'Build a 2D table: dp[i][w] = max value using first i items with capacity w. What are your base cases?',
      },
      {
        level: 4,
        text: 'Recurrence:\n\nIf weight[i] <= w:\n  dp[i][w] = max(\n    dp[i-1][w],  // don\'t take item\n    value[i] + dp[i-1][w-weight[i]]  // take item\n  )\nElse:\n  dp[i][w] = dp[i-1][w]',
      },
    ],
    solution: {
      approach: '2D DP with choice optimization',
      keyInsight: 'For each item and capacity, choose to include or exclude',
      timeComplexity: 'O(n * W)',
      spaceComplexity: 'O(n * W), optimizable to O(W)',
    },
  },
  {
    title: 'Edit Distance',
    description: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted:
- Insert a character
- Delete a character
- Replace a character

Example 1:
Input: word1 = "horse", word2 = "ros"
Output: 3
Explanation:
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')

Example 2:
Input: word1 = "intention", word2 = "execution"
Output: 5`,
    difficulty: 5,
    topic: 'dynamic-programming',
    orderIndex: 7,
    hints: [
      {
        level: 1,
        text: 'Start with small examples. How many operations to convert "" (empty) to "abc"? How about "a" to ""?',
      },
      {
        level: 2,
        text: 'If the last characters of both words match, you don\'t need any operation for them. What if they don\'t match?',
      },
      {
        level: 3,
        text: 'When characters don\'t match, you have 3 choices:\n1. Replace last char of word1\n2. Delete last char of word1\n3. Insert last char of word2 into word1\n\nWhich one leads to the minimum total operations?',
      },
      {
        level: 4,
        text: 'Build dp[i][j] = min operations to convert word1[0...i] to word2[0...j]\n\nIf word1[i] == word2[j]:\n  dp[i][j] = dp[i-1][j-1]\nElse:\n  dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])',
      },
    ],
    solution: {
      approach: '2D DP with multiple choices',
      keyInsight: 'At each position, consider all edit operations and take minimum',
      timeComplexity: 'O(m * n)',
      spaceComplexity: 'O(m * n)',
    },
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.problemSession.deleteMany();
  await prisma.problem.deleteMany();

  // Seed problems
  for (const problem of problems) {
    await prisma.problem.create({
      data: problem,
    });
  }

  console.log(`✅ Seeded ${problems.length} problems`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });