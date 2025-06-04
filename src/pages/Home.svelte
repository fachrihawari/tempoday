<script lang="ts">
  import DatePicker from '../components/DatePicker.svelte';
  import TodoSection from '../components/TodoSection.svelte';
  import NoteSection from '../components/NoteSection.svelte';
  import FinanceSection from '../components/FinanceSection.svelte';
</script>

<div class="max-w-md mx-auto bg-white min-h-screen">
  <!-- DatePicker Component (Header + Date Picker) -->
  <DatePicker />

  <!-- Day Content Sections -->
  <div class="flex-1 overflow-y-auto">
    <!-- To-Do Section -->
    <div class="p-4 border-b border-gray-200">
      <TodoSection />
    </div>

    <!-- Note Section -->
    <div class="p-4 border-b border-gray-200">
      <NoteSection />
    </div>

    <!-- Finance Section -->
    <div class="p-4">
      <FinanceSection />
    </div>
  </div>
</div>
