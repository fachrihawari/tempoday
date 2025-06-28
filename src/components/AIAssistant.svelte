<script lang="ts">
import { formatDateKey } from '../lib/date';
import { parseNaturalLanguage, setLanguage, getAvailableLanguages, EXAMPLE_COMMANDS, type ParsedCommand } from '../lib/nlp';
import { appState } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import Alert from './ui/Alert.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import Icon from './ui/Icon.svelte';
import Textarea from './ui/Textarea.svelte';

let userInput = $state('');
let isProcessing = $state(false);
let lastParsedCommand = $state<ParsedCommand | null>(null);
let showExamples = $state(false);
let processingResult = $state<{ type: 'success' | 'error'; message: string } | null>(null);
let selectedLanguage = $state('en');

// Get current date for operations
const currentDate = $derived(formatDateKey(appState.selectedDate));

// Get available languages
const availableLanguages = getAvailableLanguages();

// Set initial language
$effect(() => {
  setLanguage(selectedLanguage);
});

async function processCommand() {
  if (!userInput.trim()) return;
  
  isProcessing = true;
  processingResult = null;
  
  try {
    // Parse the natural language input
    const parsed = parseNaturalLanguage(userInput);
    lastParsedCommand = parsed;
    
    // Execute the appropriate action based on the parsed command
    switch (parsed.type) {
      case 'task':
        await reactiveTasks.createTask({
          description: parsed.content,
          date: currentDate
        });
        processingResult = {
          type: 'success',
          message: `✅ Task created: "${parsed.content}" ${parsed.detectedLanguage ? `(detected: ${parsed.detectedLanguage})` : ''}`
        };
        break;
        
      case 'note':
        await reactiveNotes.saveNote({
          content: parsed.content,
          date: currentDate
        });
        processingResult = {
          type: 'success',
          message: `📝 Note saved: "${parsed.content.substring(0, 50)}${parsed.content.length > 50 ? '...' : ''}" ${parsed.detectedLanguage ? `(detected: ${parsed.detectedLanguage})` : ''}`
        };
        break;
        
      case 'transaction':
        if (parsed.amount && parsed.transactionType) {
          await reactiveTransactions.createTransaction({
            description: parsed.content,
            amount: parsed.amount,
            type: parsed.transactionType,
            date: currentDate
          });
          const symbol = parsed.transactionType === 'income' ? '+' : '-';
          processingResult = {
            type: 'success',
            message: `💰 ${parsed.transactionType === 'income' ? 'Income' : 'Expense'} added: ${symbol}$${parsed.amount} for "${parsed.content}" ${parsed.detectedLanguage ? `(detected: ${parsed.detectedLanguage})` : ''}`
          };
        } else {
          throw new Error('Could not extract amount or transaction type');
        }
        break;
        
      default:
        throw new Error('Could not understand the command');
    }
    
    // Clear input on success
    userInput = '';
    
  } catch (error) {
    console.error('Error processing command:', error);
    processingResult = {
      type: 'error',
      message: error instanceof Error ? error.message : 'Failed to process command'
    };
  } finally {
    isProcessing = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    processCommand();
  }
}

function insertExample(example: string) {
  userInput = example;
  showExamples = false;
}

function clearResult() {
  processingResult = null;
}

function handleLanguageChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  selectedLanguage = target.value;
  setLanguage(selectedLanguage);
}

// Get examples for current language
const currentExamples = $derived(EXAMPLE_COMMANDS[selectedLanguage as keyof typeof EXAMPLE_COMMANDS] || EXAMPLE_COMMANDS.en);
</script>

