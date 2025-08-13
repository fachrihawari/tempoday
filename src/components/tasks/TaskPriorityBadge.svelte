<script lang="ts">
import type { Snippet } from 'svelte';
import type { Task } from '../../dexie/models';
import { getPriorityConfig } from '../../lib/priority';

interface Props {
  priority: Task['priority'];
  size?: 'compact' | 'normal' | 'large';
  children?: Snippet;
}

let { priority, size = 'normal', children }: Props = $props();

const priorityConfig = $derived(getPriorityConfig(priority));
</script>

<span
  class="{size === 'large' ? 'text-sm' : 'text-xs' } px-2 py-1 rounded-full border flex items-center gap-1 font-medium shrink-0
        {priority === 'urgent'
    ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
    : priority === 'high'
      ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700'
      : priority === 'medium'
        ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}"
>
  {#if children}
    {@render children()}
  {:else}
    <span>{priorityConfig.icon}</span>

    {#if size !== 'compact'}
      <span>{priorityConfig.label}</span>
    {/if}
  {/if}
</span>
