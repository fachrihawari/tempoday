<script lang="ts">
import { formatDateKey } from '../../lib/date';
import { appState } from '../../stores/app.svelte';
import { reactiveTasks } from '../../stores/tasks.svelte';
import Card from '../ui/Card.svelte';
import EmptyState from '../ui/EmptyState.svelte';
import Loading from '../ui/Loading.svelte';
import TaskItem from './TaskItem.svelte';
import TaskPriorityBadge from './TaskPriorityBadge.svelte';

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
      <div class="flex mb-4 gap-x-2">
        {#if urgentCount > 0}
          <TaskPriorityBadge size="large" priority="urgent">
            🔥 {urgentCount} urgent
          </TaskPriorityBadge>
        {/if}
        {#if highPriorityCount > 0}
          <TaskPriorityBadge size="large" priority="high">
            ⚡ {highPriorityCount} high priority
          </TaskPriorityBadge>
        {/if}
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
