<script lang="ts">
import Assistant from '../components/dashboard/Assistant.svelte';
import Summary from '../components/dashboard/Summary.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="TempoDay"
    icon="home"
  />

  <!-- Dashboard Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Assistant Section -->
    <Assistant />
    
    <!-- Summary Section -->
    <Summary />
  </div>
</div>