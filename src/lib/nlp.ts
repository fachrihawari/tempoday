// Enhanced Multilingual Custom NLP Parser for TempoDay
// Supports multiple languages with extensible architecture

export interface ParsedCommand {
  type: 'task' | 'note' | 'transaction' | 'unknown';
  content: string;
  amount?: number;
  transactionType?: 'income' | 'expense';
  confidence: number;
  detectedLanguage?: string;
}

// Language configuration interface
interface LanguageConfig {
  code: string;
  name: string;
  keywords: {
    task: {
      actionVerbs: string[];
      contexts: string[];
      imperatives: string[];
    };
    note: {
      emotional: string[];
      journaling: string[];
      pastTense: string[];
      reflective: string[];
    };
    transaction: {
      income: string[];
      expense: string[];
    };
  };
  patterns: {
    currency: RegExp[];
    amounts: RegExp[];
  };
  pronouns: string[];
  articles: string[];
  prepositions: string[];
}

// English language configuration
const ENGLISH_CONFIG: LanguageConfig = {
  code: 'en',
  name: 'English',
  keywords: {
    task: {
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
    },
    note: {
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
    },
    transaction: {
      income: [
        'earned', 'received', 'got paid', 'salary', 'wage',
        'bonus', 'tip', 'tips', 'refund', 'cashback',
        'sold', 'income', 'payment', 'freelance',
        'commission', 'dividend', 'interest', 'profit',
        'gift', 'won', 'prize', 'reward', 'rebate'
      ],
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
    }
  },
  patterns: {
    currency: [
      /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,
      /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd|bucks?)/g
    ],
    amounts: [
      /(?:spent|paid|cost|earned|received|got)\s+.*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g
    ]
  },
  pronouns: ['i ', 'my ', 'me ', 'myself', 'we ', 'us ', 'our '],
  articles: ['a ', 'an ', 'the '],
  prepositions: ['on ', 'for ', 'to ', 'at ', 'from ', 'in ', 'with ']
};

// Spanish language configuration
const SPANISH_CONFIG: LanguageConfig = {
  code: 'es',
  name: 'Español',
  keywords: {
    task: {
      actionVerbs: [
        'llamar', 'enviar', 'mandar', 'contactar', 'telefonear',
        'comprar', 'conseguir', 'recoger', 'llevar', 'dejar',
        'programar', 'reservar', 'cancelar', 'confirmar',
        'revisar', 'verificar', 'validar', 'inspeccionar',
        'terminar', 'completar', 'empezar', 'comenzar', 'continuar',
        'enviar', 'entregar', 'mandar', 'correo',
        'limpiar', 'organizar', 'preparar', 'planear', 'arreglar',
        'investigar', 'estudiar', 'practicar', 'aprender', 'leer',
        'arreglar', 'reparar', 'actualizar', 'instalar',
        'reunirse', 'visitar', 'asistir', 'participar'
      ],
      contexts: [
        'cita', 'reunión', 'fecha límite', 'tarea', 'pendiente',
        'recordatorio', 'mandado', 'trabajo', 'proyecto',
        'asignación', 'deberes', 'reporte', 'presentación',
        'entrevista', 'consulta', 'revisión', 'servicio'
      ],
      imperatives: [
        'necesito', 'tengo que', 'debo', 'debería', 'recordar',
        'no olvidar', 'asegurarme', 'hay que'
      ]
    },
    note: {
      emotional: [
        'sintiendo', 'sentí', 'siento', 'emoción', 'estado de ánimo',
        'feliz', 'triste', 'emocionado', 'nervioso', 'ansioso',
        'agradecido', 'bendecido', 'afortunado',
        'orgulloso', 'decepcionado', 'frustrado', 'contento',
        'tranquilo', 'estresado', 'relajado', 'energizado'
      ],
      journaling: [
        'hoy fue', 'hoy', 'tuve un', 'fui a',
        'aprendí', 'descubrí', 'me di cuenta', 'noté',
        'pensé en', 'reflexioné sobre', 'recordé',
        'cita', 'idea', 'inspiración',
        'experiencia', 'pasó', 'ocurrió', 'presencié'
      ],
      pastTense: [
        'fue', 'era', 'tuve', 'hice', 'fui', 'vine',
        'vi', 'conocí', 'hablé', 'discutí', 'compartí',
        'disfruté', 'amé', 'odié', 'me gustó', 'no me gustó'
      ],
      reflective: [
        'pensando en', 'reflexionando', 'considerando',
        'agradecido por', 'aprecio',
        'esperando', 'deseando', 'soñando'
      ]
    },
    transaction: {
      income: [
        'gané', 'recibí', 'me pagaron', 'salario', 'sueldo',
        'bono', 'propina', 'propinas', 'reembolso',
        'vendí', 'ingreso', 'pago', 'freelance',
        'comisión', 'dividendo', 'interés', 'ganancia',
        'regalo', 'gané', 'premio', 'recompensa'
      ],
      expense: [
        'gasté', 'compré', 'pagué', 'costó',
        'gasto', 'factura', 'tarifa', 'cargo', 'suscripción',
        'alquiler', 'hipoteca', 'seguro', 'impuesto', 'impuestos',
        'gasolina', 'combustible', 'comida', 'supermercado', 'restaurante',
        'café', 'almuerzo', 'cena', 'desayuno', 'merienda',
        'compras', 'ropa', 'zapatos',
        'entretenimiento', 'película', 'concierto', 'espectáculo',
        'uber', 'taxi', 'transporte', 'estacionamiento', 'peaje',
        'médico', 'doctor', 'farmacia', 'medicina',
        'servicios', 'electricidad', 'agua', 'internet'
      ]
    }
  },
  patterns: {
    currency: [
      /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,
      /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:pesos?|dólares?|euros?)/g,
      /€\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g
    ],
    amounts: [
      /(?:gasté|pagué|costó|gané|recibí)\s+.*?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g
    ]
  },
  pronouns: ['yo ', 'mi ', 'me ', 'nosotros ', 'nos ', 'nuestro '],
  articles: ['el ', 'la ', 'un ', 'una ', 'los ', 'las '],
  prepositions: ['en ', 'para ', 'a ', 'de ', 'con ', 'por ']
};

