// Transaction categories for TempoDay

export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'education'
  | 'work'
  | 'travel'
  | 'gifts'
  | 'other';

export interface CategoryConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const CATEGORY_CONFIG: Record<TransactionCategory, CategoryConfig> = {
  food: {
    label: 'Food & Dining',
    icon: '🍽️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    description: 'Restaurants, groceries, snacks',
  },
  transport: {
    label: 'Transportation',
    icon: '🚗',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'Gas, public transport, rideshare',
  },
  shopping: {
    label: 'Shopping',
    icon: '🛍️',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    description: 'Clothes, electronics, household items',
  },
  entertainment: {
    label: 'Entertainment',
    icon: '🎬',
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-300',
    description: 'Movies, games, subscriptions',
  },
  bills: {
    label: 'Bills & Utilities',
    icon: '📄',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    description: 'Rent, electricity, internet, phone',
  },
  health: {
    label: 'Health & Fitness',
    icon: '🏥',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    description: 'Medical, pharmacy, gym, wellness',
  },
  education: {
    label: 'Education',
    icon: '📚',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-300',
    description: 'Books, courses, training',
  },
  work: {
    label: 'Work & Business',
    icon: '💼',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    description: 'Office supplies, business expenses',
  },
  travel: {
    label: 'Travel',
    icon: '✈️',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-300',
    description: 'Hotels, flights, vacation expenses',
  },
  gifts: {
    label: 'Gifts & Donations',
    icon: '🎁',
    color: 'text-rose-700',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-300',
    description: 'Presents, charity, tips',
  },
  other: {
    label: 'Other',
    icon: '📦',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    description: 'Miscellaneous expenses',
  },
};

export const CATEGORY_OPTIONS: TransactionCategory[] = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'bills',
  'health',
  'education',
  'work',
  'travel',
  'gifts',
  'other',
];

// Income categories
export const INCOME_CATEGORIES: TransactionCategory[] = [
  'work',
  'gifts',
  'other',
];

// Expense categories
export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'bills',
  'health',
  'education',
  'work',
  'travel',
  'gifts',
  'other',
];

/**
 * Get category configuration for a given category
 */
export function getCategoryConfig(category: TransactionCategory): CategoryConfig {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
}

/**
 * Get appropriate categories for transaction type
 */
export function getCategoriesForType(type: 'income' | 'expense'): TransactionCategory[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

/**
 * Get default category for transaction type
 */
export function getDefaultCategory(type: 'income' | 'expense'): TransactionCategory {
  return type === 'income' ? 'work' : 'other';
}

/**
 * Filter categories by search term
 */
export function filterCategories(categories: TransactionCategory[], searchTerm: string): TransactionCategory[] {
  if (!searchTerm.trim()) return categories;
  
  const lowerSearch = searchTerm.toLowerCase();
  return categories.filter(category => {
    const config = getCategoryConfig(category);
    return (
      config.label.toLowerCase().includes(lowerSearch) ||
      config.description.toLowerCase().includes(lowerSearch)
    );
  });
}