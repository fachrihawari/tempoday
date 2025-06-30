<script lang="ts">
import AIAssistant from '../components/AIAssistant.svelte';
import DashboardSummary from '../components/DashboardSummary.svelte';
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { formatDate } from '../lib/date';
import { reactiveRouter } from '../stores/router.svelte';

function navigateToSearch() {
  reactiveRouter.navigate('/search');
}
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="TempoDay" 
    subtitle={formatDate(new Date())}
    icon="home"
  >
    {#snippet children()}
      <Button
        variant="ghost"
        size="sm"
        onclick={navigateToSearch}
        class="text-gray-600 hover:text-gray-800"
      >
        {#snippet children()}
          <Icon name="search" size="sm" />
        {/snippet}
      </Button>
    {/snippet}
  </PageHeader>

  <!-- Dashboard Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- AI Assistant Section -->
    <AIAssistant />
    <!-- Today's Summary Section -->
    <DashboardSummary />
  </div>
</div>