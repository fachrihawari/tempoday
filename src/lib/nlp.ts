// Enhanced Custom NLP Parser for TempoDay
// Optimized for mobile performance and specific command patterns

export interface ParsedCommand {
  type: 'task' | 'note' | 'transaction' | 'unknown';
  content: string;
  amount?: number;
  transactionType?: 'income' | 'expense';
  confidence: number;
}

// Comprehensive keyword sets for accurate classification
const TASK_KEYWORDS = {
  // Action verbs (high confidence indicators)
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
  
  // Task-related nouns and contexts
  contexts: [
    'appointment', 'meeting', 'deadline', 'task', 'todo',
    'reminder', 'errand', 'chore', 'work', 'project',
    'assignment', 'homework', 'report', 'presentation',
    'interview', 'consultation', 'checkup', 'service'
  ],
  
  // Imperative indicators
  imperatives: [
    'need to', 'have to', 'must', 'should', 'remember to',
    'don\'t forget', 'make sure', 'be sure to'
  ]
};

const NOTE_KEYWORDS = {
  // Emotional and reflective language
  emotional: [
    'feeling', 'felt', 'feel', 'emotion', 'mood',
    'happy', 'sad', 'excited', 'nervous', 'anxious',
    'grateful', 'thankful', 'blessed', 'lucky',
    'proud', 'disappointed', 'frustrated', 'content',
    'peaceful', 'stressed', 'relaxed', 'energized'
  ],
  
  // Journal/diary indicators
  journaling: [
    'today was', 'today i', 'had a', 'went to',
    'learned', 'discovered', 'realized', 'noticed',
    'thought about', 'reflected on', 'remembered',
    'quote', 'insight', 'idea', 'inspiration',
    'experience', 'happened', 'occurred', 'witnessed'
  ],
  
  // Past tense indicators (journal-like)
  pastTense: [
    'was', 'were', 'had', 'did', 'went', 'came',
    'saw', 'met', 'talked', 'discussed', 'shared',
    'enjoyed', 'loved', 'hated', 'liked', 'disliked'
  ],
  
  // Reflective phrases
  reflective: [
    'thinking about', 'pondering', 'considering',
    'grateful for', 'thankful for', 'appreciate',
    'looking forward', 'hoping', 'wishing', 'dreaming'
  ]
};

const TRANSACTION_KEYWORDS = {
  // Income indicators
  income: [
    'earned', 'received', 'got paid', 'salary', 'wage',
    'bonus', 'tip', 'tips', 'refund', 'cashback',
    'sold', 'income', 'payment', 'freelance',
    'commission', 'dividend', 'interest', 'profit',
    'gift', 'won', 'prize', 'reward', 'rebate'
  ],
  
  // Expense indicators
  expense: [
    'spent', 'bought', 'purchased', 'paid', 'cost',
    'expense', 'bill', 'fee', 'charge', 'subscription',
    'rent', 'mortgage', 'insurance', 'tax', 'taxes',
    'gas', 'fuel', 'food', 'groceries', 'restaurant',
    'coffee', 'lunch', 'dinner', 'breakfast', 'snack',
    'shopping', 'clothes', 'clothing', 'shoes',
    'entertainment', 'movie', 'concert', 'show',
    'uber', 'taxi', 'transport', 'parking', 'toll',
    'medical', 'doctor', 'pharmacy', 'medicine',
    'utilities', 'electricity', 'water', 'internet'
  ]
};

/**
 * Enhanced custom parser optimized for TempoDay command patterns
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

  // Extract monetary amounts first
  const amounts = extractAmounts(text);
  const hasAmount = amounts.length > 0;
  
  // Calculate confidence scores for each type
  const taskScore = calculateTaskScore(text);
  const noteScore = calculateNoteScore(text);
  const incomeScore = calculateTransactionScore(text, 'income');
  const expenseScore = calculateTransactionScore(text, 'expense');
  
  // Transaction detection (prioritized when amount is present)
  if (hasAmount && (incomeScore > 0.2 || expenseScore > 0.2)) {
    const transactionType = incomeScore > expenseScore ? 'income' : 'expense';
    const confidence = Math.max(incomeScore, expenseScore) + (hasAmount ? 0.3 : 0);
    
    return {
      type: 'transaction',
      content: cleanTransactionDescription(text, amounts[0]),
      amount: amounts[0],
      transactionType,
      confidence: Math.min(confidence, 1)
    };
  }
  
  // Compare task vs note scores
  const scores = [
    { type: 'task' as const, score: taskScore },
    { type: 'note' as const, score: noteScore }
  ];
  
  // Sort by score (highest first)
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
 * Calculate task confidence score using multiple indicators
 */
