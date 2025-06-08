<script lang="ts">
  import { reactiveNotes } from "../db/reactive/notes.svelte";
  import { selectedDate, formatDateKey } from "../lib/stores";
  import BottomSheet from "./ui/BottomSheet.svelte";
  import Button from "./ui/Button.svelte";
  import Card from "./ui/Card.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import Icon from "./ui/Icon.svelte";
  import Textarea from "./ui/Textarea.svelte";
  import Loading from "./ui/Loading.svelte";
  import Alert from "./ui/Alert.svelte";

  // Reactive values from the repository
  let { isLoading, isSaving, error, content, hasContent } =
    $derived(reactiveNotes);

  let isEditing = $state(false);
  let editingText = $state("");

  // Watch for date changes and load note
  $effect(() => {
    const dateKey = formatDateKey($selectedDate);
    reactiveNotes.loadNote(dateKey);
  });

  function startEditing() {
    editingText = content;
    isEditing = true;
  }

  async function saveNote(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const dateKey = formatDateKey($selectedDate);
    try {
      await reactiveNotes.saveNote(editingText, dateKey);
      cancelEditing();
    } catch (err) {
      console.error("Failed to save note:", err);
      // Error is already handled by reactive store
    }
  }

  function cancelEditing() {
    editingText = "";
    isEditing = false;
    // Clear any error when closing form
    if (error) {
      reactiveNotes.clearError();
    }
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
  function handleInput() {
    const dateKey = formatDateKey($selectedDate);
    reactiveNotes.autoSaveNote(editingText, dateKey, 1000);
  }
</script>

<Card title="Daily Note" icon="edit" iconColor="text-purple-500">
  {#snippet children()}
    {#if error}
      <Alert
        type="error"
        description={error}
        onDismiss={() => reactiveNotes.clearError()}
        class="mb-4"
      />
    {/if}

    <!-- Note Edit Form -->
    <BottomSheet
      bind:open={isEditing}
      title={hasContent ? "Edit Note" : "Add Note"}
    >
      {#snippet children()}
        <form onsubmit={saveNote} class="space-y-6">
          <Textarea
            bind:value={editingText}
            oninput={handleInput}
            onkeydown={handleKeydown}
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
              disabled={isSaving}
            >
              {#snippet children()}
                {#if isSaving}
                  <Icon name="loader" size="sm" class="mr-2 animate-spin" />
                  Saving...
                {:else}
                  <Icon name="save" size="sm" class="mr-2" />
                  Save Note
                {/if}
              {/snippet}
            </Button>
          </div>
        </form>
      {/snippet}
    </BottomSheet>

    {#if !isEditing}
      <div class={hasContent ? "mb-4" : ""}>
        {#if isLoading}
          <Loading size="lg" message="Loading note..." />
        {:else if hasContent}
          <button onclick={startEditing} class="cursor-text w-full text-left">
            <div
              class="bg-gray-50 rounded-lg p-3 min-h-[80px] whitespace-pre-wrap text-sm text-gray-900 leading-relaxed"
            >
              {content}
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

      {#if hasContent && !isLoading}
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
