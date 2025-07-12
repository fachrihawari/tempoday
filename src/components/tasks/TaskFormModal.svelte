<script lang="ts">
  import { formatDateKey } from "../../lib/date";
  import type { TaskPriority } from "../../lib/priority";
  import { appState } from "../../stores/app.svelte";
  import { reactiveTasks } from "../../stores/tasks.svelte";
  import { toastStore } from "../../stores/toast.svelte";
  import BottomSheet from "../ui/BottomSheet.svelte";
  import Button from "../ui/Button.svelte";
  import Input from "../ui/Input.svelte";
  import PrioritySelector from "../ui/PrioritySelector.svelte";

  type Props = {
    open: boolean;
  };
  let { open = $bindable() }: Props = $props();

  $inspect({open})

  const tasksStore = $derived(reactiveTasks);

  let description = $state("");
  let priority = $state<TaskPriority>("medium");
  let startTime = $state("");
  let endTime = $state("");

  async function handleCreateTask() {
    if (!description.trim()) return;

    try {
      const dateKey = formatDateKey(appState.selectedDate);
      const baseDate = new Date(appState.selectedDate);

      // Parse start and end times
      let startedAt: number | undefined;
      let endedAt: number | undefined;

      if (startTime) {
        const [hours, minutes] = startTime.split(":").map(Number);
        const startDate = new Date(baseDate);
        startDate.setHours(hours, minutes, 0, 0);
        startedAt = startDate.getTime();
      }

      if (endTime) {
        const [hours, minutes] = endTime.split(":").map(Number);
        const endDate = new Date(baseDate);
        endDate.setHours(hours, minutes, 0, 0);
        endedAt = endDate.getTime();
      }

      await reactiveTasks.createTask({
        description,
        date: dateKey,
        createdAt: Date.now(),
        priority,
        startedAt,
        endedAt,
      });

      // Reset form
      description = "";
      priority = "medium";
      startTime = "";
      endTime = "";
      open = false;

      toastStore.success("Task created successfully");
    } catch (error) {
      toastStore.error("Failed to create task");
    }
  }
</script>

<!-- Task Creation Modal -->
<BottomSheet bind:open title="Add Task" onClose={() => (open = false)}>
  <div class="space-y-4">
    <Input
      bind:value={description}
      placeholder="Enter task description..."
      label="Task Description"
    />

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="start-time"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >Start Time</label
        >
        <input
          id="start-time"
          type="time"
          bind:value={startTime}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          for="end-time"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >End Time</label
        >
        <input
          id="end-time"
          type="time"
          bind:value={endTime}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>

    <PrioritySelector
      value={priority}
      onSelect={(priority) => (priority = priority)}
      label="Task Priority"
    />

    <div class="flex gap-3">
      <Button variant="outline" onclick={() => (open = false)} class="flex-1">
        Cancel
      </Button>
      <Button
        onclick={handleCreateTask}
        class="flex-1"
        disabled={tasksStore.isCreating}
      >
        {tasksStore.isCreating ? "Creating..." : "Add Task"}
      </Button>
    </div>
  </div>
</BottomSheet>
