<script lang="ts">
import Button from './Button.svelte';
import Icon, { type IconName } from './Icon.svelte';

interface Props {
  title?: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  class?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

let {
  title,
  description,
  type,
  class: className = '',
  dismissible = false,
  onDismiss,
}: Props = $props();

let show = $state(true);

const typeConfig: Record<
  Props['type'],
  { classes: string; icon: IconName; iconColor: string; defaultTitle: string }
> = {
  info: {
    classes:
      'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: 'info-circle' as IconName,
    iconColor: 'text-blue-600 dark:text-blue-400',
    defaultTitle: 'Info',
  },
  success: {
    classes:
      'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    icon: 'check-circle' as IconName,
    iconColor: 'text-green-600 dark:text-green-400',
    defaultTitle: 'Success',
  },
  warning: {
    classes:
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    icon: 'exclamation-triangle' as IconName,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    defaultTitle: 'Warning',
  },
  error: {
    classes:
      'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    icon: 'alert-circle' as IconName,
    iconColor: 'text-red-600 dark:text-red-400',
    defaultTitle: 'Error',
  },
};

const config = $derived(typeConfig[type]);
const alertTitle = $derived(title || config.defaultTitle);
const alertClasses = $derived(
  `p-4 border-l-4 rounded-md flex flex-col items-center ${config.classes} ${className}`,
);

function handleDismiss() {
  show = false;
  onDismiss?.();
}
</script>

{#if show}
  <div class={alertClasses} role="alert">
    <Icon name={config.icon} size="3xl" class={config.iconColor} />
    <div class="mt-4 text-center">
      <h3 class="text-lg font-medium">{alertTitle}</h3>
      <p class="mt-2 text-sm font-medium">{description}</p>
    </div>

    {#if dismissible}
      <Button
        variant="danger"
        size="sm"
        fullWidth
        onclick={handleDismiss}
        class="mt-4"
      >
        Dismiss
      </Button>
    {/if}
  </div>
{/if}