<script lang="ts">
import { formatDateKey } from '../lib/date';
import { parseNaturalLanguage, EXAMPLE_COMMANDS, type ParsedCommand } from '../lib/nlp';
import { appState } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import Alert from './ui/Alert.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import Icon from './ui/Icon.svelte';
import BottomSheet from './ui/BottomSheet.svelte';

let userInput = $state('');
let isProcessing = $state(false);
let lastParsedCommand = $state<ParsedCommand | null>(null);
let showDetailedHelp = $state(false);
let processingResult = $state<{ type: 'success' | 'error'; message: string } | null>(null);
let textareaElement: HTMLTextAreaElement = $state()!;

// Get current date for operations
const currentDate = $derived(formatDateKey(appState.selectedDate));

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
          message: `✅ Task created: "${parsed.content}"`
        };
        break;
        
      case 'note':
        await reactiveNotes.saveNote({
          content: parsed.content,
          date: currentDate
        });
        processingResult = {
          type: 'success',
          message: `📝 Note saved: "${parsed.content.substring(0, 50)}${parsed.content.length > 50 ? '...' : ''}"`
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
            message: `💰 ${parsed.transactionType === 'income' ? 'Income' : 'Expense'} added: ${symbol}$${parsed.amount} for "${parsed.content}"`
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
  // Submit on Enter (without any modifier keys)
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
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
      textareaElement.style.height = Math.min(textareaElement.scrollHeight, 120) + 'px';
    }, 0);
  }
}

function handleInput() {
  // Auto-resize textarea on input
  if (textareaElement) {
    textareaElement.style.height = 'auto';
    textareaElement.style.height = Math.min(textareaElement.scrollHeight, 120) + 'px';
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

function clearResult() {
  processingResult = null;
}

// Categorized examples for better organization
const categorizedExamples = {
  tasks: EXAMPLE_COMMANDS.filter((_, i) => i < 6),
  notes: EXAMPLE_COMMANDS.filter((_, i) => i >= 6 && i < 12),
  transactions: EXAMPLE_COMMANDS.filter((_, i) => i >= 12)
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
    {#if processingResult}
      <Alert
        type={processingResult.type === 'success' ? 'success' : 'error'}
        description={processingResult.message}
        dismissible={true}
        onDismiss={clearResult}
        class="mb-4"
      />
    {/if}

    <!-- ChatGPT-style Input Container -->
    <div class="relative">
      <!-- Main Input Area -->
      <div class="relative flex items-center bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-100">
        <!-- Textarea -->
        <textarea
          bind:this={textareaElement}
          bind:value={userInput}
          onkeydown={handleKeydown}
          oninput={handleInput}
          placeholder="Message TempoDay Assistant..."
          class="w-full px-4 py-3 pr-12 bg-transparent border-0 resize-none focus:outline-none text-gray-900 placeholder-gray-500 text-base leading-6 max-h-[120px]"
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
                ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}"
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

    <!-- AI Preview (ChatGPT-style) -->
    {#if userInput.trim() && !isProcessing}
      {@const preview = parseNaturalLanguage(userInput)}
      <div class="mt-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200">
        <div class="flex items-start gap-3">
          <!-- AI Avatar -->
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="edit" size="sm" class="text-white" />
          </div>
          
          <!-- AI Response -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-medium text-gray-900">TempoDay Assistant</span>
              <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                {Math.round(preview.confidence * 100)}% confident
              </span>
            </div>
            
            <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 rounded-md text-xs font-medium
                  {preview.type === 'task' ? 'bg-blue-100 text-blue-700' : 
                   preview.type === 'note' ? 'bg-purple-100 text-purple-700' : 
                   'bg-green-100 text-green-700'}">
                  {preview.type === 'task' ? '📋 Task' : 
                   preview.type === 'note' ? '📝 Note' : 
                   preview.type === 'transaction' ? `💰 ${preview.transactionType === 'income' ? 'Income' : 'Expense'}` : 
                   '❓ Unknown'}
                </span>
              </div>
              
              <p class="text-sm text-gray-800 leading-relaxed">
                I'll create: <strong>"{preview.content}"</strong>
                {#if preview.amount}
                  <span class="text-green-600 font-medium"> for ${preview.amount}</span>
                {/if}
              </p>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Detailed Help Bottom Sheet -->
    <BottomSheet bind:open={showDetailedHelp} title="TempoDay Assistant Guide">
      {#snippet children()}
        <div class="space-y-6">
          <!-- Introduction -->
          <div class="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <Icon name="edit" size="2xl" class="text-purple-600 mx-auto mb-2" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Natural Language TempoDay Assistant</h3>
            <p class="text-sm text-gray-600">
              Simply type what you want to do in plain English, and I'll automatically categorize and add it to the right section.
            </p>
          </div>

          <!-- Task Examples -->
          <div class="space-y-3">
            <h4 class="font-semibold text-blue-700 flex items-center gap-2">
              <Icon name="clipboard" size="sm" class="text-blue-600" />
              📋 Task Examples
            </h4>
            <p class="text-sm text-gray-600 mb-3">Use action words and imperatives for tasks:</p>
            <div class="grid gap-2">
              {#each categorizedExamples.tasks as example}
                <button
                  onclick={() => insertExample(example)}
                  class="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-sm text-blue-800"
                >
                  "{example}"
                </button>
              {/each}
            </div>
          </div>

          <!-- Note Examples -->
          <div class="space-y-3">
            <h4 class="font-semibold text-purple-700 flex items-center gap-2">
              <Icon name="edit" size="sm" class="text-purple-600" />
              📝 Note Examples
            </h4>
            <p class="text-sm text-gray-600 mb-3">Write personal thoughts, reflections, and experiences:</p>
            <div class="grid gap-2">
              {#each categorizedExamples.notes as example}
                <button
                  onclick={() => insertExample(example)}
                  class="text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-sm text-purple-800"
                >
                  "{example}"
                </button>
              {/each}
            </div>
          </div>

          <!-- Transaction Examples -->
          <div class="space-y-3">
            <h4 class="font-semibold text-green-700 flex items-center gap-2">
              <Icon name="dollar" size="sm" class="text-green-600" />
              💰 Transaction Examples
            </h4>
            <p class="text-sm text-gray-600 mb-3">Include amounts and transaction keywords:</p>
            <div class="grid gap-2">
              {#each categorizedExamples.transactions as example}
                <button
                  onclick={() => insertExample(example)}
                  class="text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-sm text-green-800"
                >
                  "{example}"
                </button>
              {/each}
            </div>
          </div>

          <!-- Pro Tips -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon name="info-circle" size="sm" class="text-gray-600" />
              🚀 Pro Tips
            </h4>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">•</span>
                <span><strong>Tasks:</strong> Start with action verbs like "call", "buy", "schedule", "finish"</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-purple-500 font-bold">•</span>
                <span><strong>Notes:</strong> Use past tense and emotional language like "felt", "learned", "grateful"</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 font-bold">•</span>
                <span><strong>Transactions:</strong> Include dollar amounts and keywords like "spent", "earned", "paid"</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-500 font-bold">•</span>
                <span><strong>Quick Submit:</strong> Press Enter to send, Shift+Enter for new lines</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-gray-500 font-bold">•</span>
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