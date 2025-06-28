<script lang="ts">
import DatePicker from '../components/DatePicker.svelte';
import FinanceSection from '../components/FinanceSection.svelte';
import NoteSection from '../components/NoteSection.svelte';
import TasksSection from '../components/TasksSection.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
</script>

<!-- Header Component -->
<PageHeader 
  title="Calendar" 
  subtitle="Manage your daily tasks, notes, and finances"
  icon="calendar"
/>

<!-- DatePicker Component (Header + Date Picker) -->
<DatePicker />

<!-- Day Content Sections -->
<div class="flex-1 overflow-y-auto">
  <!-- Tasks Section -->
  <TasksSection />

  <!-- Note Section -->
  <NoteSection />

  <!-- Finance Section -->
  <FinanceSection />
</div>