import nlp from 'compromise';

export interface ParsedCommand {
  type: 'task' | 'note' | 'transaction' | 'unknown';
  content: string;
  amount?: number;
  transactionType?: 'income' | 'expense';
  confidence: number;
}

// Keywords for different types of commands
const TASK_KEYWORDS = [
  'task', 'todo', 'do', 'remind', 'remember', 'need to', 'have to', 'must',
  'should', 'complete', 'finish', 'work on', 'call', 'email', 'buy', 'get',
  'pick up', 'schedule', 'book', 'appointment', 'meeting', 'deadline'
];

const NOTE_KEYWORDS = [
  'note', 'write', 'journal', 'diary', 'thought', 'idea', 'remember',
  'reflection', 'feeling', 'mood', 'today', 'happened', 'learned',
  'grateful', 'thankful', 'quote', 'insight'
];

const INCOME_KEYWORDS = [
  'earned', 'received', 'salary', 'wage', 'bonus', 'tip', 'refund',
  'sold', 'income', 'payment', 'freelance', 'commission', 'dividend',
  'interest', 'gift', 'won', 'prize', 'cashback'
];

const EXPENSE_KEYWORDS = [
  'spent', 'bought', 'paid', 'cost', 'expense', 'bill', 'fee',
  'subscription', 'rent', 'mortgage', 'insurance', 'gas', 'food',
  'groceries', 'restaurant', 'coffee', 'lunch', 'dinner', 'shopping',
  'clothes', 'entertainment', 'movie', 'uber', 'taxi', 'parking'
];

// Common task action verbs
const TASK_VERBS = [
  'call', 'email', 'text', 'message', 'contact', 'buy', 'get', 'pick up',
  'drop off', 'schedule', 'book', 'cancel', 'confirm', 'check', 'review',
  'finish', 'complete', 'start', 'begin', 'submit', 'send', 'deliver',
  'clean', 'organize', 'prepare', 'plan', 'research', 'study', 'practice'
];

export function parseNaturalLanguage(input: string): ParsedCommand {
  const doc = nlp(input.toLowerCase().trim());
  const text = doc.text();
  
  // Extract potential amounts (money values)
  const amounts = extractAmounts(text);
  const hasAmount = amounts.length > 0;
  
  // Calculate confidence scores for each type
  const taskScore = calculateScore(text, [...TASK_KEYWORDS, ...TASK_VERBS]);
  const noteScore = calculateScore(text, NOTE_KEYWORDS);
  const incomeScore = calculateScore(text, INCOME_KEYWORDS);
  const expenseScore = calculateScore(text, EXPENSE_KEYWORDS);
  
  // Determine the most likely type
  const scores = [
    { type: 'task' as const, score: taskScore },
    { type: 'note' as const, score: noteScore },
    { type: 'income' as const, score: incomeScore },
    { type: 'expense' as const, score: expenseScore }
  ];
  
  // Sort by score
  scores.sort((a, b) => b.score - a.score);
  const topScore = scores[0];
  
  // Special logic for transactions
  if (hasAmount && (incomeScore > 0 || expenseScore > 0)) {
    const transactionType = incomeScore > expenseScore ? 'income' : 'expense';
    return {
      type: 'transaction',
      content: cleanTransactionDescription(text, amounts[0]),
      amount: amounts[0],
      transactionType,
      confidence: Math.max(incomeScore, expenseScore)
    };
  }
  
  // If we have a clear winner with decent confidence
  if (topScore.score > 0.3) {
    return {
      type: topScore.type === 'income' || topScore.type === 'expense' ? 'transaction' : topScore.type,
      content: cleanContent(text, topScore.type),
      amount: hasAmount ? amounts[0] : undefined,
      transactionType: topScore.type === 'income' || topScore.type === 'expense' ? topScore.type : undefined,
      confidence: topScore.score
    };
  }
  
  // Default to task if it looks like an action
  if (hasActionVerb(text) || hasImperativeStructure(doc)) {
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
    confidence: 0.4
  };
}

function calculateScore(text: string, keywords: string[]): number {
  let score = 0;
  const words = text.split(/\s+/);
  const totalWords = words.length;
  
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      // Longer keywords get higher scores
      const keywordWeight = keyword.split(' ').length;
      score += keywordWeight * 0.2;
    }
  }
  
  // Normalize by text length to avoid bias toward longer texts
  return Math.min(score / Math.sqrt(totalWords), 1);
}

function extractAmounts(text: string): number[] {
  const amounts: number[] = [];
  
  // Match various money formats: $50, 50.99, $1,234.56, etc.
  const moneyRegex = /(?:\$|usd|dollar|euro|€|£|¥|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollar|euro|usd|€|£|¥|₹)?/gi;
  
  let match;
  while ((match = moneyRegex.exec(text)) !== null) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(amount) && amount > 0) {
      amounts.push(amount);
    }
  }
  
  return amounts;
}

function hasActionVerb(text: string): boolean {
  return TASK_VERBS.some(verb => text.includes(verb));
}

function hasImperativeStructure(doc: any): boolean {
  // Check if the sentence starts with a verb (imperative mood)
  const firstWord = doc.match('#Verb').first();
  return firstWord.found && doc.text().indexOf(firstWord.text()) < 10;
}

function cleanContent(text: string, type: string): string {
  let cleaned = text;
  
  // Remove common prefixes
  const prefixes = [
    'add task', 'create task', 'new task', 'task:',
    'add note', 'write note', 'note:', 'journal:',
    'spent', 'paid', 'bought', 'earned', 'received',
    'i need to', 'i have to', 'i should', 'i must',
    'remind me to', 'remember to'
  ];
  
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function cleanTransactionDescription(text: string, amount: number): string {
  let cleaned = text;
  
  // Remove the amount from the description
  const amountStr = amount.toString();
  cleaned = cleaned.replace(new RegExp(`\\$?${amountStr}`, 'gi'), '').trim();
  
  // Remove common transaction prefixes
  const prefixes = ['spent', 'paid', 'bought', 'earned', 'received', 'for'];
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // If description is too short, provide a default
  if (cleaned.length < 3) {
    cleaned = amount > 0 ? 'Transaction' : 'Expense';
  }
  
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Example usage and test cases
export const EXAMPLE_COMMANDS = [
  // Tasks
  "Call dentist to schedule appointment",
  "Buy groceries for dinner",
  "Finish project report by Friday",
  "Pick up dry cleaning",
  "Email client about meeting",
  
  // Notes
  "Had a great meeting with the team today",
  "Feeling grateful for family time",
  "Learned about new productivity techniques",
  "Today was challenging but rewarding",
  "Quote: 'Success is not final, failure is not fatal'",
  
  // Transactions
  "Spent $45 on groceries",
  "Paid $120 for electricity bill",
  "Earned $500 from freelance project",
  "Received $25 cashback",
  "Bought coffee for $4.50",
  "$1200 salary payment received"
];