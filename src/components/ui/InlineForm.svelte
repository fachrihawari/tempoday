<!-- Reusable Form Component for Add/Edit Actions -->
<script lang="ts">
  import { sectionThemes, type SectionTheme } from '../../lib/theme';

  interface Props {
    show: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    submitText?: string;
    cancelText?: string;
    submitVariant?: 'primary' | 'secondary' | 'danger' | SectionTheme;
    children: any;
    className?: string;
  }

  let { 
    show = $bindable(),
    onSubmit,
    onCancel,
    submitText = 'Save',
    cancelText = 'Cancel',
    submitVariant = 'primary',
    children,
    className = ''
  }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      onSubmit();
    } else if (event.key === 'Escape') {
      onCancel();
    }
  }

  // Get theme-aware button styles
  const buttonStyles = $derived(() => {
    const themeVariants = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',  
      danger: 'bg-red-500 text-white hover:bg-red-600',
      notes: sectionThemes.notes.colors.button.solid,
      todos: sectionThemes.todos.colors.button.solid,
      financials: sectionThemes.financials.colors.button.solid
    };
    
    return themeVariants[submitVariant as keyof typeof themeVariants] || themeVariants.primary;
  });
</script>

{#if show}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="space-y-3 {className}" onkeydown={handleKeydown}>
    <!-- Form Fields -->
    <div class="space-y-3">
      {@render children()}
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button
        onclick={onSubmit}
        class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors {buttonStyles()}"
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
