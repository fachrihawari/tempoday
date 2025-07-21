<script lang="ts">
import { onMount } from 'svelte';
import DatePicker from '../components/DatePicker.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { formatDateKey } from '../lib/date';
import { appState } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveRouter } from '../stores/router.svelte';
import { toastStore } from '../stores/toast.svelte';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import { Crepe } from '@milkdown/crepe';

// Reactive values from the store
let { error, content } = $derived(reactiveNotes);
let router = $derived(reactiveRouter);


let editor: Crepe | null = null;
// Debounce timeout for auto-save
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// Debounced save function
function debouncedSave(markdown: string) {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout for auto-save (1000ms delay)
  saveTimeout = setTimeout(async () => {
    reactiveNotes.saveNote({
      date: formatDateKey(appState.selectedDate),
      content: markdown,
    });
  }, 500);
}

// Watch for date changes and load note
$effect(() => {
  const dateKey = formatDateKey(appState.selectedDate);
  reactiveNotes.loadNote(dateKey);
});

// Watch for errors and show toast
$effect(() => {
  if (error) {
    toastStore.error(error);
    reactiveNotes.clearError();
  }
});

$effect(() => {
  // Only (re)initialize the editor when content changes
  if (!content) return;

  console.log('Initializing editor with content:', content);

  // Destroy previous editor instance if exists
  editor?.destroy?.();

  editor = new Crepe({
    root: '#editor',
    defaultValue: content,
    featureConfigs: {
      [Crepe.Feature.Placeholder]: {
        text: 'Start writing your note...',
      },
    },
  }).on((api) => {
    // Update reactiveNotes when content changes with debounce
    api.markdownUpdated((_ctx, markdown) => {
      debouncedSave(markdown);
    });
  });

  editor.create().then(() => {
    console.log('Editor initialized successfully');
  });

  // Cleanup on unmount
  return () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    editor?.destroy?.();
  };
});
</script>

<!-- Header Component -->
<PageHeader title="Notes" icon="edit">
  <!-- Search button -->
  <Button
    onclick={() => router.navigate("/search")}
    variant="outline"
    aria-label="Go to search page"
  >
    <Icon name="search" class="text-gray-600 dark:text-gray-300" />
  </Button>
</PageHeader>

<!-- DatePicker Component -->
<DatePicker />

<Card>
  <div id="editor"></div>
</Card>
