<script lang="ts">
import DatePicker from '../components/shared/DatePicker.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { getSelectedDateKey } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveRouter } from '../stores/router.svelte';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import { Crepe } from '@milkdown/crepe';

// Reactive values from the store
let router = $derived(reactiveRouter);

let editor: Crepe | null = null;

// Debounce timeout for auto-save
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// currentNoteLoaded is used to track if the note has been loaded
let currentNoteLoaded = '';

let dateKey = $derived.by(getSelectedDateKey);

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

  reactiveNotes.getNoteByDate(dateKey).then((note) => {
    initEditor(note?.content);
    currentNoteLoaded = dateKey;
  });

  return () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    if (editor) {
      editor.destroy();
    }
    currentNoteLoaded = ''; // Reset loaded note date
  };
});

function initEditor(content: string = '') {
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
  editor.create();
}

function showSlashMenu() {
  const editorRoot = document.querySelector('#editor [contenteditable]');
  if (editorRoot) {
    // Focus the editor if not already focused
    const element = editorRoot as HTMLDivElement;
    element.focus();

    const range = document.createRange();

    // Select all the content of the element
    range.selectNodeContents(element);

    // Collapse the range to the end point.
    // The 'false' argument collapses it to the end.
    range.collapse(false);

    // Get the current selection
    const selection = window.getSelection();

    // Remove any existing selections
    selection?.removeAllRanges();

    // Add our new, collapsed range
    selection?.addRange(range);

    // First, trigger Enter keydown to ensure a new line is created
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    editorRoot.dispatchEvent(enterEvent);
    // Then, trigger Slash keydown to open the slash menu
    const slashEvent = new KeyboardEvent('keydown', {
      key: '/',
      code: 'Slash',
      keyCode: 191,
      which: 191,
      bubbles: true,
      cancelable: true,
    });
    editorRoot.dispatchEvent(slashEvent);
  }
}
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
  <Button
    onclick={showSlashMenu}
    variant="outline"
    aria-label="Add Custom Block"
  >
    <Icon name="plus" />
  </Button>
</Card>

<style>
  :global(.milkdown-slash-menu) {
    position: fixed !important;
    bottom: 64px !important;
    left: 0 !important;
    top: unset !important;
    right: 0 !important;
    border-radius: 12px 12px 0 0 !important;
    height: 400px !important;
  }
  :global(.milkdown-slash-menu .menu-groups) {
    height: 100% !important;
    max-height: 400px !important;
    overflow-y: auto !important;
  }
</style>