// French language configuration
const FRENCH_CONFIG: LanguageConfig = {
  code: 'fr',
  name: 'Français',
  keywords: {
    task: {
      actionVerbs: [
        'appeler', 'envoyer', 'contacter', 'téléphoner',
        'acheter', 'obtenir', 'récupérer', 'déposer',
        'programmer', 'réserver', 'annuler', 'confirmer',
        'vérifier', 'valider', 'inspecter',
        'terminer', 'compléter', 'commencer', 'continuer',
        'envoyer', 'livrer', 'poster',
        'nettoyer', 'organiser', 'préparer', 'planifier', 'arranger',
        'rechercher', 'étudier', 'pratiquer', 'apprendre', 'lire',
        'réparer', 'mettre à jour', 'installer',
        'rencontrer', 'visiter', 'assister', 'participer'
      ],
      contexts: [
        'rendez-vous', 'réunion', 'échéance', 'tâche', 'à faire',
        'rappel', 'course', 'travail', 'projet',
        'devoir', 'rapport', 'présentation',
        'entretien', 'consultation', 'contrôle', 'service'
      ],
      imperatives: [
        'je dois', 'il faut', 'je devrais', 'se rappeler',
        'ne pas oublier', 's\'assurer', 'il faut que'
      ]
    },
    note: {
      emotional: [
        'ressentir', 'ressenti', 'ressens', 'émotion', 'humeur',
        'heureux', 'triste', 'excité', 'nerveux', 'anxieux',
        'reconnaissant', 'béni', 'chanceux',
        'fier', 'déçu', 'frustré', 'content',
        'paisible', 'stressé', 'détendu', 'énergisé'
      ],
      journaling: [
        'aujourd\'hui était', 'aujourd\'hui j\'ai', 'j\'ai eu', 'je suis allé',
        'j\'ai appris', 'j\'ai découvert', 'j\'ai réalisé', 'j\'ai remarqué',
        'j\'ai pensé à', 'j\'ai réfléchi sur', 'je me suis souvenu',
        'citation', 'idée', 'inspiration',
        'expérience', 'arrivé', 'eu lieu', 'témoin'
      ],
      pastTense: [
        'était', 'étaient', 'avais', 'ai fait', 'suis allé', 'suis venu',
        'ai vu', 'ai rencontré', 'ai parlé', 'ai discuté', 'ai partagé',
        'ai apprécié', 'ai aimé', 'ai détesté', 'aimé', 'pas aimé'
      ],
      reflective: [
        'penser à', 'réfléchir', 'considérer',
        'reconnaissant pour', 'apprécier',
        'attendre avec impatience', 'espérer', 'souhaiter', 'rêver'
      ]
    },
    transaction: {
      income: [
        'gagné', 'reçu', 'payé', 'salaire', 'paie',
        'bonus', 'pourboire', 'remboursement',
        'vendu', 'revenu', 'paiement', 'freelance',
        'commission', 'dividende', 'intérêt', 'profit',
        'cadeau', 'gagné', 'prix', 'récompense'
      ],
      expense: [
        'dépensé', 'acheté', 'payé', 'coûté',
        'dépense', 'facture', 'frais', 'charge', 'abonnement',
        'loyer', 'hypothèque', 'assurance', 'taxe', 'taxes',
        'essence', 'carburant', 'nourriture', 'courses', 'restaurant',
        'café', 'déjeuner', 'dîner', 'petit-déjeuner', 'collation',
        'shopping', 'vêtements', 'chaussures',
        'divertissement', 'film', 'concert', 'spectacle',
        'uber', 'taxi', 'transport', 'parking', 'péage',
        'médical', 'docteur', 'pharmacie', 'médicament',
        'services', 'électricité', 'eau', 'internet'
      ]
    }
  },
  patterns: {
    currency: [
      /€\s*(\d{1,3}(?:\s\d{3})*(?:,\d{2})?)/g,
      /(\d{1,3}(?:\s\d{3})*(?:,\d{2})?)\s*(?:euros?|dollars?)/g,
      /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g
    ],
    amounts: [
      /(?:dépensé|payé|coûté|gagné|reçu)\s+.*?(\d{1,3}(?:\s\d{3})*(?:,\d{2})?)/g
    ]
  },
  pronouns: ['je ', 'mon ', 'ma ', 'mes ', 'me ', 'nous ', 'notre '],
  articles: ['le ', 'la ', 'un ', 'une ', 'les ', 'des '],
  prepositions: ['sur ', 'pour ', 'à ', 'de ', 'avec ', 'par ', 'dans ']
};

