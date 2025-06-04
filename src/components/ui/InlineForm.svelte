<!-- Reusable Form Component for Add/Edit Actions -->
<script lang="ts">
  interface Props {
    show: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    submitText?: string;
    cancelText?: string;
    submitVariant?: 'primary' | 'secondary' | 'danger' | 'notes' | 'todos' | 'financials';
    children: any;
  }

  let { 
    show = $bindable(),
    onSubmit,
    onCancel,
    submitText = 'Save',
    cancelText = 'Cancel',
    submitVariant = 'primary',
    children 
  }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      onSubmit();
    } else if (event.key === 'Escape') {
      onCancel();
    }
  }
</script>

{#if show}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="space-y-3" onkeydown={handleKeydown}>
    <!-- Form Fields -->
    <div class="space-y-3">
      {@render children()}
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button
        onclick={onSubmit}
        class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
          {submitVariant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' :
           submitVariant === 'secondary' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :
           submitVariant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' :
           submitVariant === 'notes' ? 'bg-purple-500 text-white hover:bg-purple-600' :
           submitVariant === 'todos' ? 'bg-blue-500 text-white hover:bg-blue-600' :
           submitVariant === 'financials' ? 'bg-green-500 text-white hover:bg-green-600' :
           'bg-blue-500 text-white hover:bg-blue-600'}"
      >
        {submitText}
      </button>
      <button
        onclick={onCancel}
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
      >
        {cancelText}
      </button>
    </div>

    <p class="text-xs text-gray-500">
      Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to save, or Escape to cancel.
    </p>
  </div>
{/if}
