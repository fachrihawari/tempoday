<script lang="ts">
import DatePicker from '../components/DatePicker.svelte';
import FinanceSection from '../components/FinanceSection.svelte';
import NoteSection from '../components/NoteSection.svelte';
import TasksSection from '../components/TasksSection.svelte';
import Header from '../components/ui/Header.svelte';
</script>

<!-- Header Component -->
<Header />

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
