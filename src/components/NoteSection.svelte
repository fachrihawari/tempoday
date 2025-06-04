<script lang="ts">
  import { currentDayData, updateCurrentDayData } from "../lib/stores";
  import Card from './ui/Card.svelte';
  import Button from './ui/Button.svelte';
  import Icon from './ui/Icon.svelte';
  import EmptyState from './ui/EmptyState.svelte';
  import BottomSheet from './ui/BottomSheet.svelte';
  import Textarea from './ui/Textarea.svelte';

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

  function saveNote(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    updateNote(editingText);
    cancelEditing();
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
    <!-- Note Edit Form -->
    <BottomSheet bind:open={isEditing} title={note.trim() ? "Edit Note" : "Add Note"}>
      {#snippet children()}
        <form onsubmit={saveNote} class="space-y-6">
          <Textarea
            bind:value={editingText}
            placeholder="Write your thoughts, reflections, or anything you want to remember about this day..."
            label="Daily Note"
            theme="notes"
            rows={8}
            autoResize={true}
            required
          />
          <div class="flex gap-3 pt-2">
            <Button 
              type="button"
              variant="ghost"
              onclick={cancelEditing}
              class="flex-none w-1/4"
            >
              {#snippet children()}
                Cancel
              {/snippet}
            </Button>
            <Button 
              type="submit"
              variant="notes"
              class="flex-1"
            >
              {#snippet children()}
                <Icon name="save" size="sm" class="mr-2" />
                Save Note
              {/snippet}
            </Button>
          </div>
        </form>
      {/snippet}
    </BottomSheet>

    {#if !isEditing}
      <div class="{note.trim() ? 'mb-4' : ''}">
        {#if note.trim()}
          <button onclick={startEditing} class="cursor-text w-full text-left">
            <div
              class="bg-gray-50 rounded-lg p-3 min-h-[80px] whitespace-pre-wrap text-sm text-gray-900 leading-relaxed"
            >
              {note}
            </div>
          </button>
        {:else}
          <EmptyState
            icon="edit"
            title="Add Note"
            subtitle="Tap to write your daily thoughts"
            onclick={startEditing}
          />
        {/if}
      </div>

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
