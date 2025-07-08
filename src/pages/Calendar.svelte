<script lang="ts">
import DatePicker from '../components/DatePicker.svelte';
    import FinanceSection from '../components/FinanceSection.svelte';
    import NoteSection from '../components/NoteSection.svelte';
import TaskDayGrid from '../components/TaskDayGrid.svelte';
    import TasksSection from '../components/TasksSection.svelte';
import BottomSheet from '../components/ui/BottomSheet.svelte';
import Button from '../components/ui/Button.svelte';
import Fab, { type FabAction } from '../components/ui/Fab.svelte';
import Icon, { type IconName } from '../components/ui/Icon.svelte';
import Input from '../components/ui/Input.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import PrioritySelector from '../components/ui/PrioritySelector.svelte';
import { formatDateKey } from '../lib/date';
import type { TaskPriority } from '../lib/priority';
import { appState } from '../stores/app.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { toastStore } from '../stores/toast.svelte';

// Task form state
let showTaskModal = $state(false);
let selectedHour = $state<number | null>(null);
let newTaskText = $state('');
let newTaskPriority = $state<TaskPriority>('medium');
let newTaskStartTime = $state('');
let newTaskEndTime = $state('');

// Reactive data for task creation
let { isCreating } = $derived(reactiveTasks);

// Task form functions
function openTaskModal(hour: number) {
  selectedHour = hour;
  newTaskStartTime = `${hour.toString().padStart(2, '0')}:00`;
  newTaskEndTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
  showTaskModal = true;
}

async function handleCreateTask() {
  if (!newTaskText.trim()) return;

  try {
    const dateKey = formatDateKey(appState.selectedDate);
    const baseDate = new Date(appState.selectedDate);

    // Parse start and end times
    let startedAt: number | undefined;
    let endedAt: number | undefined;

    if (newTaskStartTime) {
      const [hours, minutes] = newTaskStartTime.split(':').map(Number);
      const startDate = new Date(baseDate);
      startDate.setHours(hours, minutes, 0, 0);
      startedAt = startDate.getTime();
    }

    if (newTaskEndTime) {
      const [hours, minutes] = newTaskEndTime.split(':').map(Number);
      const endDate = new Date(baseDate);
      endDate.setHours(hours, minutes, 0, 0);
      endedAt = endDate.getTime();
    }

    await reactiveTasks.createTask({
      description: newTaskText,
      date: dateKey,
      createdAt: Date.now(),
      priority: newTaskPriority,
      startedAt,
      endedAt,
    });

    // Reset form
    newTaskText = '';
    newTaskPriority = 'medium';
    newTaskStartTime = '';
    newTaskEndTime = '';
    showTaskModal = false;

    toastStore.success('Task created successfully');
  } catch (error) {
    toastStore.error('Failed to create task');
  }
}

// FAB actions
const fabActions: FabAction[] = [
  {
    icon: 'plus' as IconName,
    label: 'Add Task',
    color: 'task',
    onClick: () => {
      const currentHour = new Date().getHours();
      openTaskModal(currentHour);
    },
  },
  {
    icon: 'edit' as IconName,
    label: 'Add Note',
    color: 'note',
    onClick: () => {
      // TODO: Implement note modal
      toastStore.info('Note creation coming soon!');
    },
  },
  {
    icon: 'dollar' as IconName,
    label: 'Add Transaction',
    color: 'transaction',
    onClick: () => {
      // TODO: Implement transaction modal
      toastStore.info('Transaction creation coming soon!');
    },
  },
];
</script>

<!-- Header Component -->
<PageHeader 
  title="Day View" 
  subtitle="Hourly breakdown of your tasks, notes, and finances"
  icon="calendar"
/>

<!-- DatePicker Component -->
<DatePicker />

<!-- Day Content Timeline -->
<div class="flex-1 overflow-y-auto pb-20">
  <div class="relative">
    <!-- Task Day Grid Component -->
    <TaskDayGrid 
      selectedDate={appState.selectedDate}
      onHourClick={openTaskModal}
      onTaskClick={(task) => {
        // TODO: Handle task click (edit task)
        console.log('Task clicked:', task);
      }}
      onTaskComplete={(task) => reactiveTasks.completeTask(task.id)}
    />
  </div>
</div>

<!-- Floating Action Button -->
{#if fabActions.length > 0}
<Fab actions={fabActions} />
{/if}

<!-- Task Creation Modal -->
<BottomSheet bind:open={showTaskModal} title="Add Task" onClose={() => showTaskModal = false}>
  <div class="space-y-4">
    <Input
      bind:value={newTaskText}
      placeholder="Enter task description..."
      label="Task Description"
    />
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="start-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
        <input
          id="start-time"
          type="time"
          bind:value={newTaskStartTime}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div>
        <label for="end-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
        <input
          id="end-time"
          type="time"
          bind:value={newTaskEndTime}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
    
    <PrioritySelector 
      value={newTaskPriority} 
      onSelect={(priority) => newTaskPriority = priority} 
    />
    
    <div class="flex gap-3">
      <Button variant="outline" onclick={() => showTaskModal = false} class="flex-1">
        Cancel
      </Button>
      <Button onclick={handleCreateTask} class="flex-1" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Add Task'}
      </Button>
    </div>
  </div>
</BottomSheet>