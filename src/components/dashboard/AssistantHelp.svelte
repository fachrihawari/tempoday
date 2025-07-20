<script lang="ts">
import { EXAMPLE_COMMANDS } from '../../lib/nlp';
import BottomSheet from '../ui/BottomSheet.svelte';
import Button from '../ui/Button.svelte';
import Icon from '../ui/Icon.svelte';

type Props = {
  open: boolean;
  onSelect: (command: string) => void;
};

let { open = $bindable(), onSelect }: Props = $props();

// Example sections configuration
const exampleSections = [
  {
    key: 'tasks',
    title: '📋 Task Examples',
    icon: 'clipboard' as const,
    description: 'Use action words and imperatives for tasks:',
    examples: EXAMPLE_COMMANDS.tasks,
    colors: {
      header: 'text-blue-700 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
    },
  },
  {
    key: 'notes',
    title: '📝 Note Examples',
    icon: 'edit' as const,
    description: 'Write personal thoughts, reflections, and experiences:',
    examples: EXAMPLE_COMMANDS.notes,
    colors: {
      header: 'text-purple-700 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-800 dark:text-purple-200',
    },
  },
  {
    key: 'transactions',
    title: '💰 Transaction Examples',
    icon: 'dollar' as const,
    color: 'green',
    description: 'Include amounts and transaction keywords:',
    examples: EXAMPLE_COMMANDS.transactions,
    colors: {
      header: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
    },
  },
];

// Pro tips for the help section
const proTips = [
  {
    title: 'Tasks',
    description:
      'Start with action verbs like "call", "buy", "schedule", "finish"',
  },
  {
    title: 'Priority',
    description:
      'Use words like "urgent", "important", "soon" for higher priority tasks',
  },
  {
    title: 'Notes',
    description:
      'Use past tense and emotional language like "felt", "learned", "grateful"',
  },
  {
    title: 'Transactions',
    description:
      'Include dollar amounts and keywords like "spent", "earned", "paid"',
  },
  {
    title: 'Quick Submit',
    description: 'Press Enter to send, Shift+Enter for new lines',
  },
  {
    title: 'Preview',
    description:
      'Watch the confidence score to see how well the AI understands',
  },
];
</script>

<!-- Detailed Help Bottom Sheet -->
<BottomSheet bind:open title="TempoDay Assistant Guide">
  {#snippet children()}
    <div class="space-y-6">
      <!-- Introduction -->
      <div
        class="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
      >
        <Icon
          name="edit"
          size="2xl"
          class="text-purple-600 dark:text-purple-400 mx-auto mb-2"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Natural Language TempoDay Assistant
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Simply type what you want to do in plain English, and I'll
          automatically categorize and add it to the right section.
        </p>
      </div>

      <!-- Example Sections -->
      {#each exampleSections as section}
        <div class="space-y-3">
          <h4 class="font-semibold {section.colors.header} flex items-center gap-2">
            <Icon
              name={section.icon}
              size="sm"
              class={section.colors.icon}
            />
            {section.title}
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {section.description}
          </p>
          <div class="grid gap-2">
            {#each section.examples as example}
              <button
                onclick={() => onSelect(example)}
                class="text-left p-3 rounded-lg border transition-colors text-sm {section.colors.bg} {section.colors.hover} {section.colors.border} {section.colors.text}"
              >
                "{example}"
              </button>
            {/each}
          </div>
        </div>
      {/each}

      <!-- Pro Tips -->
      <div
        class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
      >
        <h4
          class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"
        >
          <Icon
            name="info-circle"
            size="sm"
            class="text-gray-600 dark:text-gray-400"
          />
          🚀 Pro Tips
        </h4>
        <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {#each proTips as tip}
            <li class="flex items-start gap-2">
              <span class="text-gray-500 dark:text-gray-400 font-bold">•</span>
              <span>
                <strong>{tip.title}:</strong>
                {tip.description}
              </span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Close Button -->
      <Button
        variant="notes"
        onclick={() => (open = false)}
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
