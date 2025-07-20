<script lang="ts">
import type { Task } from '../../dexie/models';
import { getPriorityConfig } from '../../lib/priority';
import { reactiveTasks } from '../../stores/tasks.svelte';
import { toastStore } from '../../stores/toast.svelte';
import Icon from '../ui/Icon.svelte';

interface Props {
  task: Task;
  compact?: boolean;
  showDate?: boolean;
}

let { task, compact = false, showDate = false }: Props = $props();
const { error } = $derived(reactiveTasks);

const priorityConfig = $derived(getPriorityConfig(task.priority));

// Watch for errors and show toast
$effect(() => {
  if (error) {
    toastStore.error(error);
    reactiveTasks.clearError();
  }
});

async function toggleTask() {
  await reactiveTasks.toggleTask(task.id);

  if (!task.completed) {
    toastStore.success('Task completed!');
  }
}
</script>

<div class="flex items-center gap-3 {compact ? 'p-2' : 'p-3'} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
  <!-- Checkbox -->
  <button
    onclick={toggleTask}
    class="flex items-center justify-center {compact ? 'w-4 h-4' : 'w-5 h-5'} rounded border-2 transition-colors cursor-pointer
      {task.completed
        ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}"
    aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
  >
    {#if task.completed}
      <Icon name="check" size="sm" class="text-white" />
    {/if}
  </button>

  <!-- Task Content -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <p class="{compact ? 'text-sm' : 'text-base'} text-gray-900 dark:text-gray-100 
        {task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}">
        {task.description}
      </p>
      
      {#if showDate && task.date}
        <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {new Date(task.date).toLocaleDateString()}
        </span>
      {/if}
    </div>
  </div>

  <!-- Priority Badge -->
  <span class="{compact ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'} rounded-full border flex items-center gap-1 font-medium shrink-0
    {task.priority === 'urgent'
      ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
      : task.priority === 'high'
        ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700'
        : task.priority === 'medium'
          ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
          : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}">
    <span>{priorityConfig.icon}</span>
    {#if !compact}
      <span>{priorityConfig.label}</span>
    {/if}
  </span>
</div>
