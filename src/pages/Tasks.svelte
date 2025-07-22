<script lang="ts">
import DatePicker from '../components/shared/DatePicker.svelte';
import TaskFormModal from '../components/tasks/TaskFormModal.svelte';
import TasksList from '../components/tasks/TasksList.svelte';
import TasksTimeline from '../components/tasks/TasksTimeline.svelte';
import Button from '../components/ui/Button.svelte';
import Fab from '../components/ui/Fab.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { appState } from '../stores/app.svelte';
import { reactiveRouter } from '../stores/router.svelte';

// View mode state
let viewMode = $state<'timeline' | 'sections'>('sections');

// Open task form modal state
let openForm = $state(false);

const router = $derived(reactiveRouter);
</script>

<!-- Header Component -->

<PageHeader title="Tasks" icon="clipboard">
  <div class="flex items-center gap-2">
    <!-- View mode switcher -->
    <Button
      onclick={() =>
        (viewMode = viewMode === "timeline" ? "sections" : "timeline")}
      variant="outline"
      aria-label={`Switch to ${viewMode === "timeline" ? "sections" : "timeline"} view`}
    >
      <Icon
        name={viewMode === "timeline" ? "clipboard" : "clock"}
        class="text-gray-600 dark:text-gray-300"
      />
    </Button>

    <!-- Search button -->
    <Button
      onclick={() => router.navigate("/search")}
      variant="outline"
      aria-label="Go to search page"
    >
      <Icon name="search" class="text-gray-600 dark:text-gray-300" />
    </Button>
  </div>
</PageHeader>

<!-- DatePicker Component -->
<DatePicker />

<!-- Day Content -->
<div class="flex-1">
  {#if viewMode === "timeline"}
    <!-- Timeline View -->
    <div class="relative">
      <!-- Task Day Grid Component -->
      <TasksTimeline
        selectedDate={appState.selectedDate}
        onHourClick={(hour) => {
          console.log('Open task modal at hour:', hour);
          openForm = true;
        }}
        onTaskClick={(task) => {
          // TODO: Handle task click (edit task)
          console.log("Task clicked:", task);
        }}
      />
    </div>
  {:else}
    <TasksList />
    <Fab icon="plus" onclick={() => openForm = true} />
  {/if}

  <TaskFormModal bind:open={openForm} />
</div>
