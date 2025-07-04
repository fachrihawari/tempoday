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
let progressWidth = $state(100);

const typeConfig: Record<
  Props['type'],
  {
    classes: string;
    icon: IconName;
    iconColor: string;
    defaultTitle: string;
    bgColor: string;
  }
> = {
  info: {
    classes:
      'bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/20',
    icon: 'info-circle' as IconName,
    iconColor: 'text-blue-600 dark:text-blue-400',
    defaultTitle: 'Info',
    bgColor: 'bg-blue-500 dark:bg-blue-600',
  },
  success: {
    classes:
      'bg-white dark:bg-gray-800 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20',
    icon: 'check-circle' as IconName,
    iconColor: 'text-green-600 dark:text-green-400',
    defaultTitle: 'Success',
    bgColor: 'bg-green-500 dark:bg-green-600',
  },
  warning: {
    classes:
      'bg-white dark:bg-gray-800 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700 shadow-yellow-100 dark:shadow-yellow-900/20',
    icon: 'exclamation-triangle' as IconName,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    defaultTitle: 'Warning',
    bgColor: 'bg-yellow-500 dark:bg-yellow-600',
  },
  error: {
    classes:
      'bg-white dark:bg-gray-800 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700 shadow-red-100 dark:shadow-red-900/20',
    icon: 'alert-circle' as IconName,
    iconColor: 'text-red-600 dark:text-red-400',
    defaultTitle: 'Error',
    bgColor: 'bg-red-500 dark:bg-red-600',
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
    // Start progress bar animation
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      progressWidth = (remaining / duration) * 100;

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    // Set timeout for auto-dismiss
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
    class="relative flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full backdrop-blur-sm {config.classes}"
    transition:fly="{{ y: 50, duration: 400, opacity: 0 }}"
    role="alert"
    style="box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);"
  >
    <!-- Progress bar -->
    {#if duration > 0}
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-xl overflow-hidden">
        <div 
          class="h-full transition-all duration-100 ease-linear {config.bgColor}"
          style="width: {progressWidth}%"
        ></div>
      </div>
    {/if}
    
    <!-- Icon with subtle animation -->
    <div class="flex-shrink-0 mt-0.5">
      <div class="w-6 h-6 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
        <Icon name={config.icon} size="sm" class={config.iconColor} />
      </div>
    </div>
    
    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold leading-tight">{toastTitle}</h4>
      <p class="text-sm mt-1 leading-relaxed opacity-90 text-gray-700 dark:text-gray-300">{message}</p>
    </div>

    <!-- Dismiss button with hover animation -->
    {#if dismissible}
      <button
        onclick={dismiss}
        class="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
        aria-label="Dismiss notification"
      >
        <Icon name="close" size="sm" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
      </button>
    {/if}
  </div>
{/if}