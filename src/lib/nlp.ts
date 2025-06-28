// Enhanced Custom NLP Parser for TempoDay (English Only)
// Optimized for task, note, and transaction detection

export interface ParsedCommand {
  type: 'task' | 'note' | 'transaction' | 'unknown';
  content: string;
  amount?: number;
  transactionType?: 'income' | 'expense';
  confidence: number;
}

// Comprehensive English keyword sets
const TASK_KEYWORDS = {
  actionVerbs: [
    'call', 'email', 'text', 'message', 'contact', 'phone',
    'buy', 'get', 'pick up', 'pickup', 'drop off', 'dropoff',
    'schedule', 'book', 'cancel', 'confirm', 'reschedule',
    'check', 'review', 'verify', 'validate', 'inspect',
    'finish', 'complete', 'start', 'begin', 'continue',
    'submit', 'send', 'deliver', 'ship', 'mail',
    'clean', 'organize', 'prepare', 'plan', 'arrange',
    'research', 'study', 'practice', 'learn', 'read',
    'fix', 'repair', 'update', 'install', 'setup',
    'meet', 'visit', 'attend', 'join', 'participate'
  ],
  contexts: [
    'appointment', 'meeting', 'deadline', 'task', 'todo',
    'reminder', 'errand', 'chore', 'work', 'project',
    'assignment', 'homework', 'report', 'presentation',
    'interview', 'consultation', 'checkup', 'service'
  ],
  imperatives: [
    'need to', 'have to', 'must', 'should', 'remember to',
    'don\'t forget', 'make sure', 'be sure to'
  ]
};

const NOTE_KEYWORDS = {
  emotional: [
    'feeling', 'felt', 'feel', 'emotion', 'mood',
    'happy', 'sad', 'excited', 'nervous', 'anxious',
    'grateful', 'thankful', 'blessed', 'lucky',
    'proud', 'disappointed', 'frustrated', 'content',
    'peaceful', 'stressed', 'relaxed', 'energized'
  ],
  journaling: [
    'today was', 'today i', 'had a', 'went to',
    'learned', 'discovered', 'realized', 'noticed',
    'thought about', 'reflected on', 'remembered',
    'quote', 'insight', 'idea', 'inspiration',
    'experience', 'happened', 'occurred', 'witnessed'
  ],
  pastTense: [
    'was', 'were', 'had', 'did', 'went', 'came',
    'saw', 'met', 'talked', 'discussed', 'shared',
    'enjoyed', 'loved', 'hated', 'liked', 'disliked'
  ],
  reflective: [
    'thinking about', 'pondering', 'considering',
    'grateful for', 'thankful for', 'appreciate',
    'looking forward', 'hoping', 'wishing', 'dreaming'
  ]
};

const TRANSACTION_KEYWORDS = {
  income: [
    'earned', 'received', 'got paid', 'salary', 'wage',
    'bonus', 'tip', 'tips', 'refund', 'cashback',
    'sold', 'income', 'payment', 'freelance',
    'commission', 'dividend', 'interest', 'profit',
    'gift', 'won', 'prize', 'reward', 'rebate',
    'made', 'revenue', 'earnings', 'paycheck'
  ],
  expense: [
    'spent', 'spend', 'bought', 'purchased', 'purchase',
    'paid', 'pay', 'cost', 'costs', 'expense', 'expenses',
    'bill', 'bills', 'fee', 'fees', 'charge', 'charges',
    'subscription', 'rent', 'mortgage', 'insurance', 'tax', 'taxes',
    'gas', 'fuel', 'food', 'groceries', 'restaurant',
    'coffee', 'lunch', 'dinner', 'breakfast', 'snack',
    'shopping', 'clothes', 'clothing', 'shoes',
    'entertainment', 'movie', 'concert', 'show',
    'uber', 'taxi', 'transport', 'parking', 'toll',
    'medical', 'doctor', 'pharmacy', 'medicine',
    'utilities', 'electricity', 'water', 'internet',
    'ordered', 'order', 'delivery', 'takeout'
  ]
};

// Grammar patterns
const PRONOUNS = ['i ', 'my ', 'me ', 'myself', 'we ', 'us ', 'our '];
const ARTICLES = ['a ', 'an ', 'the '];
const PREPOSITIONS = ['on ', 'for ', 'to ', 'at ', 'from ', 'in ', 'with '];

/**
 * Enhanced English-only parser with improved accuracy
 */
