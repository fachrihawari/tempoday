<script lang="ts">
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import Icon, { type IconName } from './Icon.svelte';

interface Props {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  show?: boolean;
}

let {
  type,
  title,
  message,
  duration = 4000,
  dismissible = true,
  onDismiss,
  show = $bindable(true),
}: Props = $props();

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const typeConfig: Record<
  Props['type'],
  { 
    classes: string; 
    icon: IconName; 
    iconBg: string;
  }
> = {
  info: {
    classes: 'bg-white border-blue-200 text-gray-900',
    icon: 'info-circle' as IconName,
    iconBg: 'bg-blue-100 text-blue-600',
  },
  success: {
    classes: 'bg-white border-green-200 text-gray-900',
    icon: 'check-circle' as IconName,
    iconBg: 'bg-green-100 text-green-600',
  },
  warning: {
    classes: 'bg-white border-yellow-200 text-gray-900',
    icon: 'exclamation-triangle' as IconName,
    iconBg: 'bg-yellow-100 text-yellow-600',
  },
  error: {
    classes: 'bg-white border-red-200 text-gray-900',
    icon: 'alert-circle' as IconName,
    iconBg: 'bg-red-100 text-red-600',
  },
};

const config = $derived(typeConfig[type]);

function handleDismiss() {
  show = false;
  onDismiss?.();
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

onMount(() => {
  if (duration > 0) {
    timeoutId = setTimeout(() => {
      handleDismiss();
    }, duration);
  }

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
});
</script>

{#if show}
  <div
    class="fixed top-4 right-4 z-[200] max-w-sm w-full"
    transition:fly={{ y: -50, duration: 300 }}
    role="alert"
    aria-live="polite"
  >
    <div
      class="flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm {config.classes}"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center {config.iconBg}">
        <Icon name={config.icon} size="sm" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        {#if title}
          <h4 class="text-sm font-medium mb-1">{title}</h4>
        {/if}
        <p class="text-sm text-gray-700">{message}</p>
      </div>

      <!-- Dismiss Button -->
      {#if dismissible}
        <button
          onclick={handleDismiss}
          class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <Icon name="close" size="sm" />
        </button>
      {/if}
    </div>
  </div>
{/if}