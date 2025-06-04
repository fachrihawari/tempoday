<script lang="ts">
  import { currentDayData, updateCurrentDayData } from "../lib/stores";
  import Card from './ui/Card.svelte';
  import Button from './ui/Button.svelte';
  import Icon from './ui/Icon.svelte';
  import EmptyState from './ui/EmptyState.svelte';
  import InlineForm from './ui/InlineForm.svelte';

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
    <InlineForm
      bind:show={isEditing}
      onSubmit={saveNote}
      onCancel={cancelEditing}
      submitText="Save Note"
      submitVariant="notes"
    >
      {#snippet children()}
        <textarea
          bind:value={editingText}
          oninput={handleInput}
          onkeydown={handleKeydown}
          placeholder="Write your thoughts, reflections, or anything you want to remember about this day..."
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
          aria-label="Daily note"
        ></textarea>
      {/snippet}
    </InlineForm>

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
