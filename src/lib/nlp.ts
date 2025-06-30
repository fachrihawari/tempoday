// Enhanced NLP Parser for TempoDay - NO MORE REGEX HELL!
// Using proper tokenization and semantic analysis

export interface ParsedCommand {
  type: 'task' | 'note' | 'transaction' | 'unknown';
  content: string;
  amount?: number;
  transactionType?: 'income' | 'expense';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
}

// Token types for better parsing
interface Token {
  text: string;
  originalText: string; // Keep original casing
  type: 'word' | 'number' | 'currency' | 'punctuation';
  value?: number;
  position: number;
}

// Comprehensive keyword sets
const KEYWORDS = {
  task: {
    verbs: new Set([
      'call',
      'email',
      'text',
      'message',
      'contact',
      'phone',
      'buy',
      'get',
      'pick',
      'drop',
      'schedule',
      'book',
      'cancel',
      'check',
      'review',
      'verify',
      'finish',
      'complete',
      'start',
      'submit',
      'send',
      'deliver',
      'clean',
      'organize',
      'prepare',
      'research',
      'study',
      'practice',
      'fix',
      'repair',
      'update',
      'meet',
      'visit',
      'attend',
      'join',
      'remind',
      'remember',
    ]),
    contexts: new Set([
      'appointment',
      'meeting',
      'deadline',
      'task',
      'todo',
      'reminder',
      'errand',
      'chore',
      'work',
      'project',
    ]),
    imperatives: new Set([
      'need',
      'have',
      'must',
      'should',
      'remember',
      'forget',
      'make',
      'sure',
    ]),
    // Priority keywords
    priority: {
      urgent: new Set(['urgent', 'asap', 'immediately', 'critical', 'emergency', 'now']),
      high: new Set(['important', 'priority', 'high', 'soon', 'quickly', 'fast']),
      low: new Set(['later', 'sometime', 'eventually', 'low', 'minor', 'optional']),
    },
  },

  note: {
    emotional: new Set([
      'feeling',
      'felt',
      'feel',
      'happy',
      'sad',
      'excited',
      'grateful',
      'thankful',
      'proud',
      'content',
      'peaceful',
    ]),
    journaling: new Set([
      'today',
      'learned',
      'discovered',
      'realized',
      'noticed',
      'thought',
      'reflected',
      'remembered',
      'experience',
      'happened',
    ]),
    pastTense: new Set([
      'was',
      'were',
      'had',
      'did',
      'went',
      'came',
      'saw',
      'met',
    ]),
  },

  transaction: {
    expense: new Set([
      'spent',
      'spend',
      'bought',
      'purchased',
      'purchase',
      'paid',
      'pay',
      'cost',
      'costs',
      'bill',
      'fee',
      'charge',
      'ordered',
      'order',
      'delivery',
      'takeout',
      'subscription',
    ]),
    income: new Set([
      'earned',
      'earn',
      'received',
      'receive',
      'got',
      'made',
      'salary',
      'wage',
      'bonus',
      'tip',
      'refund',
      'cashback',
      'sold',
      'income',
      'payment',
      'freelance',
      'commission',
    ]),
  },
};

/**
 * MAIN PARSER FUNCTION - No more regex hell!
 */
export function parseNaturalLanguage(input: string): ParsedCommand {
  const text = input.trim();

  if (!text) {
    return { type: 'unknown', content: '', confidence: 0 };
  }

  // Step 1: Tokenize the input (preserving original casing)
  const tokens = tokenize(text);

  // Step 2: Extract amounts using proper tokenization
  const amounts = extractAmountsFromTokens(tokens);

  // Step 3: Extract priority indicators
  const priority = extractPriorityFromTokens(tokens);

  // Step 4: Calculate semantic scores (using lowercase for comparison)
  const scores = calculateSemanticScores(tokens);

  // Step 5: Determine type based on scores and context
  const result = determineType(tokens, amounts, scores);

  // Step 6: Add priority if detected
  if (priority && result.type === 'task') {
    result.priority = priority;
  }

  // Step 7: Clean and format the content using original casing
  result.content = cleanContentFromTokens(tokens, result.type, amounts[0]);

  return result;
}