// Language registry
const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  en: ENGLISH_CONFIG,
  es: SPANISH_CONFIG,
  fr: FRENCH_CONFIG
};

// Default language
let currentLanguage = 'en';

/**
 * Set the current language for parsing
 */
export function setLanguage(languageCode: string): boolean {
  if (LANGUAGE_CONFIGS[languageCode]) {
    currentLanguage = languageCode;
    return true;
  }
  console.warn(`Language '${languageCode}' not supported. Available: ${Object.keys(LANGUAGE_CONFIGS).join(', ')}`);
  return false;
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): Array<{code: string, name: string}> {
  return Object.values(LANGUAGE_CONFIGS).map(config => ({
    code: config.code,
    name: config.name
  }));
}

/**
 * Detect language from text (simple heuristic-based detection)
 */
function detectLanguage(text: string): string {
  const scores: Record<string, number> = {};
  
  // Initialize scores
  Object.keys(LANGUAGE_CONFIGS).forEach(lang => {
    scores[lang] = 0;
  });
  
  // Score based on keyword matches
  Object.entries(LANGUAGE_CONFIGS).forEach(([langCode, config]) => {
    const allKeywords = [
      ...config.keywords.task.actionVerbs,
      ...config.keywords.task.contexts,
      ...config.keywords.note.emotional,
      ...config.keywords.transaction.income,
      ...config.keywords.transaction.expense,
      ...config.pronouns,
      ...config.articles,
      ...config.prepositions
    ];
    
    allKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.trim())) {
        scores[langCode] += keyword.length; // Longer keywords get higher scores
      }
    });
  });
  
  // Return language with highest score, fallback to current language
  const detectedLang = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
  
  return scores[detectedLang] > 0 ? detectedLang : currentLanguage;
}

/**
 * Enhanced multilingual parser
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

  // Detect language
  const detectedLang = detectLanguage(text);
  const config = LANGUAGE_CONFIGS[detectedLang];
  
  // Extract monetary amounts using language-specific patterns
  const amounts = extractAmounts(text, config);
  const hasAmount = amounts.length > 0;
  
  // Calculate confidence scores for each type
  const taskScore = calculateTaskScore(text, config);
  const noteScore = calculateNoteScore(text, config);
  const incomeScore = calculateTransactionScore(text, config, 'income');
  const expenseScore = calculateTransactionScore(text, config, 'expense');
  
  // Transaction detection (prioritized when amount is present)
  if (hasAmount && (incomeScore > 0.2 || expenseScore > 0.2)) {
    const transactionType = incomeScore > expenseScore ? 'income' : 'expense';
    const confidence = Math.max(incomeScore, expenseScore) + (hasAmount ? 0.3 : 0);
    
    return {
      type: 'transaction',
      content: cleanTransactionDescription(text, amounts[0], config),
      amount: amounts[0],
      transactionType,
      confidence: Math.min(confidence, 1),
      detectedLanguage: detectedLang
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
      content: cleanContent(text, winner.type, config),
      confidence: winner.score,
      detectedLanguage: detectedLang
    };
  }
  
  // Default logic for edge cases
  if (hasImperativeStructure(text, config) || startsWithActionVerb(text, config)) {
    return {
      type: 'task',
      content: cleanContent(text, 'task', config),
      confidence: 0.6,
      detectedLanguage: detectedLang
    };
  }
  
  // Default to note for everything else
  return {
    type: 'note',
    content: cleanContent(text, 'note', config),
    confidence: 0.5,
    detectedLanguage: detectedLang
  };
}

/**
 * Calculate task confidence score using language-specific keywords
 */