export function parseNaturalLanguage(input: string): ParsedCommand {
  const text = input.toLowerCase().trim();
  
  if (!text) {
    return {
      type: 'unknown',
      content: '',
      confidence: 0
    };
  }

  // Extract monetary amounts
  const amounts = extractAmounts(text);
  const hasAmount = amounts.length > 0;
  
  // Calculate confidence scores for each type
  const taskScore = calculateTaskScore(text);
  const noteScore = calculateNoteScore(text);
  const incomeScore = calculateTransactionScore(text, 'income');
  const expenseScore = calculateTransactionScore(text, 'expense');
  
  // Transaction detection (prioritized when amount is present OR strong transaction keywords)
  const maxTransactionScore = Math.max(incomeScore, expenseScore);
  
  if (hasAmount || maxTransactionScore > 0.4) {
    const transactionType = incomeScore > expenseScore ? 'income' : 'expense';
    let confidence = Math.max(incomeScore, expenseScore);
    
    // Boost confidence if amount is present
    if (hasAmount) {
      confidence += 0.3;
    }
    
    // If we have strong transaction keywords but no amount, still treat as transaction
    if (!hasAmount && maxTransactionScore > 0.4) {
      confidence = maxTransactionScore;
    }
    
    return {
      type: 'transaction',
      content: cleanTransactionDescription(text, amounts[0]),
      amount: amounts[0] || 0,
      transactionType,
      confidence: Math.min(confidence, 1)
    };
  }
  
  // Compare task vs note scores
  const scores = [
    { type: 'task' as const, score: taskScore },
    { type: 'note' as const, score: noteScore }
  ];
  
  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0];
  
  // If we have a clear winner with decent confidence, use it
  if (winner.score > 0.3) {
    return {
      type: winner.type,
      content: cleanContent(text, winner.type),
      confidence: winner.score
    };
  }
  
  // Default logic for edge cases
  if (hasImperativeStructure(text) || startsWithActionVerb(text)) {
    return {
      type: 'task',
      content: cleanContent(text, 'task'),
      confidence: 0.6
    };
  }
  
  // Default to note for everything else
  return {
    type: 'note',
    content: cleanContent(text, 'note'),
    confidence: 0.5
  };
}

/**
 * Calculate task confidence score
 */
function calculateTaskScore(text: string): number {
  let score = 0;
  const words = text.split(/\s+/);
  
  // Check for action verbs (especially at the beginning)
  const firstWord = words[0];
  if (TASK_KEYWORDS.actionVerbs.includes(firstWord)) {
    score += 0.5;
  }
  
  // Check for action verbs anywhere in text
  const hasActionVerb = TASK_KEYWORDS.actionVerbs.some(verb => 
    text.includes(verb)
  );
  if (hasActionVerb && !TASK_KEYWORDS.actionVerbs.includes(firstWord)) {
    score += 0.3;
  }
  
  // Check for task contexts
  const hasTaskContext = TASK_KEYWORDS.contexts.some(context => 
    text.includes(context)
  );
  if (hasTaskContext) {
    score += 0.2;
  }
  
  // Check for imperative indicators
  const hasImperative = TASK_KEYWORDS.imperatives.some(imp => 
    text.includes(imp)
  );
  if (hasImperative) {
    score += 0.3;
  }
  
  // Boost for imperative sentence structure
  if (hasImperativeStructure(text)) {
    score += 0.2;
  }
  
  // Penalty for past tense (more likely to be a note)
  if (hasPastTenseIndicators(text)) {
    score -= 0.2;
  }
  
  // Penalty for transaction keywords (avoid conflicts)
  if (hasTransactionKeywords(text)) {
    score -= 0.3;
  }
  
  return Math.max(0, Math.min(score, 1));
}

/**
 * Calculate note confidence score
 */