function calculateTaskScore(text: string): number {
  let score = 0;
  const words = text.split(/\s+/);
  
  // Check for action verbs (especially at the beginning)
  const firstWord = words[0];
  if (TASK_KEYWORDS.actionVerbs.includes(firstWord)) {
    score += 0.5; // High confidence for starting with action verb
  }
  
  // Check for action verbs anywhere in text
  const hasActionVerb = TASK_KEYWORDS.actionVerbs.some(verb => 
    text.includes(verb)
  );
  if (hasActionVerb && !TASK_KEYWORDS.actionVerbs.includes(firstWord)) {
    score += 0.3; // Lower confidence if not at start
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
  
  return Math.max(0, Math.min(score, 1));
}

/**
 * Calculate note confidence score using emotional and reflective indicators
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
  
  return Math.max(0, Math.min(score, 1));
}

/**
 * Calculate transaction confidence score
 */
function calculateTransactionScore(text: string, type: 'income' | 'expense'): number {
  const keywords = type === 'income' 
    ? TRANSACTION_KEYWORDS.income 
    : TRANSACTION_KEYWORDS.expense;
  
  let score = 0;
  
  // Check for transaction keywords
  const hasKeyword = keywords.some(keyword => text.includes(keyword));
  if (hasKeyword) {
    score += 0.6;
  }
  
  // Boost if keyword appears early in the sentence
  const words = text.split(/\s+/);
  const earlyKeyword = keywords.some(keyword => 
    words.slice(0, 3).some(word => word.includes(keyword))
  );
  if (earlyKeyword) {
    score += 0.2;
  }
  
  return Math.min(score, 1);
}

/**
 * Extract monetary amounts from text using comprehensive patterns
 */
function extractAmounts(text: string): number[] {
  const amounts: number[] = [];
  
  // Multiple regex patterns for different money formats
  const patterns = [
    // $50, $1,234.56, $1234.56
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,
    // 50 dollars, 1234.56 dollars
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd|bucks?)/g,
    // Just numbers when in transaction context
    /(?:spent|paid|cost|earned|received|got)\s+.*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0 && amount < 1000000) { // Reasonable limits
        amounts.push(amount);
      }
    }
  }
  
  // Remove duplicates and return
  return [...new Set(amounts)];
}

/**
 * Check if text has imperative sentence structure
 */
function hasImperativeStructure(text: string): boolean {
  const words = text.split(/\s+/);
  const firstWord = words[0];
  
  // Common imperative starters
  const imperativeStarters = [
    'call', 'buy', 'get', 'pick', 'schedule', 'book', 'finish',
    'complete', 'start', 'check', 'review', 'send', 'email',
    'text', 'contact', 'clean', 'organize', 'prepare', 'plan'
  ];
  
  return imperativeStarters.includes(firstWord);
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
 * Check for personal pronouns (indicates personal/journal content)
 */
function hasPersonalPronouns(text: string): boolean {
  const pronouns = ['i ', 'my ', 'me ', 'myself', 'we ', 'us ', 'our '];
  return pronouns.some(pronoun => text.includes(pronoun));
}

/**
 * Clean and format content for display
 */
function cleanContent(text: string, type: string): string {
  let cleaned = text;
  
  // Remove common prefixes based on type
  const prefixes = [
    // Task prefixes
    'add task', 'create task', 'new task', 'task:',
    'remind me to', 'remember to', 'need to', 'have to',
    'i need to', 'i have to', 'i should', 'i must',
    
    // Note prefixes
    'add note', 'write note', 'note:', 'journal:',
    'today i', 'i am', 'i was', 'i feel', 'i felt',
    
    // Transaction prefixes (handled separately)
    'spent', 'paid', 'bought', 'earned', 'received'
  ];
  
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // Remove leading articles and prepositions
  const leadingWords = ['a ', 'an ', 'the ', 'on ', 'for ', 'to ', 'at '];
  for (const word of leadingWords) {
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
 * Clean transaction description by removing amount and common prefixes
 */
function cleanTransactionDescription(text: string, amount: number): string {
  let cleaned = text;
  
  // Remove the amount from description
  const amountPatterns = [
    new RegExp(`\\$?${amount}(?:\\.\\d{2})?`, 'gi'),
    new RegExp(`${amount}\\s*(?:dollars?|usd|bucks?)`, 'gi')
  ];
  
  for (const pattern of amountPatterns) {
    cleaned = cleaned.replace(pattern, '').trim();
  }
  
  // Remove transaction prefixes
  const transactionPrefixes = [
    'spent', 'paid', 'bought', 'purchased', 'cost',
    'earned', 'received', 'got paid', 'got',
    'for', 'on', 'at', 'from'
  ];
  
  for (const prefix of transactionPrefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // Clean up extra words
  cleaned = cleaned.replace(/^(for|on|at|from)\s+/i, '');
  
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

// Example commands for testing and documentation
export const EXAMPLE_COMMANDS = [
  // Tasks
  "Call dentist to schedule appointment",
  "Buy groceries for dinner",
  "Finish project report by Friday",
  "Pick up dry cleaning",
  "Email client about meeting",
  "Schedule car maintenance",
  "Book flight for vacation",
  "Review quarterly budget",
  "Prepare presentation slides",
  "Submit expense report",
  
  // Notes
  "Had a great meeting with the team today",
  "Feeling grateful for family time",
  "Learned about new productivity techniques",
  "Today was challenging but rewarding",
  "Reflecting on this week's accomplishments",
  "Grateful for the beautiful weather",
  "Thinking about career goals",
  "Had an inspiring conversation",
  "Feeling energized after workout",
  "Enjoyed lunch with old friends",
  
  // Transactions - Expenses
  "Spent $45 on groceries",
  "Paid $120 for electricity bill",
  "Bought coffee for $4.50",
  "Gas cost $65 today",
  "Lunch at restaurant $28",
  "Uber ride $15",
  "Movie tickets $24",
  "Pharmacy $12.99",
  "Parking fee $8",
  "Internet bill $79.99",
  
  // Transactions - Income
  "Earned $500 from freelance project",
  "Received $25 cashback",
  "Got paid $1200 salary",
  "Sold old laptop for $300",
  "Bonus payment $150",
  "Tip from client $50",
  "Refund from store $35",
  "Dividend payment $75"
];

/**
 * Test the parser with example commands (for development/debugging)
 */
export function testParser(): void {
  console.log('🧠 Testing Enhanced Custom NLP Parser\n');
  
  EXAMPLE_COMMANDS.forEach((command, index) => {
    const result = parseNaturalLanguage(command);
    console.log(`${index + 1}. "${command}"`);
    console.log(`   → ${result.type} (${Math.round(result.confidence * 100)}%): ${result.content}`);
    if (result.amount) {
      console.log(`   → Amount: $${result.amount} (${result.transactionType})`);
    }
    console.log('');
  });
}