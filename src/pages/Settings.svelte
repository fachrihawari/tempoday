<script lang="ts">
import AppearanceSettings from '../components/AppearanceSettings.svelte';
import BackupRestore from '../components/BackupRestore.svelte';
import DonationModal from '../components/DonationModal.svelte';
import Settings from '../components/Settings.svelte';
import SupportSettings from '../components/SupportSettings.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { reactiveRouter } from '../stores/router.svelte';

let showDonationModal = $state(false);

function navigateToTerms() {
  reactiveRouter.navigate('/terms');
}
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
    <!-- Appearance Section -->
    <Card 
      title="Appearance" 
      icon="sun" 
      iconColor="text-yellow-500"
      collapsible={true}
      defaultExpanded={true}
    >
      {#snippet children()}
        <AppearanceSettings />
      {/snippet}
    </Card>

    <!-- Support TempoDay Section -->
    <Card 
      title="Support TempoDay" 
      icon="check-circle" 
      iconColor="text-red-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <SupportSettings onDonate={() => showDonationModal = true} />
      {/snippet}
    </Card>

    <!-- Backup & Restore Section -->
    <Card 
      title="Backup & Restore" 
      icon="save" 
      iconColor="text-blue-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <BackupRestore />
      {/snippet}
    </Card>

    <!-- Currency Settings Section -->
    <Card 
      title="Currency Settings" 
      icon="dollar" 
      iconColor="text-green-500"
      collapsible={true}
      defaultExpanded={false}
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

    <!-- App Information Section - Minimalist Design -->
    <Card 
      title="About" 
      icon="info-circle" 
      iconColor="text-gray-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <!-- Clean App Info -->
        <div class="text-center py-6">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <img src='/logo.png' class="w-12 h-12" alt="TempoDay" />
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mb-1">TempoDay</h3>
          <p class="text-sm text-gray-500 mb-6">Version 0.0.1</p>
          
          <!-- Key Features - Complete 2x2 Grid -->
          <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
            <div class="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <Icon name="clipboard" class="text-blue-600 mb-1" size="lg" />
              <span class="text-xs font-medium text-blue-900">Tasks</span>
            </div>
            <div class="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
              <Icon name="edit" class="text-purple-600 mb-1" size="lg" />
              <span class="text-xs font-medium text-purple-900">Notes</span>
            </div>
            <div class="flex flex-col items-center p-3 bg-green-50 rounded-lg">
              <Icon name="dollar" class="text-green-600 mb-1" size="lg" />
              <span class="text-xs font-medium text-green-900">Finance</span>
            </div>
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Icon name="check-circle" class="text-gray-600 mb-1" size="lg" />
              <span class="text-xs font-medium text-gray-900">Private</span>
            </div>
          </div>
          
          <!-- Simple tagline -->
          <p class="text-xs text-gray-400 mb-4">
            Calendar-centric personal management
          </p>
          
          <!-- Terms & Conditions Link -->
          <Button
            variant="outline"
            size="sm"
            onclick={navigateToTerms}
            class="!w-full !justify-center !text-gray-600 hover:!text-gray-900"
          >
            {#snippet children()}
              <Icon name="info-circle" class="text-gray-500" size="sm" />
              <span>Terms & Conditions</span>
            {/snippet}
          </Button>
        </div>
      {/snippet}
    </Card>
  </div>
</div>

<!-- Donation Modal -->
<DonationModal bind:open={showDonationModal} />