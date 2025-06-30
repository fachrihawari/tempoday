<script lang="ts">
import { formatDateKey } from '../lib/date';
import { getPriorityConfig, PRIORITY_OPTIONS, type TaskPriority } from '../lib/priority';
import { appState } from '../stores/app.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { toastStore } from '../stores/toast.svelte';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import EmptyState from './ui/EmptyState.svelte';
import Icon from './ui/Icon.svelte';
import Input from './ui/Input.svelte';
import Loading from './ui/Loading.svelte';
import PrioritySelector from './ui/PrioritySelector.svelte';

// Reactive values from the store
let { 
  tasks, 
  isLoading, 
  isCreating, 
  isUpdatingPriority,
  error, 
  completedCount, 
  totalCount, 
  pendingCount,
  urgentCount,
  highPriorityCount
} = $derived(reactiveTasks);

let showAddForm = $state(false);
let newTaskText = $state('');
let newTaskPriority = $state<TaskPriority>('medium');

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

async function handleAddTask(event?: Event) {
  if (event) event.preventDefault();

  const text = newTaskText.trim();
  const dateKey = formatDateKey(appState.selectedDate);
  await reactiveTasks.createTask({ 
    description: text, 
    date: dateKey,
    priority: newTaskPriority 
  });
  toastStore.success('Task added successfully');
  resetForm();
}

function resetForm() {
  newTaskText = '';
  newTaskPriority = 'medium';
  showAddForm = false;
}

function handlePriorityChange(taskId: string, priority: TaskPriority) {
  reactiveTasks.updateTaskPriority(taskId, priority);
  toastStore.success(`Priority updated to ${getPriorityConfig(priority).label}`);
}
</script>

<Card title="Tasks" icon="clipboard" iconColor="text-blue-500">
  {#snippet headerAction()}
    {#if totalCount > 0}
      <span class="text-sm text-gray-500">
        {completedCount}/{totalCount}
      </span>
    {/if}
  {/snippet}

  {#snippet children()}
    <!-- Priority Summary (if there are urgent/high priority tasks) -->
    {#if (urgentCount > 0 || highPriorityCount > 0) && !isLoading}
      <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 mb-4 border border-red-200">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">⚠️</span>
          <h3 class="font-medium text-gray-900">Priority Alert</h3>
        </div>
        <div class="flex flex-wrap gap-2 text-sm">
          {#if urgentCount > 0}
            <span class="bg-red-100 text-red-700 px-2 py-1 rounded-full">
              🔥 {urgentCount} urgent
            </span>
          {/if}
          {#if highPriorityCount > 0}
            <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
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
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group border border-gray-100"
          >
            <!-- Completion Checkbox -->
            <button
              onclick={() => reactiveTasks.toggleTask(task.id)}
              disabled={reactiveTasks.isToggling[task.id]}
              class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              {task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'}
              {reactiveTasks.isToggling[task.id]
                ? 'opacity-50 cursor-not-allowed bg-white border-white hover:border-white hover:bg-white'
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
              <span
                class="text-sm {task.completed
                  ? 'line-through text-gray-500'
                  : 'text-gray-900'}"
              >
                {task.description}
              </span>
            </div>

            <!-- Priority Selector (for incomplete tasks) -->
            {#if !task.completed}
              <div class="flex-shrink-0">
                <PrioritySelector
                  value={task.priority}
                  onSelect={(priority) => handlePriorityChange(task.id, priority)}
                  disabled={isUpdatingPriority[task.id]}
                  size="sm"
                />
              </div>
            {/if}

            <!-- Delete Button -->
            <Button
              variant="ghost"
              size="sm"
              onclick={() => reactiveTasks.deleteTask(task.id)}
              disabled={reactiveTasks.isDeleting[task.id]}
              class="!p-1 text-red-500 hover:bg-red-50
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
            subtitle="Tap to add your first task"
            onclick={() => (showAddForm = true)}
          />
        {/each}
      {/if}
    </div>

    <!-- Add Task Form -->
    <BottomSheet bind:open={showAddForm} title="Add New Task">
      {#snippet children()}
        <form onsubmit={handleAddTask} class="space-y-6">
          <Input
            bind:value={newTaskText}
            placeholder="What needs to be done?"
            label="Task Description"
            theme="tasks"
          />
          
          <!-- Priority Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Priority Level
            </label>
            <PrioritySelector
              value={newTaskPriority}
              onSelect={(priority) => newTaskPriority = priority}
              size="md"
              class="w-full"
            />
          </div>
          
          <div class="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onclick={resetForm}
              class="flex-none w-1/4"
            >
              {#snippet children()}
                Cancel
              {/snippet}
            </Button>
            <Button
              type="submit"
              variant="tasks"
              class="flex-1"
              disabled={!newTaskText.trim() || isCreating}
            >
              {#snippet children()}
                {#if isCreating}
                  <Icon name="loader" size="sm" class="mr-2 animate-spin" />
                  Adding...
                {:else}
                  <Icon name="plus" size="sm" class="mr-2" />
                  Add Task
                {/if}
              {/snippet}
            </Button>
          </div>
        </form>
      {/snippet}
    </BottomSheet>

    {#if !showAddForm && tasks.length > 0}
      <Button
        variant="tasks"
        dashed={true}
        onclick={() => (showAddForm = true)}
        class="w-full"
      >
        {#snippet children()}
          <Icon name="plus" size="sm" class="mr-2" />
          Add Task
        {/snippet}
      </Button>
    {/if}
  {/snippet}
</Card>