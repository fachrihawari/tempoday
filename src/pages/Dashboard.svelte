<script lang="ts">
import DashboardSummary from '../components/DashboardSummary.svelte';
import Assistant from '../components/dashboard/Assistant.svelte';
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
    <!-- Today's Summary Section -->
    <DashboardSummary />
  </div>
</div>