function calculateNoteScore(text: string): number {
  let score = 0;
  
  // Check for emotional language
  const hasEmotional = NOTE_KEYWORDS.emotional.some(word => 
    text.includes(word)
  );
  if (hasEmotional) {
    score += 0.4;
  }
  
  // Check for journaling indicators
  const hasJournaling = NOTE_KEYWORDS.journaling.some(phrase => 
    text.includes(phrase)
  );
  if (hasJournaling) {
    score += 0.3;
  }
  
  // Check for past tense (journal-like)
  if (hasPastTenseIndicators(text)) {
    score += 0.2;
  }
  
  // Check for reflective language
  const hasReflective = NOTE_KEYWORDS.reflective.some(phrase => 
    text.includes(phrase)
  );
  if (hasReflective) {
    score += 0.3;
  }
  
  // Boost for personal pronouns (more personal/journal-like)
  if (hasPersonalPronouns(text)) {
    score += 0.1;
  }
  
  // Penalty for imperative structure (more likely to be a task)
  if (hasImperativeStructure(text)) {
    score -= 0.3;
  }
  
  // Penalty for transaction keywords (avoid conflicts)
  if (hasTransactionKeywords(text)) {
    score -= 0.3;
  }
  
  return Math.max(0, Math.min(score, 1));
}

/**
 * Calculate transaction confidence score
 */
function calculateTransactionScore(text: string, type: 'income' | 'expense'): number {
  const keywords = TRANSACTION_KEYWORDS[type];
  
  let score = 0;
  
  // Check for transaction keywords with exact word matching
  const hasKeyword = keywords.some(keyword => {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });
  
  if (hasKeyword) {
    score += 0.6;
  }
  
  // Boost if keyword appears early in the sentence
  const words = text.split(/\s+/);
  const earlyKeyword = keywords.some(keyword => 
    words.slice(0, 3).some(word => word.toLowerCase().includes(keyword.toLowerCase()))
  );
  if (earlyKeyword) {
    score += 0.2;
  }
  
  // Additional boost for common transaction patterns
  if (type === 'expense') {
    // Common expense patterns
    if (text.match(/\b(bought|purchased|paid for|spent on)\b/i)) {
      score += 0.3;
    }
    if (text.match(/\$([\d,]+\.?\d*)/)) {
      score += 0.2;
    }
  } else if (type === 'income') {
    // Common income patterns
    if (text.match(/\b(earned|received|got paid|made)\b/i)) {
      score += 0.3;
    }
  }
  
  return Math.min(score, 1);
}

/**
 * Extract monetary amounts from text - FIXED FOR LARGE NUMBERS
 */
function extractAmounts(text: string): number[] {
  const amounts: number[] = [];
  
  // Enhanced patterns that handle very large numbers
  const patterns = [
    // $1000000000000, $1200, $45.50 (with optional commas)
    /\$(\d{1,3}(?:,?\d{3})*(?:\.\d{1,2})?)/g,
    // 1000000000000 dollars, 1200 USD, 45 bucks (with optional commas)
    /(\d{1,3}(?:,?\d{3})*(?:\.\d{1,2})?)\s*(?:dollars?|usd|bucks?)\b/gi,
    // After transaction words: bought 1000000000000, spent 45
    /\b(?:bought|spent|paid|cost|earned|received)\s+[^\d]*?(\d{1,3}(?:,?\d{3})*(?:\.\d{1,2})?)/gi,
    // Standalone large numbers that could be amounts
    /\b(\d{4,}(?:\.\d{1,2})?)\b/g
  ];
  
  for (const pattern of patterns) {
    let match;
    // Reset regex lastIndex to avoid issues with global flag
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(text)) !== null) {
      const amountStr = match[1].replace(/,/g, ''); // Remove commas
      const amount = parseFloat(amountStr);
      
      // Validate the amount - only check if it's a valid positive number
      // Remove arbitrary upper limit to allow very large numbers
      if (!isNaN(amount) && amount > 0 && isFinite(amount)) {
        amounts.push(amount);
      }
    }
  }
  
  // Remove duplicates and return
  return [...new Set(amounts)];
}

/**
 * Check if text has transaction keywords
 */
function hasTransactionKeywords(text: string): boolean {
  const allTransactionKeywords = [
    ...TRANSACTION_KEYWORDS.income,
    ...TRANSACTION_KEYWORDS.expense
  ];
  
  return allTransactionKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });
}

/**
 * Check if text has imperative sentence structure
 */
function hasImperativeStructure(text: string): boolean {
  const words = text.split(/\s+/);
  const firstWord = words[0];
  
  return TASK_KEYWORDS.actionVerbs.includes(firstWord);
}

/**
 * Check if text starts with an action verb
 */
function startsWithActionVerb(text: string): boolean {
  const firstWord = text.split(/\s+/)[0];
  return TASK_KEYWORDS.actionVerbs.includes(firstWord);
}

/**
 * Check for past tense indicators
 */
function hasPastTenseIndicators(text: string): boolean {
  return NOTE_KEYWORDS.pastTense.some(indicator => text.includes(indicator));
}

