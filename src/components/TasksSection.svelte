<script lang="ts">
  import { onMount } from "svelte";
  import { reactiveTasks } from "../db/reactive/tasks.svelte";
  import { selectedDate, formatDateKey } from "../lib/stores";
  import BottomSheet from "./ui/BottomSheet.svelte";
  import Button from "./ui/Button.svelte";
  import Card from "./ui/Card.svelte";
  import EmptyState from "./ui/EmptyState.svelte";
  import Icon from "./ui/Icon.svelte";
  import Input from "./ui/Input.svelte";
  import Loading from "./ui/Loading.svelte";
  import Alert from "./ui/Alert.svelte";

  // Reactive values from the repository
  let { tasks, isLoading, isCreating, error, completedCount, totalCount } =
    $derived(reactiveTasks);

  let showAddForm = $state(false);
  let newTaskText = $state("");

  // Watch for date changes and load tasks
  onMount(() => {
    const dateKey = formatDateKey($selectedDate);
    console.log(`Loading tasks for date: ${dateKey}`);

    reactiveTasks.loadTasks(dateKey);
  });

  async function handleAddTask(event?: Event) {
    if (event) event.preventDefault();

    const text = newTaskText.trim();
    const dateKey = formatDateKey($selectedDate);
    await reactiveTasks.createTask(text, dateKey);
    resetForm();
  }

  function resetForm() {
    newTaskText = "";
    showAddForm = false;
    // Clear any error when closing form
    if (error) {
      reactiveTasks.clearError();
    }
  }
</script>

<Card title="Tasks" icon="clipboard" iconColor="text-blue-500">
  {#snippet headerAction()}
    {#if isLoading}
      <Icon name="loader" size="sm" class="animate-spin" />
    {:else if totalCount > 0}
      <span class="text-sm text-gray-500">
        {completedCount}/{totalCount}
      </span>
    {/if}
  {/snippet}

  {#snippet children()}
    {#if error}
      <Alert
        type="error"
        description={error}
        onDismiss={() => reactiveTasks.clearError()}
        class="mb-4"
      />
    {/if}

    <!-- Task List -->
    <div class="space-y-2 {tasks.length > 0 ? 'mb-4' : ''}">
      {#each tasks as task (task.id)}
        <div
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
        >
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

          <span
            class="flex-1 text-sm {task.completed
              ? 'line-through text-gray-500'
              : 'text-gray-900'}"
          >
            {task.title}
          </span>

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
      {/each}

      {#if tasks.length === 0 && !isLoading}
        <EmptyState
          icon="clipboard"
          title="No tasks for this day"
          subtitle="Tap to add your first task"
          onclick={() => (showAddForm = true)}
        />
      {:else if isLoading}
        <Loading size="xl" message="Loading tasks..." />
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
