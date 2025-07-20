<script lang="ts">
import type { Task } from '../../dexie/models';
import { formatDateKey } from '../../lib/date';
import { reactiveTasks } from '../../stores/tasks.svelte';
import Icon from '../ui/Icon.svelte';

interface Props {
  selectedDate: Date;
  onTaskClick?: (task: Task) => void;
  onHourClick?: (hour: number) => void;
}

let { selectedDate, onTaskClick, onHourClick }: Props = $props();

// Generate hours for the day (0-23)
const hours = Array.from({ length: 24 }, (_, i) => i);

// Reactive data
let { tasks, isLoading } = $derived(reactiveTasks);

// Load tasks when date changes
$effect(() => {
  const dateKey = formatDateKey(selectedDate);
  console.log('Loading tasks for date:', dateKey);
  reactiveTasks.loadTasks(dateKey);
});

// Helper functions
function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

function getHourData(hour: number) {
  const dateKey = formatDateKey(selectedDate);

  // Get all tasks for the current date
  const allTasks = tasks;

  // Find tasks that START in this hour
  const tasksStartingInHour = allTasks.filter((task) => {
    if (task.startedAt) {
      const taskDate = new Date(task.startedAt);
      const taskDateStr = taskDate.toISOString().split('T')[0];
      return taskDateStr === dateKey && taskDate.getHours() === hour;
    }

    // Fallback to createdAt
    const taskDate = new Date(task.createdAt);
    const taskDateStr = taskDate.toISOString().split('T')[0];
    return taskDateStr === dateKey && taskDate.getHours() === hour;
  });

  // Check if this hour is occupied by any task (for showing occupied state)
  const isOccupied = allTasks.some((task) => {
    if (task.startedAt && task.endedAt) {
      const hourStart = new Date(
        dateKey + ` ${hour.toString().padStart(2, '0')}:00:00`,
      ).getTime();
      const hourEnd = hourStart + 60 * 60 * 1000;
      return task.startedAt < hourEnd && task.endedAt > hourStart;
    }

    if (task.startedAt) {
      const taskDate = new Date(task.startedAt);
      const taskDateStr = taskDate.toISOString().split('T')[0];
      return taskDateStr === dateKey && taskDate.getHours() === hour;
    }

    const taskDate = new Date(task.createdAt);
    const taskDateStr = taskDate.toISOString().split('T')[0];
    return taskDateStr === dateKey && taskDate.getHours() === hour;
  });

  return {
    tasksStartingHere: tasksStartingInHour,
    isOccupied,
    isEmpty: !isOccupied,
  };
}

function getTaskGridRow(task: Task): { start: number; span: number } {
  let startHour: number;
  if (task.startedAt) {
    const taskDate = new Date(task.startedAt);
    startHour = taskDate.getHours();
  } else {
    const taskDate = new Date(task.createdAt);
    startHour = taskDate.getHours();
  }

  let span = 1;
  if (task.startedAt && task.endedAt) {
    span = Math.max(
      1,
      Math.ceil((task.endedAt - task.startedAt) / (60 * 60 * 1000)),
    );
  }

  return { start: startHour + 1, span }; // +1 because CSS grid is 1-indexed
}

function getTaskPosition(task: Task): { left: string; width: string } {
  // Get all tasks for the current date
  const allTasks = tasks;

  // Find overlapping tasks within the same time period
  const overlappingTasks = allTasks.filter((otherTask) => {
    if (otherTask.id === task.id) return false;

    const taskStart = task.startedAt || task.createdAt;
    const taskEnd = task.endedAt || taskStart + 60 * 60 * 1000; // Default 1 hour
    const otherStart = otherTask.startedAt || otherTask.createdAt;
    const otherEnd = otherTask.endedAt || otherStart + 60 * 60 * 1000;

    // Check if they overlap
    return taskStart < otherEnd && taskEnd > otherStart;
  });

  const totalOverlapping = overlappingTasks.length + 1; // +1 for current task
  const taskIndex = overlappingTasks.filter((t) => t.id < task.id).length; // Position based on ID

  if (totalOverlapping === 1) {
    return { left: '2px', width: 'calc(100% - 4px)' };
  }

  // Calculate position to avoid overlap - use pixel values for better control
  const availableWidth = 100; // percentage
  const widthPercent = Math.max(45, availableWidth / totalOverlapping); // Minimum 45% width
  const leftPercent = taskIndex * (availableWidth / totalOverlapping);

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
  };
}