<Card title="AI Assistant" icon="edit" iconColor="text-purple-500">
  {#snippet headerAction()}
    <Button
      variant="ghost"
      size="sm"
      onclick={() => showExamples = !showExamples}
      class="text-purple-600 hover:text-purple-700"
    >
      {#snippet children()}
        <Icon name={showExamples ? 'close' : 'info-circle'} size="sm" class="mr-1" />
        {showExamples ? 'Hide' : 'Examples'}
      {/snippet}
    </Button>
  {/snippet}

  {#snippet children()}
    {#if processingResult}
      <Alert
        type={processingResult.type === 'success' ? 'success' : 'error'}
        description={processingResult.message}
        dismissible={true}
        onDismiss={clearResult}
        class="mb-4"
      />
    {/if}

    <!-- Language Selection -->
    <div class="mb-4">
      <label for="language-select" class="block text-sm font-medium text-gray-700 mb-2">
        Language / Idioma / Langue
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onchange={handleLanguageChange}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm"
      >
        {#each availableLanguages as lang (lang.code)}
          <option value={lang.code}>{lang.name}</option>
        {/each}
      </select>
    </div>

    <!-- Examples Section -->
    {#if showExamples}
      <div class="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 class="font-medium text-purple-900 mb-3 flex items-center gap-2">
          <Icon name="info-circle" size="sm" class="text-purple-600" />
          Try these examples in {availableLanguages.find(l => l.code === selectedLanguage)?.name}:
        </h4>
        <div class="space-y-2">
          {#each currentExamples as example}
            <button
              onclick={() => insertExample(example)}
              class="block w-full text-left text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-2 rounded transition-colors"
            >
              "{example}"
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Input Section -->
    <div class="space-y-4">
      <Textarea
        bind:value={userInput}
        onkeydown={handleKeydown}
        placeholder={selectedLanguage === 'es' 
          ? `Dime qué quieres hacer...
Ejemplos:
• 'Llamar al dentista para programar cita'
• 'Gasté $45 en supermercado'  
• 'Tuve una gran reunión hoy'

Presiona Ctrl+Enter para procesar`
          : selectedLanguage === 'fr'
          ? `Dites-moi ce que vous voulez faire...
Exemples:
• 'Appeler le dentiste pour prendre rendez-vous'
• 'Dépensé 45€ en courses'  
• 'J'ai eu une excellente réunion aujourd'hui'

Appuyez sur Ctrl+Entrée pour traiter`
          : `Tell me what you want to do... 
Examples:
• 'Call dentist to schedule appointment'
• 'Spent $45 on groceries'  
• 'Had a great meeting with the team today'

Press Ctrl+Enter to process`}
        label="What would you like to add?"
        theme="notes"
        rows={4}
        autoResize={true}
      />

      <div class="flex gap-3">
        <Button
          variant="notes"
          onclick={processCommand}
          disabled={!userInput.trim() || isProcessing}
          class="flex-1"
        >
          {#snippet children()}
            {#if isProcessing}
              <Icon name="loader" size="sm" class="mr-2 animate-spin" />
              {selectedLanguage === 'es' ? 'Procesando...' : selectedLanguage === 'fr' ? 'Traitement...' : 'Processing...'}
            {:else}
              <Icon name="plus" size="sm" class="mr-2" />
              {selectedLanguage === 'es' ? 'Procesar Comando' : selectedLanguage === 'fr' ? 'Traiter la Commande' : 'Process Command'}
            {/if}
          {/snippet}
        </Button>
        
        {#if userInput.trim()}
          <Button
            variant="ghost"
            onclick={() => userInput = ''}
            class="px-4"
          >
            {#snippet children()}
              {selectedLanguage === 'es' ? 'Limpiar' : selectedLanguage === 'fr' ? 'Effacer' : 'Clear'}
            {/snippet}
          </Button>
        {/if}
      </div>
    </div>

    <!-- Preview Section -->
    {#if userInput.trim() && !isProcessing}
      {@const preview = parseNaturalLanguage(userInput)}
      <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Icon name="info-circle" size="sm" class="text-gray-500" />
          Preview (Confidence: {Math.round(preview.confidence * 100)}%) 
          {#if preview.detectedLanguage}
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {availableLanguages.find(l => l.code === preview.detectedLanguage)?.name || preview.detectedLanguage}
            </span>
          {/if}
        </h4>
        <div class="flex items-center gap-2 text-sm">
          <span class="px-2 py-1 rounded text-xs font-medium
            {preview.type === 'task' ? 'bg-blue-100 text-blue-700' : 
             preview.type === 'note' ? 'bg-purple-100 text-purple-700' : 
             'bg-green-100 text-green-700'}">
            {preview.type === 'task' ? '📋 Task' : 
             preview.type === 'note' ? '📝 Note' : 
             preview.type === 'transaction' ? `💰 ${preview.transactionType === 'income' ? 'Income' : 'Expense'}` : 
             '❓ Unknown'}
          </span>
          <span class="text-gray-600">
            {preview.content}
            {#if preview.amount}
              <span class="font-medium text-green-600"> (${preview.amount})</span>
            {/if}
          </span>
        </div>
      </div>
    {/if}

    <!-- Help Text -->
    <div class="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
      <p class="font-medium mb-1">💡 Tips:</p>
      {#if selectedLanguage === 'es'}
        <ul class="space-y-1">
          <li>• Usa verbos de acción para tareas: "llamar", "comprar", "terminar", "programar"</li>
          <li>• Incluye cantidades para transacciones: "gasté $20 en almuerzo"</li>
          <li>• Escribe naturalmente para notas: "me siento agradecido hoy"</li>
          <li>• Presiona Ctrl+Enter para procesar rápidamente tu comando</li>
        </ul>
      {:else if selectedLanguage === 'fr'}
        <ul class="space-y-1">
          <li>• Utilisez des verbes d'action pour les tâches: "appeler", "acheter", "terminer", "programmer"</li>
          <li>• Incluez des montants pour les transactions: "dépensé 20€ pour le déjeuner"</li>
          <li>• Écrivez naturellement pour les notes: "je me sens reconnaissant aujourd'hui"</li>
          <li>• Appuyez sur Ctrl+Entrée pour traiter rapidement votre commande</li>
        </ul>
      {:else}
        <ul class="space-y-1">
          <li>• Use action words for tasks: "call", "buy", "finish", "schedule"</li>
          <li>• Include amounts for transactions: "spent $20 on lunch"</li>
          <li>• Write naturally for notes: "feeling grateful today"</li>
          <li>• Press Ctrl+Enter to quickly process your command</li>
        </ul>
      {/if}
    </div>
  {/snippet}
</Card>