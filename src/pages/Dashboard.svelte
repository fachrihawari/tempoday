<script lang="ts">
import AIAssistant from '../components/AIAssistant.svelte';
import DashboardSummary from '../components/DashboardSummary.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { formatDate } from '../lib/date';
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="TempoDay" 
    subtitle={formatDate(new Date())}
    icon="home"
  />

  <!-- Dashboard Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- AI Assistant Section -->
    <AIAssistant />
    <!-- Today's Summary Section -->
    <DashboardSummary />
  </div>
</div>