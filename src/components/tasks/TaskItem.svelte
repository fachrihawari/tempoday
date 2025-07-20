<script lang="ts">
import type { Task } from '../../dexie/models';
import {
  type TaskPriority,
  getPriorityConfig,
  selectPriorityConfig,
} from '../../lib/priority';
import { reactiveTasks } from '../../stores/tasks.svelte';
import { toastStore } from '../../stores/toast.svelte';
import Button from '../ui/Button.svelte';
import Icon from '../ui/Icon.svelte';
import Select from '../ui/Select.svelte';

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
  if (task.completed) {
    toastStore.success('Task completed!');
  }
}

async function handlePriorityChange(priority: string) {
  await reactiveTasks.updateTaskPriority(task.id, priority as TaskPriority);
  toastStore.success(
    `Priority updated to ${getPriorityConfig(priority as TaskPriority).label}`,
  );
}

async function handleDelete() {
  await reactiveTasks.deleteTask(task.id);
  toastStore.success('Task deleted successfully');
}
</script>

<div class="flex items-start gap-3 {compact ? 'p-2' : 'p-3'} bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
  <!-- Checkbox -->
  <button
    onclick={toggleTask}
    disabled={reactiveTasks.isToggling[task.id]}
    class="flex items-center justify-center {compact ? 'w-4 h-4' : 'w-5 h-5'} rounded border-2 transition-colors cursor-pointer mt-0.5
      {task.completed
        ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
      {reactiveTasks.isToggling[task.id]
        ? 'opacity-50 cursor-not-allowed bg-white dark:bg-gray-800 border-white dark:border-gray-600 hover:border-white dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800'
        : ''}"
    aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
  >
    {#if reactiveTasks.isToggling[task.id]}
      <Icon name="loader" size="sm" class="{compact ? 'w-3 h-3' : 'w-3 h-3'} animate-spin" />
    {:else if task.completed}
      <Icon name="check" size="sm" class="text-white {compact ? 'w-3 h-3' : 'w-3 h-3'}" />
    {/if}
  </button>

  <!-- Task Content -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <p class="{compact ? 'text-sm' : 'text-sm'} text-gray-900 dark:text-gray-100 
        {task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}">
        {task.description}
      </p>
      
      {#if showDate && task.date}
        <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {new Date(task.date).toLocaleDateString()}
        </span>
      {/if}
    </div>

    <!-- Time and completion info (only in full mode) -->
    {#if !compact}
      <div class="flex items-center gap-2 mt-1">
        {#if task.startedAt}
          <div class="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
            <Icon name="clock" size="sm" class="w-3 h-3" />
            <span>
              {new Date(task.startedAt).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
              })}
              {#if task.endedAt}
                - {new Date(task.endedAt).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
                })}
              {/if}
            </span>
          </div>
        {/if}
        
        {#if task.completed && task.completedAt}
          <div class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Icon name="check-circle" size="sm" class="w-3 h-3" />
            <span>
              {new Date(task.completedAt).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
              })}
            </span>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Priority Badge (always show, but different sizes) -->
  {#if compact}
    <span class="text-xs px-1.5 py-0.5 rounded-full border flex items-center gap-1 font-medium shrink-0 mt-0.5
      {task.priority === 'urgent'
        ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
        : task.priority === 'high'
          ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700'
          : task.priority === 'medium'
            ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
            : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}">
      <span>{priorityConfig.icon}</span>
    </span>
  {:else}
    <!-- Priority Selector (for incomplete tasks in full mode) -->
    {#if !task.completed}
      <div class="flex-shrink-0 mt-0.5">
        <Select
          value={task.priority}
          options={selectPriorityConfig}
          compact
          onSelect={handlePriorityChange}
          disabled={reactiveTasks.isUpdatingPriority[task.id]}
        />
      </div>
    {:else}
      <!-- Priority Badge for completed tasks -->
      <span class="text-xs px-2 py-1 rounded-full border flex items-center gap-1 font-medium shrink-0 mt-0.5
        {task.priority === 'urgent'
          ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
          : task.priority === 'high'
            ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700'
            : task.priority === 'medium'
              ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
              : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}">
        <span>{priorityConfig.icon}</span>
        <span>{priorityConfig.label}</span>
      </span>
    {/if}

    <!-- Delete Button (only in full mode) -->
    <Button
      variant="ghost"
      size="sm"
      onclick={handleDelete}
      disabled={reactiveTasks.isDeleting[task.id]}
      class="!p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-0.5
      {reactiveTasks.isDeleting[task.id] ? 'opacity-100' : ''}"
    >
      {#snippet children()}
        {#if reactiveTasks.isDeleting[task.id]}
          <Icon name="loader" size="sm" class="animate-spin" />
        {:else}
          <Icon name="trash" size="sm" />
        {/if}
      {/snippet}
    </Button>
  {/if}
</div>
