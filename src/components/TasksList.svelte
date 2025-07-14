<script lang="ts">
import { formatDateKey } from '../lib/date';
import { type TaskPriority, getPriorityConfig } from '../lib/priority';
import { appState } from '../stores/app.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { toastStore } from '../stores/toast.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import EmptyState from './ui/EmptyState.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';
import PrioritySelector from './ui/PrioritySelector.svelte';

// Reactive values from the store
let {
  tasks,
  isLoading,
  isUpdatingPriority,
  error,
  urgentCount,
  highPriorityCount,
} = $derived(reactiveTasks);

// Watch for date changes and load tasks
$effect(() => {
  const dateKey = formatDateKey(appState.selectedDate);
  reactiveTasks.loadTasks(dateKey);
});

// Watch for errors and show toast
$effect(() => {
  if (error) {
    toastStore.error(error);
    reactiveTasks.clearError();
  }
});

function handlePriorityChange(taskId: string, priority: TaskPriority) {
  reactiveTasks.updateTaskPriority(taskId, priority);
  toastStore.success(
    `Priority updated to ${getPriorityConfig(priority).label}`,
  );
}
</script>

<Card iconColor="text-blue-500">
  {#snippet children()}
    <!-- Priority Summary (if there are urgent/high priority tasks) -->
    {#if (urgentCount > 0 || highPriorityCount > 0) && !isLoading}
      <div
        class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-3 mb-4 border border-red-200 dark:border-red-800"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">⚠️</span>
          <h3 class="font-medium text-gray-900 dark:text-gray-100">
            Priority Alert
          </h3>
        </div>
        <div class="flex flex-wrap gap-2 text-sm">
          {#if urgentCount > 0}
            <span
              class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-full"
            >
              🔥 {urgentCount} urgent
            </span>
          {/if}
          {#if highPriorityCount > 0}
            <span
              class="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full"
            >
              ⚡ {highPriorityCount} high priority
            </span>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Task List -->
    <div class="space-y-2" class:mb-4={tasks.length > 0}>
      {#if isLoading}
        <Loading size="xl" message="Loading tasks..." />
      {:else}
        {#each tasks as task (task.id)}
          <div
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group border border-gray-100 dark:border-gray-700"
          >
            <!-- Completion Checkbox -->
            <button
              onclick={() => reactiveTasks.toggleTask(task.id)}
              disabled={reactiveTasks.isToggling[task.id]}
              class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5
              {task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'}
              {reactiveTasks.isToggling[task.id]
                ? 'opacity-50 cursor-not-allowed bg-white dark:bg-gray-800 border-white dark:border-gray-600 hover:border-white dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800'
                : ''}"
            >
              {#if reactiveTasks.isToggling[task.id]}
                <Icon name="loader" size="sm" class="w-3 h-3 animate-spin" />
              {:else if task.completed}
                <Icon name="check" size="sm" class="w-3 h-3" />
              {/if}
            </button>

            <!-- Task Content -->
            <div class="flex-1 min-w-0">
              <div>
                <span
                  class="text-sm {task.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-gray-100'}"
                >
                  {task.description}
                </span>
              </div>
              
              <!-- Time and completion info -->
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
            </div>

            <!-- Priority Selector (for incomplete tasks) -->
            {#if !task.completed}
              <div class="flex-shrink-0 mt-0.5">
                <PrioritySelector
                  value={task.priority}
                  onSelect={(priority: TaskPriority) =>
                    handlePriorityChange(task.id, priority)}
                  disabled={isUpdatingPriority[task.id]}
                  size="sm"
                  dropdownWidth="auto"
                />
              </div>
            {/if}

            <!-- Delete Button -->
            <Button
              variant="ghost"
              size="sm"
              onclick={() => reactiveTasks.deleteTask(task.id)}
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
          </div>
        {:else}
          <EmptyState
            icon="clipboard"
            title="No tasks for this day"
            subtitle="Write your first task to get started!"
          />
        {/each}
      {/if}
    </div>
  {/snippet}
</Card>
