<script lang="ts">
import { onMount } from 'svelte';
import DatePicker from '../components/DatePicker.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { getSelectedDateKey } from '../stores/app.svelte';
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

// currentNoteLoaded is used to track if the note has been loaded
let currentNoteLoaded = $state("")

let dateKey = $derived.by(getSelectedDateKey)

// Debounced save function
function debouncedSave(markdown: string) {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Set new timeout for auto-save (1000ms delay)
  saveTimeout = setTimeout(async () => {
    reactiveNotes.saveNote({
      date: dateKey,
      content: markdown,
    });
  }, 500);
}

// Watch for date changes and load note
$effect(() => {
  if (dateKey === currentNoteLoaded) {
    return; // No change in date, skip loading
  }
  reactiveNotes.loadNote(dateKey);
  currentNoteLoaded = dateKey; // Update loaded note date
  console.log(`Loading note for date: ${dateKey}`);
});

// Watch for errors and show toast
$effect(() => {
  if (error) {
    toastStore.error(error);
    reactiveNotes.clearError();
  }
});

$effect(() => {
  if (content) {
    currentNoteLoaded = dateKey; // Update loaded note date
  }
});

onMount(() => {
  console.log('Initializing editor...');

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

  editor.create()
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
