<!-- Reusable Modal Component -->
<script lang="ts">
  import Icon from './Icon.svelte';

  interface Props {
    open: boolean;
    title?: string;
    onClose?: () => void;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    children: any;
  }

  let { 
    open = $bindable(),
    title = '',
    onClose,
    maxWidth = 'md',
    children 
  }: Props = $props();

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  function handleClose() {
    open = false;
    onClose?.();
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }
</script>

{#if open}
  <div 
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="0"
  >
    <div class="bg-white rounded-lg {maxWidths[maxWidth]} w-full max-h-[80vh] overflow-y-auto">
      {#if title}
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onclick={handleClose}
            class="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Close modal"
          >
            <Icon name="close" />
          </button>
        </div>
      {/if}
      
      <div class="{title ? 'p-4' : 'p-6'}">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
