<script lang="ts">
import { formatDateKey } from '../lib/date';
import { appState } from '../stores/app.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import TaskItem from './tasks/TaskItem.svelte';
import Card from './ui/Card.svelte';
import EmptyState from './ui/EmptyState.svelte';
import Loading from './ui/Loading.svelte';

// Reactive values from the store
let { tasks, isLoading, urgentCount, highPriorityCount } =
  $derived(reactiveTasks);

// Watch for date changes and load tasks
$effect(() => {
  const dateKey = formatDateKey(appState.selectedDate);
  reactiveTasks.loadTasks(dateKey);
});
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
    <div class="space-y-2">
      {#if isLoading}
        <Loading size="xl" message="Loading tasks..." />
      {:else}
        {#each tasks as task (task.id)}
          <TaskItem {task} />
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
