<script lang="ts">
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
  
    <!-- AI Assistant Section - Always show -->
    <AIAssistant />


  </div>
</div>