<script lang="ts">
import { getCategoryConfig, getDefaultCategory } from '../lib/categories';
import { formatCurrency } from '../lib/currency';
import { formatDateKey } from '../lib/date';
import {
  EXAMPLE_COMMANDS,
  type ParsedCommand,
  parseNaturalLanguage,
} from '../lib/nlp';
import { appState } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { settingsStore } from '../stores/settings.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { toastStore } from '../stores/toast.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import Icon from './ui/Icon.svelte';

let userInput = $state('');
let isProcessing = $state(false);
let lastParsedCommand = $state<ParsedCommand | null>(null);
let showDetailedHelp = $state(false);
let textareaElement: HTMLTextAreaElement = $state()!;

// Get current date for operations
const currentDate = $derived(formatDateKey(appState.selectedDate));

// Reactive settings for currency formatting
let { settings } = $derived(settingsStore);

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  const currency = settings?.currency || 'USD';
  const locale = settings?.locale || 'en-US';
  return formatCurrency(amount, currency, locale);
}

async function processCommand() {
  if (!userInput.trim()) return;

  isProcessing = true;

  try {
    // Parse the natural language input
    const parsed = parseNaturalLanguage(userInput);
    lastParsedCommand = parsed;

    // Execute the appropriate action based on the parsed command
    switch (parsed.type) {
      case 'task':
        await reactiveTasks.createTask({
          description: parsed.content,
          date: currentDate,
          priority: parsed.priority || 'medium', // Use parsed priority or default to medium
        });
        toastStore.success(`Task created: "${parsed.content}"`);
        break;

      case 'note':
        await reactiveNotes.saveNote({
          content: parsed.content,
          date: currentDate,
        });
        toastStore.success(
          `Note saved: "${parsed.content.substring(0, 50)}${parsed.content.length > 50 ? '...' : ''}"`,
        );
        break;

      case 'transaction':
        if (parsed.amount && parsed.transactionType) {
          await reactiveTransactions.createTransaction({
            description: parsed.content,
            amount: parsed.amount,
            type: parsed.transactionType,
            date: currentDate,
            category:
              parsed.category || getDefaultCategory(parsed.transactionType), // Use parsed category or fallback to default
          });
          const symbol = parsed.transactionType === 'income' ? '+' : '-';
          toastStore.success(
            `${parsed.transactionType === 'income' ? 'Income' : 'Expense'} added: ${symbol}${formatAmount(parsed.amount)} for "${parsed.content}"`,
          );
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
    toastStore.error(
      error instanceof Error ? error.message : 'Failed to process command',
    );
  } finally {
    isProcessing = false;
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Submit on Enter (without any modifier keys)
  if (
    event.key === 'Enter' &&
    !event.shiftKey &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    processCommand();
    return;
  }

  // Allow Shift+Enter for new lines
  if (event.key === 'Enter' && event.shiftKey) {
    // Let the default behavior happen (new line)
    return;
  }

  // Auto-resize textarea
  if (textareaElement) {
    setTimeout(() => {
      textareaElement.style.height = 'auto';
      textareaElement.style.height =
        Math.min(textareaElement.scrollHeight, 120) + 'px';
    }, 0);
  }
}

function handleInput() {
  // Auto-resize textarea on input
  if (textareaElement) {
    textareaElement.style.height = 'auto';
    textareaElement.style.height =
      Math.min(textareaElement.scrollHeight, 120) + 'px';
  }
}

function insertExample(example: string) {
  userInput = example;
  showDetailedHelp = false;
  // Focus and resize textarea
  if (textareaElement) {
    textareaElement.focus();
    handleInput();
  }
}

// Categorized examples for better organization
const categorizedExamples = {
  tasks: EXAMPLE_COMMANDS.filter((_, i) => i < 6),
  notes: EXAMPLE_COMMANDS.filter((_, i) => i >= 6 && i < 12),
  transactions: EXAMPLE_COMMANDS.filter((_, i) => i >= 12),
};
</script>

<Card title="TempoDay Assistant" icon="edit" iconColor="text-purple-500">
  {#snippet headerAction()}
    <Button
      variant="ghost"
      size="sm"
      onclick={() => showDetailedHelp = true}
      class="text-purple-600 hover:text-purple-700"
    >
      {#snippet children()}
        <Icon name="info-circle" size="sm" class="mr-1" />
        Help
      {/snippet}
    </Button>
  {/snippet}

  {#snippet children()}
    <!-- ChatGPT-style Input Container -->
    <div class="relative">
      <!-- Main Input Area -->
      <div class="relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-200 focus-within:border-purple-500 dark:focus-within:border-purple-400 focus-within:shadow-lg focus-within:shadow-purple-100 dark:focus-within:shadow-purple-900/20">
        <!-- Textarea -->
        <textarea
          bind:this={textareaElement}
          bind:value={userInput}
          onkeydown={handleKeydown}
          oninput={handleInput}
          placeholder="Message TempoDay Assistant..."
          class="w-full px-4 py-3 pr-12 bg-transparent border-0 resize-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base leading-6 max-h-[120px]"
          rows="1"
          style="field-sizing: content;"
        ></textarea>

        <!-- Send Button -->
        <div class="absolute right-2 bottom-2">
          <button
            onclick={processCommand}
            disabled={!userInput.trim() || isProcessing}
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 
              {userInput.trim() && !isProcessing 
                ? 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}"
          >
            {#if isProcessing}
              <Icon name="loader" size="sm" class="animate-spin" />
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Simple AI Preview -->
    {#if userInput.trim() && !isProcessing}
      {@const preview = parseNaturalLanguage(userInput)}
      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 text-sm">
          <span class="px-2 py-1 rounded text-xs font-medium
            {preview.type === 'task' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 
             preview.type === 'note' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 
             preview.type === 'transaction' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 
             'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}">
            {preview.type === 'task' ? '📋 Task' : 
             preview.type === 'note' ? '📝 Note' : 
             preview.type === 'transaction' ? `💰 ${preview.transactionType === 'income' ? 'Income' : 'Expense'}` : 
             '❓ Unknown'}
          </span>
          <span class="text-gray-600 dark:text-gray-400">
            {Math.round(preview.confidence * 100)}% confident
          </span>
        </div>
        
        <p class="text-sm text-gray-800 dark:text-gray-200 mt-2">
          <strong>"{preview.content}"</strong>
          {#if preview.priority && preview.type === 'task'}
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2
              {preview.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
               preview.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300' :
               preview.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
               'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}">
              {preview.priority === 'urgent' ? '🔥' :
               preview.priority === 'high' ? '⚡' :
               preview.priority === 'medium' ? '📋' :
               '📝'} {preview.priority}
            </span>
          {/if}
          {#if preview.amount}
            <span class="font-medium ml-1 {preview.transactionType === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
              {preview.transactionType === 'income' ? '+' : '-'}{formatAmount(preview.amount)}
            </span>
          {/if}
          {#if preview.category && preview.type === 'transaction'}
            {@const categoryConfig = getCategoryConfig(preview.category)}
            <span class="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {categoryConfig.icon} {categoryConfig.label}
            </span>
          {/if}
        </p>
      </div>
    {/if}

    <!-- Detailed Help Bottom Sheet -->
    <BottomSheet bind:open={showDetailedHelp} title="TempoDay Assistant Guide">
      {#snippet children()}
        <div class="space-y-6">
          <!-- Introduction -->
          <div class="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <Icon name="edit" size="2xl" class="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Natural Language TempoDay Assistant</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Simply type what you want to do in plain English, and I'll automatically categorize and add it to the right section.
            </p>
          </div>

          <!-- Task Examples -->
          <div class="space-y-3">
            <h4 class="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Icon name="clipboard" size="sm" class="text-blue-600 dark:text-blue-400" />
              📋 Task Examples
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Use action words and imperatives for tasks:</p>
            <div class="grid gap-2">
              {#each categorizedExamples.tasks as example}
                <button
                  onclick={() => insertExample(example)}
                  class="text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors text-sm text-blue-800 dark:text-blue-200"
                >
                  "{example}"
                </button>
              {/each}
            </div>
          </div>

          <!-- Note Examples -->
          <div class="space-y-3">
            <h4 class="font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Icon name="edit" size="sm" class="text-purple-600 dark:text-purple-400" />
              📝 Note Examples
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Write personal thoughts, reflections, and experiences:</p>
            <div class="grid gap-2">
              {#each categorizedExamples.notes as example}
                <button
                  onclick={() => insertExample(example)}
                  class="text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors text-sm text-purple-800 dark:text-purple-200"
                >
                  "{example}"
                </button>
              {/each}
            </div>
          </div>

          <!-- Transaction Examples -->
          <div class="space-y-3">
            <h4 class="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
              <Icon name="dollar" size="sm" class="text-green-600 dark:text-green-400" />
              💰 Transaction Examples
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Include amounts and transaction keywords:</p>
            <div class="grid gap-2">
              {#each categorizedExamples.transactions as example}
                <button
                  onclick={() => insertExample(example)}
                  class="text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 transition-colors text-sm text-green-800 dark:text-green-200"
                >
                  "{example}"
                </button>
              {/each}
            </div>
          </div>

          <!-- Pro Tips -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon name="info-circle" size="sm" class="text-gray-600 dark:text-gray-400" />
              🚀 Pro Tips
            </h4>
            <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li class="flex items-start gap-2">
                <span class="text-blue-500 dark:text-blue-400 font-bold">•</span>
                <span><strong>Tasks:</strong> Start with action verbs like "call", "buy", "schedule", "finish"</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 dark:text-blue-400 font-bold">•</span>
                <span><strong>Priority:</strong> Use words like "urgent", "important", "soon" for higher priority tasks</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span><strong>Notes:</strong> Use past tense and emotional language like "felt", "learned", "grateful"</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 dark:text-green-400 font-bold">•</span>
                <span><strong>Transactions:</strong> Include dollar amounts and keywords like "spent", "earned", "paid"</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-500 dark:text-gray-400 font-bold">•</span>
                <span><strong>Quick Submit:</strong> Press Enter to send, Shift+Enter for new lines</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-500 dark:text-gray-400 font-bold">•</span>
                <span><strong>Preview:</strong> Watch the confidence score to see how well the AI understands</span>
              </li>
            </ul>
          </div>

          <!-- Close Button -->
          <Button
            variant="notes"
            onclick={() => showDetailedHelp = false}
            class="w-full mt-6"
          >
            {#snippet children()}
              <Icon name="check" size="sm" class="mr-2" />
              Got it, let's start!
            {/snippet}
          </Button>
        </div>
      {/snippet}
    </BottomSheet>
  {/snippet}
</Card>