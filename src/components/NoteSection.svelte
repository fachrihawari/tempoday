<script lang="ts">
  import { currentDayData, updateCurrentDayData } from "../lib/stores";

  let note = $derived($currentDayData.note);

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

<section class="bg-white rounded-lg border border-gray-200 p-4">
  <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <svg
      class="w-5 h-5 text-purple-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      ></path>
    </svg>
    Daily Note
  </h2>

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
        <button
          onclick={saveNote}
          class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
        >
          Save
        </button>
        <button
          onclick={cancelEditing}
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
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
            <p class="text-sm">+ Add Note</p>
            <p class="text-xs mt-1">Tap to write your daily thoughts</p>
          </div>
        </div>
      {/if}
    </button>

    {#if note.trim()}
      <button
        onclick={startEditing}
        class="mt-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
      >
        Edit note
      </button>
    {/if}
  {/if}
</section>
