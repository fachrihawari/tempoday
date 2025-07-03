<script lang="ts">
import { type TaskPriority, getPriorityConfig } from '../../lib/priority';

interface Props {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  class?: string;
}

let {
  priority,
  size = 'md',
  showIcon = true,
  showLabel = true,
  class: className = '',
}: Props = $props();

const config = $derived(getPriorityConfig(priority));

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const iconSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};
</script>

<span
  class="inline-flex items-center gap-1 rounded-full font-medium border {config.bgColor} {config.color} {config.borderColor} {sizeClasses[size]} {className}"
>
  {#if showIcon}
    <span class={iconSizes[size]}>{config.icon}</span>
  {/if}
  {#if showLabel}
    <span>{config.label}</span>
  {/if}
</span>