function calculateTaskScore(text: string, config: LanguageConfig): number {
  let score = 0;
  const words = text.split(/\s+/);
  
  // Check for action verbs (especially at the beginning)
  const firstWord = words[0];
  if (config.keywords.task.actionVerbs.includes(firstWord)) {
    score += 0.5;
  }
  
  // Check for action verbs anywhere in text
  const hasActionVerb = config.keywords.task.actionVerbs.some(verb => 
    text.includes(verb)
  );
  if (hasActionVerb && !config.keywords.task.actionVerbs.includes(firstWord)) {
    score += 0.3;
  }
  
  // Check for task contexts
  const hasTaskContext = config.keywords.task.contexts.some(context => 
    text.includes(context)
  );
  if (hasTaskContext) {
    score += 0.2;
  }
  
  // Check for imperative indicators
  const hasImperative = config.keywords.task.imperatives.some(imp => 
    text.includes(imp)
  );
  if (hasImperative) {
    score += 0.3;
  }
  
  // Boost for imperative sentence structure
  if (hasImperativeStructure(text, config)) {
    score += 0.2;
  }
  
  // Penalty for past tense (more likely to be a note)
  if (hasPastTenseIndicators(text, config)) {
    score -= 0.2;
  }
  
  return Math.max(0, Math.min(score, 1));
}

/**
 * Calculate note confidence score using language-specific indicators
 */
function calculateNoteScore(text: string, config: LanguageConfig): number {
  let score = 0;
  
  // Check for emotional language
  const hasEmotional = config.keywords.note.emotional.some(word => 
    text.includes(word)
  );
  if (hasEmotional) {
    score += 0.4;
  }
  
  // Check for journaling indicators
  const hasJournaling = config.keywords.note.journaling.some(phrase => 
    text.includes(phrase)
  );
  if (hasJournaling) {
    score += 0.3;
  }
  
  // Check for past tense (journal-like)
  if (hasPastTenseIndicators(text, config)) {
    score += 0.2;
  }
  
  // Check for reflective language
  const hasReflective = config.keywords.note.reflective.some(phrase => 
    text.includes(phrase)
  );
  if (hasReflective) {
    score += 0.3;
  }
  
  // Boost for personal pronouns (more personal/journal-like)
  if (hasPersonalPronouns(text, config)) {
    score += 0.1;
  }
  
  // Penalty for imperative structure (more likely to be a task)
  if (hasImperativeStructure(text, config)) {
    score -= 0.3;
  }
  
  return Math.max(0, Math.min(score, 1));
}

/**
 * Calculate transaction confidence score using language-specific keywords
 */
function calculateTransactionScore(text: string, config: LanguageConfig, type: 'income' | 'expense'): number {
  const keywords = config.keywords.transaction[type];
  
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
 * Extract monetary amounts using language-specific patterns
 */
function extractAmounts(text: string, config: LanguageConfig): number[] {
  const amounts: number[] = [];
  
  for (const pattern of [...config.patterns.currency, ...config.patterns.amounts]) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const amountStr = match[1].replace(/[,\s]/g, '').replace(',', '.');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0 && amount < 1000000) {
        amounts.push(amount);
      }
    }
  }
  
  return [...new Set(amounts)];
}

/**
 * Check if text has imperative sentence structure (language-specific)
 */
function hasImperativeStructure(text: string, config: LanguageConfig): boolean {
  const words = text.split(/\s+/);
  const firstWord = words[0];
  
  return config.keywords.task.actionVerbs.includes(firstWord);
}

/**
 * Check if text starts with an action verb (language-specific)
 */
