<script lang="ts">
import Settings from '../components/Settings.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="Settings" 
    subtitle="Customize your TempoDay experience"
    icon="settings"
  />

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Currency Settings Section -->
    <Card 
      title="Currency Settings" 
      icon="dollar" 
      iconColor="text-green-500"
      collapsible={true}
      defaultExpanded={true}
    >
      {#snippet children()}
        <Settings />
      {/snippet}
    </Card>

    <!-- Privacy & Security Section -->
    <Card 
      title="Privacy & Security" 
      icon="check-circle" 
      iconColor="text-blue-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="check-circle" class="text-white" size="sm" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-1">100% Local Storage</h3>
              <p class="text-sm text-gray-700 leading-relaxed">
                All your data is stored locally on your device. We don't collect, store, or transmit any personal information to external servers.
              </p>
            </div>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- App Features Section -->
    <Card 
      title="Key Features" 
      icon="check-circle" 
      iconColor="text-purple-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="space-y-2">
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Icon name="calendar" class="text-blue-600" />
            <span class="text-sm font-medium text-blue-900">Calendar-centric task management</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <Icon name="edit" class="text-purple-600" />
            <span class="text-sm font-medium text-purple-900">Daily notes and journaling</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <Icon name="dollar" class="text-green-600" />
            <span class="text-sm font-medium text-green-900">Personal finance tracking</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Icon name="check-circle" class="text-gray-600" />
            <span class="text-sm font-medium text-gray-900">Offline-first with local storage</span>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- App Information Section -->
    <Card 
      title="About TempoDay" 
      icon="info-circle" 
      iconColor="text-gray-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <img src='/logo.png' class="w-16 h-16" alt="TempoDay Logo" />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 text-lg">TempoDay</h3>
            <p class="text-sm text-gray-600 mb-1">Version 0.0.1</p>
            <p class="text-xs text-gray-500">Calendar-centric personal management</p>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-500 text-center">
            Built with ❤️ for productivity and privacy
          </p>
        </div>
      {/snippet}
    </Card>
  </div>
</div>