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
import PriorityBadge from './ui/PriorityBadge.svelte';
import PrioritySelector from './ui/PrioritySelector.svelte';

// Reactive values from the store
let { 
  filteredTasks: tasks, 
  isLoading, 
  isCreating, 
  isUpdatingPriority,
  error, 
  completedCount, 
  totalCount, 
  pendingCount,
  urgentCount,
  highPriorityCount,
  priorityFilter 
} = $derived(reactiveTasks);

let showAddForm = $state(false);
let showPriorityFilter = $state(false);
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

function togglePriorityFilter(priority: TaskPriority) {
  const currentFilter = [...priorityFilter];
  const index = currentFilter.indexOf(priority);
  
  if (index > -1) {
    currentFilter.splice(index, 1);
  } else {
    currentFilter.push(priority);
  }
  
  reactiveTasks.setPriorityFilter(currentFilter);
}

function clearPriorityFilter() {
  reactiveTasks.clearPriorityFilter();
  showPriorityFilter = false;
}

// Get priority stats for current tasks
const priorityStats = $derived(() => {
  const stats = {
    urgent: { total: 0, pending: 0 },
    high: { total: 0, pending: 0 },
    medium: { total: 0, pending: 0 },
    low: { total: 0, pending: 0 },
  };

  reactiveTasks.tasks.forEach(task => {
    stats[task.priority].total++;
    if (!task.completed) {
      stats[task.priority].pending++;
    }
  });

  return stats;
});
</script>

<Card title="Tasks" icon="clipboard" iconColor="text-blue-500">
  {#snippet headerAction()}
    <div class="flex items-center gap-2">
      <!-- Priority Filter Button -->
      {#if totalCount > 0}
        <Button
          variant="ghost"
          size="sm"
          onclick={() => showPriorityFilter = true}
          class="text-blue-600 hover:text-blue-700 relative"
        >
          {#snippet children()}
            <Icon name="settings" size="sm" class="mr-1" />
            Filter
            {#if priorityFilter.length > 0}
              <span class="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            {/if}
          {/snippet}
        </Button>
      {/if}
      
      <!-- Task Count -->
      {#if totalCount > 0}
        <span class="text-sm text-gray-500">
          {completedCount}/{totalCount}
        </span>
      {/if}
    </div>
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

    <!-- Active Priority Filter Indicator -->
    {#if priorityFilter.length > 0}
      <div class="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="settings" class="text-blue-600" size="sm" />
            <span class="text-sm font-medium text-blue-900">Filtered by priority:</span>
            <div class="flex gap-1">
              {#each priorityFilter as priority}
                <PriorityBadge {priority} size="sm" showLabel={false} />
              {/each}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onclick={clearPriorityFilter}
            class="text-blue-600 hover:text-blue-700"
          >
            {#snippet children()}Clear{/snippet}
          </Button>
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
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="text-sm {task.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'}"
                >
                  {task.description}
                </span>
              </div>
              
              <!-- Priority Badge -->
              <div class="flex items-center gap-2">
                <PriorityBadge priority={task.priority} size="sm" />
                {#if task.completed}
                  <span class="text-xs text-gray-500">Completed</span>
                {/if}
              </div>
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

    <!-- Priority Filter Modal -->
    <BottomSheet bind:open={showPriorityFilter} title="Filter by Priority">
      {#snippet children()}
        <div class="space-y-6">
          <!-- Current Filter Status -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Current Filter</h4>
            {#if priorityFilter.length === 0}
              <p class="text-sm text-gray-600">Showing all tasks</p>
            {:else}
              <div class="flex flex-wrap gap-2">
                {#each priorityFilter as priority}
                  <PriorityBadge {priority} size="sm" />
                {/each}
              </div>
            {/if}
          </div>

          <!-- Priority Options -->
          <div class="space-y-3">
            <h4 class="font-medium text-gray-900">Select Priorities to Show</h4>
            {#each PRIORITY_OPTIONS as priority}
              {@const config = getPriorityConfig(priority)}
              {@const isSelected = priorityFilter.includes(priority)}
              {@const stats = priorityStats[priority]}
              
              <button
                onclick={() => togglePriorityFilter(priority)}
                class="w-full text-left p-3 rounded-lg border transition-colors
                       {isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded border-2 flex items-center justify-center
                                {isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}">
                      {#if isSelected}
                        <Icon name="check" size="sm" class="text-white" />
                      {/if}
                    </div>
                    <PriorityBadge {priority} size="md" />
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">
                      {stats.pending} pending
                    </div>
                    <div class="text-xs text-gray-500">
                      {stats.total} total
                    </div>
                  </div>
                </div>
              </button>
            {/each}
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onclick={clearPriorityFilter}
              class="flex-1"
            >
              {#snippet children()}
                Clear Filter
              {/snippet}
            </Button>
            <Button
              variant="tasks"
              onclick={() => showPriorityFilter = false}
              class="flex-1"
            >
              {#snippet children()}
                Apply Filter
              {/snippet}
            </Button>
          </div>
        </div>
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