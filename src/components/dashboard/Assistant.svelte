<script lang="ts">
import { getCategoryConfig, getDefaultCategory } from '../../lib/categories';
import { formatCurrency } from '../../lib/currency';
import { formatDateKey } from '../../lib/date';
import { type ParsedCommand, parseNaturalLanguage } from '../../lib/nlp';
import { appState } from '../../stores/app.svelte';
import { reactiveNotes } from '../../stores/notes.svelte';
import { settingsStore } from '../../stores/settings.svelte';
import { reactiveTasks } from '../../stores/tasks.svelte';
import { toastStore } from '../../stores/toast.svelte';
import { reactiveTransactions } from '../../stores/transactions.svelte';
import Button from '../ui/Button.svelte';
import Card from '../ui/Card.svelte';
import Icon from '../ui/Icon.svelte';
import AssistantHelp from './AssistantHelp.svelte';
import AssistantPreview from './AssistantPreview.svelte';

let userInput = $state('');
let lastParsedCommand = $state<ParsedCommand | null>(null);
let showDetailedHelp = $state(false);
let textareaElement: HTMLTextAreaElement = $state()!;

// Get current date for operations
const currentDate = $derived(formatDateKey(appState.selectedDate));

// Derived preview that updates when userInput changes
const preview = $derived(
  userInput.trim() ? parseNaturalLanguage(userInput) : null,
);

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
            disabled={!userInput.trim()}
            aria-label="Send message"
            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 
              {userInput.trim()
                ? 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}"
            title="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Simple AI Preview -->
    {#if preview}
      <AssistantPreview {preview} />
    {/if}

    <AssistantHelp bind:open={showDetailedHelp} onSelect={insertExample} />
  {/snippet}
</Card>