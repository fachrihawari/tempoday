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
  title = 'Error',
  description,
  type,
  class: className = '',
  dismissible = false,
  onDismiss,
}: Props = $props();

let show = $state(true);

const typeConfig: Record<
  Props['type'],
  { classes: string; icon: IconName; iconColor: string }
> = {
  info: {
    classes: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: 'info-circle' as IconName,
    iconColor: 'text-blue-600',
  },
  success: {
    classes: 'bg-green-50 text-green-800 border-green-200',
    icon: 'check-circle' as IconName,
    iconColor: 'text-green-600',
  },
  warning: {
    classes: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    icon: 'exclamation-triangle' as IconName,
    iconColor: 'text-yellow-600',
  },
  error: {
    classes: 'bg-red-50 text-red-800 border-red-200',
    icon: 'alert-circle' as IconName,
    iconColor: 'text-red-600',
  },
};

const config = $derived(typeConfig[type]);
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
      <h3 class="text-lg font-medium">{title}</h3>
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
