<script lang="ts">
  import DatePicker from '../components/DatePicker.svelte';
  import TodoSection from '../components/TodoSection.svelte';
  import NoteSection from '../components/NoteSection.svelte';
  import FinanceSection from '../components/FinanceSection.svelte';
</script>

<div class="w-full max-w-md mx-auto bg-white min-h-screen">
  <!-- DatePicker Component (Header + Date Picker) -->
  <DatePicker />

  <!-- Day Content Sections -->
  <div class="flex-1 overflow-y-auto space-y-4 p-4">
    <!-- To-Do Section -->
    <TodoSection />

    <!-- Note Section -->
    <NoteSection />

    <!-- Finance Section -->
    <FinanceSection />
  </div>
</div>