function startsWithActionVerb(text: string, config: LanguageConfig): boolean {
  const firstWord = text.split(/\s+/)[0];
  return config.keywords.task.actionVerbs.includes(firstWord);
}

/**
 * Check for past tense indicators (language-specific)
 */
function hasPastTenseIndicators(text: string, config: LanguageConfig): boolean {
  return config.keywords.note.pastTense.some(indicator => text.includes(indicator));
}

/**
 * Check for personal pronouns (language-specific)
 */
function hasPersonalPronouns(text: string, config: LanguageConfig): boolean {
  return config.pronouns.some(pronoun => text.includes(pronoun));
}

/**
 * Clean and format content for display (language-aware)
 */
function cleanContent(text: string, type: string, config: LanguageConfig): string {
  let cleaned = text;
  
  // Remove common prefixes based on type and language
  const taskPrefixes = [
    // Universal task prefixes
    'add task', 'create task', 'new task', 'task:',
    // Language-specific imperatives
    ...config.keywords.task.imperatives
  ];
  
  const notePrefixes = [
    'add note', 'write note', 'note:', 'journal:',
    // Language-specific journaling phrases
    ...config.keywords.note.journaling.slice(0, 5) // First few journaling phrases
  ];
  
  const prefixes = type === 'task' ? taskPrefixes : notePrefixes;
  
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // Remove leading articles and prepositions
  for (const word of [...config.articles, ...config.prepositions]) {
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
    const fallbacks = {
      en: { task: 'New task', note: 'Daily note' },
      es: { task: 'Nueva tarea', note: 'Nota diaria' },
      fr: { task: 'Nouvelle tâche', note: 'Note quotidienne' }
    };
    cleaned = fallbacks[config.code]?.[type] || fallbacks.en[type];
  }
  
  return cleaned;
}

/**
 * Clean transaction description (language-aware)
 */
function cleanTransactionDescription(text: string, amount: number, config: LanguageConfig): string {
  let cleaned = text;
  
  // Remove the amount from description using language-specific patterns
  for (const pattern of config.patterns.currency) {
    cleaned = cleaned.replace(pattern, '').trim();
  }
  
  // Remove transaction prefixes
  const transactionPrefixes = [
    ...config.keywords.transaction.income.slice(0, 10),
    ...config.keywords.transaction.expense.slice(0, 10)
  ];
  
  for (const prefix of transactionPrefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  // Clean up extra words using language-specific prepositions
  for (const prep of config.prepositions) {
    cleaned = cleaned.replace(new RegExp(`^${prep}`, 'i'), '');
  }
  
  // Ensure proper capitalization
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Provide fallback description
  if (!cleaned.trim() || cleaned.length < 2) {
    const fallbacks = {
      en: 'Transaction',
      es: 'Transacción',
      fr: 'Transaction'
    };
    cleaned = fallbacks[config.code] || fallbacks.en;
  }
  
  return cleaned;
}

// Multilingual example commands for testing
export const EXAMPLE_COMMANDS = {
  en: [
    "Call dentist to schedule appointment",
    "Buy groceries for dinner", 
    "Spent $45 on groceries",
    "Had a great meeting today",
    "Feeling grateful for family time"
  ],
  es: [
    "Llamar al dentista para programar cita",
    "Comprar comida para la cena",
    "Gasté $45 en supermercado", 
    "Tuve una gran reunión hoy",
    "Me siento agradecido por el tiempo en familia"
  ],
  fr: [
    "Appeler le dentiste pour prendre rendez-vous",
    "Acheter de la nourriture pour le dîner",
    "Dépensé 45€ en courses",
    "J'ai eu une excellente réunion aujourd'hui", 
    "Je me sens reconnaissant pour le temps en famille"
  ]
};

/**
 * Test the multilingual parser
 */
export function testMultilingualParser(): void {
  console.log('🌍 Testing Multilingual NLP Parser\n');
  
  Object.entries(EXAMPLE_COMMANDS).forEach(([lang, commands]) => {
    console.log(`\n--- ${LANGUAGE_CONFIGS[lang].name} (${lang}) ---`);
    setLanguage(lang);
    
    commands.forEach((command, index) => {
      const result = parseNaturalLanguage(command);
      console.log(`${index + 1}. "${command}"`);
      console.log(`   → ${result.type} (${Math.round(result.confidence * 100)}%) [${result.detectedLanguage}]: ${result.content}`);
      if (result.amount) {
        console.log(`   → Amount: $${result.amount} (${result.transactionType})`);
      }
    });
  });
}