/**
 * Check for personal pronouns
 */
function hasPersonalPronouns(text: string): boolean {
  return PRONOUNS.some(pronoun => text.includes(pronoun));
}

/**
 * Clean and format content for display
 */
function cleanContent(text: string, type: string): string {
  let cleaned = text;
  
  // Remove common prefixes based on type
  const taskPrefixes = [
    'add task', 'create task', 'new task', 'task:',
    ...TASK_KEYWORDS.imperatives
  ];
  
  const notePrefixes = [
    'add note', 'write note', 'note:', 'journal:',
    ...NOTE_KEYWORDS.journaling.slice(0, 5)
  ];
  
  const prefixes = type === 'task' ? taskPrefixes : notePrefixes;
  
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // Remove leading articles and prepositions
  for (const word of [...ARTICLES, ...PREPOSITIONS]) {
    if (cleaned.startsWith(word)) {
      cleaned = cleaned.substring(word.length);
      break;
    }
  }
  
  // Ensure proper capitalization
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Fallback if content becomes empty
  if (!cleaned.trim()) {
    cleaned = type === 'task' ? 'New task' : 'Daily note';
  }
  
  return cleaned;
}

/**
 * Clean transaction description - ENHANCED FOR LARGE NUMBERS
 */
function cleanTransactionDescription(text: string, amount?: number): string {
  let cleaned = text;
  
  // Remove the amount from description if present
  if (amount) {
    // Create patterns to remove the amount (with or without commas)
    const amountStr = amount.toString();
    const amountWithCommas = amount.toLocaleString('en-US');
    
    // Remove various amount formats
    const amountPatterns = [
      new RegExp(`\\$${amountStr}\\b`, 'gi'),
      new RegExp(`\\$${amountWithCommas}\\b`, 'gi'),
      new RegExp(`\\b${amountStr}\\s*(?:dollars?|usd|bucks?)\\b`, 'gi'),
      new RegExp(`\\b${amountWithCommas}\\s*(?:dollars?|usd|bucks?)\\b`, 'gi'),
      new RegExp(`\\b${amountStr}\\b`, 'gi'),
      new RegExp(`\\b${amountWithCommas}\\b`, 'gi')
    ];
    
    for (const pattern of amountPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }
  }
  
  // Remove transaction action words from the beginning
  const actionWords = ['bought', 'buy', 'purchased', 'purchase', 'spent', 'spend', 'paid', 'pay', 'cost', 'earned', 'received', 'got', 'made', 'sold'];
  
  for (const word of actionWords) {
    const regex = new RegExp(`^${word}\\s+`, 'i');
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, '');
      break;
    }
  }
  
  // Remove common prepositions from the beginning
  const prepositions = ['for', 'on', 'at', 'from', 'about', 'of'];
  for (const prep of prepositions) {
    const regex = new RegExp(`^${prep}\\s+`, 'i');
    cleaned = cleaned.replace(regex, '');
  }
  
  // Clean up extra whitespace and symbols
  cleaned = cleaned.replace(/[\$€£¥]/g, ''); // Remove currency symbols
  cleaned = cleaned.replace(/\s+/g, ' ').trim(); // Normalize whitespace
  
  // Ensure proper capitalization
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Provide fallback description
  if (!cleaned.trim() || cleaned.length < 2) {
    cleaned = 'Transaction';
  }
  
  return cleaned;
}

// Example commands for testing
export const EXAMPLE_COMMANDS = [
  // Tasks
  "Call dentist to schedule appointment",
  "Buy groceries for dinner",
  "Finish project report by Friday",
  "Pick up dry cleaning",
  "Email client about meeting",
  "Schedule team meeting for next week",
  
  // Notes
  "Had a great meeting with the team today",
  "Feeling grateful for family time",
  "Learned about new productivity techniques",
  "Today was challenging but rewarding",
  "Quote: 'Success is not final, failure is not fatal'",
  "Reflecting on this week's accomplishments",
  
  // Transactions
  "Spent $45 on groceries",
  "Bought coffee for $4.50",
  "Paid $120 for electricity bill",
  "Earned $500 from freelance project",
  "Received $25 cashback",
  "$1200 salary payment received",
  "Purchased lunch $12",
  "Spend $30 on gas",
  "Bought apple TV $300000",
  "Bought iPhone $1200",
  "Bought Apple TV 1000000000000"
];