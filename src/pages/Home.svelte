<script lang="ts">
  import DatePicker from "../components/DatePicker.svelte";
  import TodoSection from "../components/TodoSection.svelte";
  import NoteSection from "../components/NoteSection.svelte";
  import FinanceSection from "../components/FinanceSection.svelte";
  import Header from "../components/ui/Header.svelte";
</script>

<!-- Header Component -->
<Header />

<!-- DatePicker Component (Header + Date Picker) -->
<DatePicker />

<!-- Day Content Sections -->
<div class="flex-1 overflow-y-auto">
  <!-- To-Do Section -->
  <TodoSection />

  <!-- Note Section -->
  <NoteSection />

  <!-- Finance Section -->
  <FinanceSection />
</div>
