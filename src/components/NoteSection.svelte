<script lang="ts">
  import { currentDayData, updateCurrentDayData } from "../lib/stores";
  import Card from './ui/Card.svelte';
  import Button from './ui/Button.svelte';
  import Icon from './ui/Icon.svelte';

  const note = $derived($currentDayData.note);

  let isEditing = $state(false);
  let editingText = $state("");

  function updateNote(newNote: string) {
    updateCurrentDayData({ note: newNote });
  }

  function startEditing() {
    editingText = note;
    isEditing = true;
  }

  function saveNote() {
    updateNote(editingText);
    isEditing = false;
  }

  function cancelEditing() {
    editingText = "";
    isEditing = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      cancelEditing();
    }
    // Allow Ctrl+Enter or Cmd+Enter to save
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      saveNote();
    }
  }

  // Auto-save functionality with debounce
  let saveTimeout: number;
  function handleInput() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      updateNote(editingText);
    }, 1000); // Auto-save after 1 second of no typing
  }
</script>

<Card title="Daily Note" icon="edit" iconColor="text-purple-500">
  {#snippet children()}
    {#if isEditing}
      <div class="space-y-3">
        <textarea
          bind:value={editingText}
          oninput={handleInput}
          onkeydown={handleKeydown}
          placeholder="Write your thoughts, reflections, or anything you want to remember about this day..."
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
        ></textarea>

        <div class="flex gap-2">
          <Button
            variant="notes"
            onclick={saveNote}
          >
            {#snippet children()}Save{/snippet}
          </Button>
          <Button
            variant="secondary"
            onclick={cancelEditing}
          >
            {#snippet children()}Cancel{/snippet}
          </Button>
        </div>
        <p class="text-xs text-gray-500">
          Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to save, or Escape to cancel.
          Auto-saves after 1 second.
        </p>
      </div>
    {:else}
      <button onclick={startEditing} class="cursor-text w-full text-left">
        {#if note.trim()}
          <div
            class="bg-gray-50 rounded-lg p-3 min-h-[80px] whitespace-pre-wrap text-sm text-gray-900 leading-relaxed"
          >
            {note}
          </div>
        {:else}
          <div
            class="bg-gray-50 rounded-lg p-3 min-h-[80px] flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors"
          >
            <div class="text-center text-gray-500">
              <Icon name="plus" size="sm" class="mx-auto mb-2" />
              <p class="text-sm">Add Note</p>
              <p class="text-xs mt-1">Tap to write your daily thoughts</p>
            </div>
          </div>
        {/if}
      </button>

      {#if note.trim()}
        <Button
          variant="notes"
          dashed={true}
          onclick={startEditing}
          class="mt-2"
        >
          {#snippet children()}
            <Icon name="edit" size="sm" class="mr-1" />
            Edit note
          {/snippet}
        </Button>
      {/if}
    {/if}
  {/snippet}
</Card>