function handleHourClick(hour: number) {
  onHourClick?.(hour);
}

function handleTaskClick(task: Task, event: Event) {
  event.stopPropagation();
  onTaskClick?.(task);
}

async function handleCompleteTask(task: Task) {
  await reactiveTasks.completeTask(task.id);
}
</script>

<!-- CSS Grid Calendar Layout -->
<div
  class="grid grid-cols-[60px_1fr] grid-rows-[repeat(24,_60px)] gap-0 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
>
  <!-- Hour Labels -->
  {#each hours as hour}
    <div
      class="flex items-start justify-center pt-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
      style="grid-column: 1; grid-row: {hour + 1};"
    >
      <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
        {formatHour(hour)}
      </span>
    </div>
  {/each}

  <!-- Hour Slots (Empty clickable areas) -->
  {#each hours as hour}
    {@const hourData = getHourData(hour)}
    <div
      class="border-b border-r border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer relative group"
      style="grid-column: 2; grid-row: {hour + 1};"
      role="button"
      tabindex="0"
      aria-label="Add task at {formatHour(hour)}"
      onclick={() => handleHourClick(hour)}
      onkeydown={(e) => e.key === "Enter" && handleHourClick(hour)}
    >
      {#if hourData.isEmpty}
        <!-- Empty hour - show add button on hover -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span class="text-xs text-gray-400 dark:text-gray-500"
            >+ Add task</span
          >
        </div>
      {/if}
    </div>
  {/each}

  <!-- Tasks (Overlaying the grid) -->
  {#each tasks as task}
    {@const gridPosition = getTaskGridRow(task)}
    {@const taskPosition = getTaskPosition(task)}
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-gray-800 dark:text-gray-200 border border-blue-200 dark:border-blue-800 rounded-lg p-2 my-0.5 shadow-sm hover:shadow-md hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all cursor-pointer relative"
      style="grid-column: 2; grid-row: {gridPosition.start} / span {gridPosition.span}; margin-left: {taskPosition.left}; width: {taskPosition.width};"
      role="button"
      tabindex="0"
      aria-label="Task: {task.description}"
      onclick={(e) => handleTaskClick(task, e)}
      onkeydown={(e) => e.key === "Enter" && handleTaskClick(task, e)}
    >
      <div class="flex items-start justify-between h-full">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1 mb-1">
            <div
              class="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"
            ></div>
            {#if task.startedAt && task.endedAt}
              <span class="text-xs text-gray-600 dark:text-gray-400">
                {new Date(task.startedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                {#if gridPosition.span > 1}
                  - {new Date(task.endedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                {/if}
              </span>
            {/if}
          </div>

          <p
            class="text-sm font-medium leading-tight {task.completed
              ? 'line-through opacity-70'
              : ''} truncate"
          >
            {task.description}
          </p>

          {#if gridPosition.span > 1}
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {gridPosition.span} hour{gridPosition.span > 1 ? "s" : ""}
            </div>
          {/if}

          {#if task.completed && task.completedAt}
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ✓ {new Date(task.completedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          {/if}
        </div>

        <button
          class="ml-2 p-1.5 bg-white/80 dark:bg-gray-800/80 hover:bg-green-100 dark:hover:bg-green-900/30 border border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-600 rounded-md transition-all shadow-sm hover:shadow-md"
          onclick={() => handleCompleteTask(task)}
          disabled={reactiveTasks.isToggling[task.id]}
        >
          <Icon
            name={task.completed ? "check-circle" : "check"}
            size="sm"
            class="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
          />
        </button>
      </div>

      <!-- Priority indicator -->
      <div
        class="absolute left-0 top-0 bottom-0 w-1 rounded-l-md {task.priority ===
        'urgent'
          ? 'bg-red-500'
          : task.priority === 'high'
            ? 'bg-orange-500'
            : task.priority === 'medium'
              ? 'bg-yellow-500'
              : 'bg-green-500'}"
      ></div>
    </div>
  {/each}
</div>

{#if isLoading}
  <div
    class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50"
  >
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
    ></div>
  </div>
{/if}
