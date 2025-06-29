<script lang="ts">
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import Icon, { type IconName } from './Icon.svelte';

interface Props {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
}

let {
  id,
  type,
  title,
  message,
  duration = 5000,
  dismissible = true,
  onDismiss,
}: Props = $props();

let visible = $state(true);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const typeConfig: Record<
  Props['type'],
  { classes: string; icon: IconName; iconColor: string; defaultTitle: string }
> = {
  info: {
    classes: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: 'info-circle' as IconName,
    iconColor: 'text-blue-600',
    defaultTitle: 'Info',
  },
  success: {
    classes: 'bg-green-50 text-green-800 border-green-200',
    icon: 'check-circle' as IconName,
    iconColor: 'text-green-600',
    defaultTitle: 'Success',
  },
  warning: {
    classes: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    icon: 'exclamation-triangle' as IconName,
    iconColor: 'text-yellow-600',
    defaultTitle: 'Warning',
  },
  error: {
    classes: 'bg-red-50 text-red-800 border-red-200',
    icon: 'alert-circle' as IconName,
    iconColor: 'text-red-600',
    defaultTitle: 'Error',
  },
};

const config = $derived(typeConfig[type]);
const toastTitle = $derived(title || config.defaultTitle);

function dismiss() {
  visible = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  // Wait for exit animation to complete before calling onDismiss
  setTimeout(() => {
    onDismiss?.(id);
  }, 300);
}

onMount(() => {
  if (duration > 0) {
    timeoutId = setTimeout(() => {
      dismiss();
    }, duration);
  }

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
});
</script>

{#if visible}
  <div
    class="flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full {config.classes}"
    transition:fly="{{ y: -20, duration: 300 }}"
    role="alert"
  >
    <Icon name={config.icon} size="sm" class={config.iconColor} />
    
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-medium">{toastTitle}</h4>
      <p class="text-sm mt-1">{message}</p>
    </div>

    {#if dismissible}
      <button
        onclick={dismiss}
        class="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <Icon name="close" size="sm" class="text-gray-400 hover:text-gray-600" />
      </button>
    {/if}
  </div>
{/if}

<style>
/* Ensure proper stacking */
:global(.toast-container) {
  z-index: 9999;
}
</style>