/**
 * TOKENIZER - Convert text into structured tokens with original casing preserved
 */
function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const lowerWord = word.toLowerCase();

    // Handle currency with numbers: $1200, $45.50
    if (word.startsWith('$')) {
      const numberPart = word.slice(1);
      const value = parseNumber(numberPart);

      if (value !== null) {
        tokens.push({
          text: lowerWord,
          originalText: word,
          type: 'currency',
          value: value,
          position: i,
        });
        continue;
      }
    }

    // Handle pure numbers: 1200, 45.50, 1000000000000
    const numberValue = parseNumber(word);
    if (numberValue !== null) {
      tokens.push({
        text: lowerWord,
        originalText: word,
        type: 'number',
        value: numberValue,
        position: i,
      });
      continue;
    }

    // Handle punctuation
    if (/^[^\w\s]+$/.test(word)) {
      tokens.push({
        text: lowerWord,
        originalText: word,
        type: 'punctuation',
        position: i,
      });
      continue;
    }

    // Regular words - preserve original casing
    const cleanedLower = lowerWord.replace(/[^\w]/g, '');
    const cleanedOriginal = word.replace(/[^\w]/g, '');

    tokens.push({
      text: cleanedLower, // For keyword matching
      originalText: cleanedOriginal, // For display
      type: 'word',
      position: i,
    });
  }

  return tokens;
}

/**
 * ROBUST NUMBER PARSER - Handles any size number including very large ones
 */
function parseNumber(str: string): number | null {
  // Remove commas and clean the string
  const cleaned = str.replace(/,/g, '').replace(/[^\d.]/g, '');

  if (!cleaned || cleaned === '.') {
    return null;
  }

  // Parse the number
  const value = parseFloat(cleaned);

  // Validate: must be positive and finite
  // Allow any positive finite number, including very large ones
  if (isNaN(value) || !isFinite(value) || value <= 0) {
    return null;
  }

  return value;
}

/**
 * PRIORITY EXTRACTION - Extract priority indicators from tokens
 */
function extractPriorityFromTokens(tokens: Token[]): 'low' | 'medium' | 'high' | 'urgent' | null {
  const words = tokens.filter((t) => t.type === 'word').map((t) => t.text);

  // Check for urgent keywords
  for (const word of words) {
    if (KEYWORDS.task.priority.urgent.has(word)) {
      return 'urgent';
    }
  }

  // Check for high priority keywords
  for (const word of words) {
    if (KEYWORDS.task.priority.high.has(word)) {
      return 'high';
    }
  }

  // Check for low priority keywords
  for (const word of words) {
    if (KEYWORDS.task.priority.low.has(word)) {
      return 'low';
    }
  }

  return null; // Default to medium (will be set in the component)
}

/**
 * AMOUNT EXTRACTION - Using tokens instead of regex
 */
