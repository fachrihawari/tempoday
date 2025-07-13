<script lang="ts">
import DatePicker from '../components/DatePicker.svelte';
import BottomSheet from '../components/ui/BottomSheet.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import EmptyState from '../components/ui/EmptyState.svelte';
import Icon from '../components/ui/Icon.svelte';
import Loading from '../components/ui/Loading.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import Textarea from '../components/ui/Textarea.svelte';
import { formatDateKey } from '../lib/date';
import { appState } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveRouter } from '../stores/router.svelte';
import { toastStore } from '../stores/toast.svelte';

// Reactive values from the store
let { isLoading, isSaving, error, content, hasNote } = $derived(reactiveNotes);
let router = $derived(reactiveRouter);

let isEditing = $state(false);
let editingText = $state('');

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

function startEditing() {
  editingText = content;
  isEditing = true;
}

async function saveNote(event?: Event) {
  if (event) {
    event.preventDefault();
  }

  const dateKey = formatDateKey(appState.selectedDate);
  try {
    await reactiveNotes.saveNote({ content: editingText, date: dateKey });
    toastStore.success('Note saved successfully');
    cancelEditing();
  } catch (err) {
    console.error('Failed to save note:', err);
    // Error is already handled by reactive store
  }
}

function cancelEditing() {
  editingText = '';
  isEditing = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    cancelEditing();
  }
  // Allow Ctrl+Enter or Cmd+Enter to save
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    saveNote();
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
  {#snippet children()}
    <!-- Note Edit Form -->
    <BottomSheet
      bind:open={isEditing}
      title={hasNote ? "Edit Note" : "Add Note"}
    >
      {#snippet children()}
        <form onsubmit={saveNote} class="space-y-6">
          <Textarea
            bind:value={editingText}
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

    <!-- Note Content - Always visible -->
    <div class={hasNote ? "mb-4" : ""}>
      {#if isLoading}
        <Loading size="xl" message="Loading note..." />
      {:else if hasNote}
        <button onclick={startEditing} class="cursor-text w-full text-left">
          <div
            class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-h-[80px] whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 leading-relaxed border border-gray-200 dark:border-gray-700"
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

    {#if hasNote && !isLoading}
      <Button
        variant="notes"
        dashed={true}
        onclick={startEditing}
        class="mt-2"
        fullWidth
      >
        {#snippet children()}
          <Icon name="edit" size="sm" class="mr-1" />
          Edit note
        {/snippet}
      </Button>
    {/if}
  {/snippet}
</Card>