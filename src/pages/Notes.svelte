<script lang="ts">
  import DatePicker from "../components/shared/DatePicker.svelte";
  import Button from "../components/ui/Button.svelte";
  import Card from "../components/ui/Card.svelte";
  import Icon from "../components/ui/Icon.svelte";
  import PageHeader from "../components/ui/PageHeader.svelte";
  import { getSelectedDateKey } from "../stores/app.svelte";
  import { reactiveNotes } from "../stores/notes.svelte";
  import { reactiveRouter } from "../stores/router.svelte";
  import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
  import { commonmark } from "@milkdown/kit/preset/commonmark";
  import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";

  // Reactive values from the store
  let router = $derived(reactiveRouter);

  let editor: Editor;

  // Debounce timeout for auto-save
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  // currentNoteLoaded is used to track if the note has been loaded
  let currentNoteLoaded = "";

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
      currentNoteLoaded = ""; // Reset loaded note date
    };
  });

  function initEditor(content: string = "") {
    editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, document.querySelector("#editor"));
        ctx.set(defaultValueCtx, content);

        // Set up the listener to handle markdown updates
        const listener = ctx.get(listenerCtx);
        listener.markdownUpdated((_ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            debouncedSave(markdown);
          }
        });
      })
      .use(listener)
      .use(commonmark);
    editor.create();
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
  <div class="prose dark:prose-invert" id="editor"></div>
</Card>

<style>
  :global(.ProseMirror > *) {
    padding: 0 !important;
    margin: 0 !important;
  }

  :global(.ProseMirror p, .ProseMirror li) {
    padding: 0 !important;
    margin: 0 !important;
  }

  :global(.ProseMirror ul, .ProseMirror ol) {
    padding-inline-start: 1.25em !important;
  }

  :global(.ProseMirror-focused) {
    outline: none;
  }
</style>