function extractAmountsFromTokens(tokens: Token[]): number[] {
  const amounts: number[] = [];

  // Create a combined set of all transaction words
  const allTransactionWords = new Set([
    ...Array.from(KEYWORDS.transaction.expense),
    ...Array.from(KEYWORDS.transaction.income),
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Direct currency tokens: $1200
    if (token.type === 'currency' && token.value) {
      amounts.push(token.value);
      continue;
    }

    // Numbers followed by currency words: 1200 dollars
    if (token.type === 'number' && token.value) {
      const nextToken = tokens[i + 1];
      if (nextToken && nextToken.type === 'word') {
        const currencyWords = ['dollars', 'dollar', 'usd', 'bucks', 'buck'];
        if (currencyWords.includes(nextToken.text)) {
          amounts.push(token.value);
          continue;
        }
      }

      // Transaction context: bought 1200, spent 45
      const prevToken = tokens[i - 1];
      if (prevToken && prevToken.type === 'word') {
        if (allTransactionWords.has(prevToken.text)) {
          amounts.push(token.value);
          continue;
        }
      }

      // For cases like "TV 40000000000000000" - if it's a standalone large number
      // and there are transaction-related words in the sentence, treat it as an amount
      if (token.value >= 1000) {
        const hasTransactionContext = tokens.some(
          (t) => t.type === 'word' && allTransactionWords.has(t.text),
        );
        if (hasTransactionContext) {
          amounts.push(token.value);
          continue;
        }
      }
    }
  }

  // Return unique amounts, prioritizing the first found
  return [...new Set(amounts)].slice(0, 1);
}

/**
 * SEMANTIC SCORING - Analyze meaning without regex (using lowercase text for matching)
 */
function calculateSemanticScores(tokens: Token[]): {
  task: number;
  note: number;
  incomeTransaction: number;
  expenseTransaction: number;
} {
  const scores = {
    task: 0,
    note: 0,
    incomeTransaction: 0,
    expenseTransaction: 0,
  };

  const words = tokens.filter((t) => t.type === 'word').map((t) => t.text); // Use lowercase for matching
  const firstWord = words[0];

  // Task scoring
  if (KEYWORDS.task.verbs.has(firstWord)) {
    scores.task += 0.6; // Strong signal for imperative
  }

  words.forEach((word, index) => {
    // Task keywords
    if (KEYWORDS.task.verbs.has(word)) {
      scores.task += index === 0 ? 0.4 : 0.2;
    }
    if (KEYWORDS.task.contexts.has(word)) {
      scores.task += 0.2;
    }
    if (KEYWORDS.task.imperatives.has(word)) {
      scores.task += 0.3;
    }

    // Priority keywords boost task score
    if (KEYWORDS.task.priority.urgent.has(word) || 
        KEYWORDS.task.priority.high.has(word) || 
        KEYWORDS.task.priority.low.has(word)) {
      scores.task += 0.3;
    }

    // Note keywords
    if (KEYWORDS.note.emotional.has(word)) {
      scores.note += 0.4;
    }
    if (KEYWORDS.note.journaling.has(word)) {
      scores.note += 0.3;
    }
    if (KEYWORDS.note.pastTense.has(word)) {
      scores.note += 0.2;
    }

    // Transaction keywords
    if (KEYWORDS.transaction.expense.has(word)) {
      scores.expenseTransaction += index < 3 ? 0.6 : 0.4;
    }
    if (KEYWORDS.transaction.income.has(word)) {
      scores.incomeTransaction += index < 3 ? 0.6 : 0.4;
    }
  });

  // Normalize scores
  Object.keys(scores).forEach((key) => {
    scores[key as keyof typeof scores] = Math.min(
      scores[key as keyof typeof scores],
      1,
    );
  });

  return scores;
}

/**
 * TYPE DETERMINATION - Smart logic without regex complexity
 */
function determineType(
  tokens: Token[],
  amounts: number[],
  scores: ReturnType<typeof calculateSemanticScores>,
): Omit<ParsedCommand, 'content'> {
  const hasAmount = amounts.length > 0;
  const maxTransactionScore = Math.max(
    scores.incomeTransaction,
    scores.expenseTransaction,
  );

  // Transaction detection
  if (hasAmount || maxTransactionScore > 0.4) {
    const transactionType =
      scores.incomeTransaction > scores.expenseTransaction
        ? 'income'
        : 'expense';
    let confidence = Math.max(
      scores.incomeTransaction,
      scores.expenseTransaction,
    );

    if (hasAmount) {
      confidence += 0.3; // Boost for having amount
    }

    return {
      type: 'transaction',
      amount: amounts[0] || 0,
      transactionType,
      confidence: Math.min(confidence, 1),
    };
  }

  // Task vs Note determination
  if (scores.task > scores.note && scores.task > 0.3) {
    return {
      type: 'task',
      confidence: scores.task,
    };
  }

  if (scores.note > 0.3) {
    return {
      type: 'note',
      confidence: scores.note,
    };
  }

  // Default logic
  const words = tokens.filter((t) => t.type === 'word').map((t) => t.text);
  const firstWord = words[0];

  if (KEYWORDS.task.verbs.has(firstWord)) {
    return { type: 'task', confidence: 0.6 };
  }

  return { type: 'note', confidence: 0.5 };
}

/**
 * IMPROVED CONTENT CLEANING - Using tokens for precision with original casing preserved
 */
function cleanContentFromTokens(
  tokens: Token[],
  type: string,
  amount?: number,
): string {
  const filteredTokens: Token[] = [];

  // Step 1: Remove action words for transactions (only first word)
  let startIndex = 0;
  if (type === 'transaction' && tokens.length > 0) {
    const firstToken = tokens[0];
    if (firstToken.type === 'word') {
      const actionWords = new Set([
        'bought',
        'buy',
        'purchased',
        'spent',
        'paid',
        'earned',
        'received',
      ]);
      if (actionWords.has(firstToken.text)) {
        // Use lowercase for matching
        startIndex = 1; // Skip the first action word
      }
    }
  }

  // Step 2: Filter out amount-related tokens and priority keywords
  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip currency tokens that match our amount
    if (token.type === 'currency' && token.value === amount) {
      continue;
    }

    // Skip number tokens that match our amount
    if (token.type === 'number' && token.value === amount) {
      // Also skip the next token if it's a currency word
      const nextToken = tokens[i + 1];
      if (nextToken && nextToken.type === 'word') {
        const currencyWords = ['dollars', 'dollar', 'usd', 'bucks', 'buck'];
        if (currencyWords.includes(nextToken.text)) {
          i++; // Skip the next token too
        }
      }
      continue;
    }

    // Skip priority keywords for tasks
    if (type === 'task' && token.type === 'word') {
      const isPriorityKeyword = 
        KEYWORDS.task.priority.urgent.has(token.text) ||
        KEYWORDS.task.priority.high.has(token.text) ||
        KEYWORDS.task.priority.low.has(token.text);
      
      if (isPriorityKeyword) {
        continue;
      }
    }

    // Skip standalone currency symbols
    if (token.type === 'punctuation' && token.originalText === '$') {
      continue;
    }

    // Keep all other tokens
    filteredTokens.push(token);
  }

  // Step 3: Remove common prefixes
  let finalTokens = filteredTokens;
  if (finalTokens.length > 0) {
    const firstToken = finalTokens[0];
    if (firstToken.type === 'word') {
      const prefixes = new Set([
        'for',
        'on',
        'at',
        'from',
        'about',
        'of',
        'a',
        'an',
        'the',
      ]);
      if (prefixes.has(firstToken.text)) {
        // Use lowercase for matching
        finalTokens = finalTokens.slice(1);
      }
    }
  }

  // Step 4: Reconstruct the text using ORIGINAL casing
  let cleaned = finalTokens
    .filter((token) => token.type === 'word')
    .map((token) => token.originalText) // Use original casing!
    .join(' ')
    .trim();

  // Step 5: Only capitalize first letter if the word isn't already capitalized
  if (cleaned.length > 0) {
    const firstChar = cleaned.charAt(0);
    if (firstChar === firstChar.toLowerCase()) {
      // Only capitalize if it's currently lowercase
      cleaned = firstChar.toUpperCase() + cleaned.slice(1);
    }
    // If it's already capitalized (like "iPhone"), leave it as is
  }

  // Fallback
  if (!cleaned || cleaned.length < 2) {
    cleaned =
      type === 'task'
        ? 'New task'
        : type === 'note'
          ? 'Daily note'
          : 'Transaction';
  }

  return cleaned;
}

// Example commands for testing (updated with priority examples)
export const EXAMPLE_COMMANDS = [
  // Tasks with priorities
  'Call dentist ASAP to schedule appointment',
  'Buy groceries for dinner',
  'Finish project report by Friday - urgent',
  'Pick up dry cleaning later',
  'Email client about meeting - important',
  'Schedule team meeting for next week',

  // Notes
  'Had a great meeting with the team today',
  'Feeling grateful for family time',
  'Learned about new productivity techniques',
  'Today was challenging but rewarding',
  "Quote: 'Success is not final, failure is not fatal'",
  "Reflecting on this week's accomplishments",

  // Transactions
  'Spent $45 on groceries',
  'Bought coffee for $4.50',
  'Paid $120 for electricity bill',
  'Earned $500 from freelance project',
  'Received $25 cashback',
  '$1200 salary payment received',
  'Purchased lunch $12',
  'Spend $30 on gas',
  'Bought apple TV $300000',
  'Bought iPhone $1200',
  'Bought Apple TV 1000000000000',
  'TV 40000000000000000',
  'Bought TV 40000000000000000',
];