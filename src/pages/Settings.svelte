<script lang="ts">
import AppearanceSettings from '../components/AppearanceSettings.svelte';
import BackupRestore from '../components/BackupRestore.svelte';
import CurrencySettings from '../components/CurrencySettings.svelte';
import DonationModal from '../components/DonationModal.svelte';
import PrivacySettings from '../components/PrivacySettings.svelte';
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
      iconColor="text-yellow-600 dark:text-yellow-400"
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
      icon="heart" 
      iconColor="text-rose-600 dark:text-rose-400"
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
      iconColor="text-blue-600 dark:text-blue-400"
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
      iconColor="text-emerald-600 dark:text-emerald-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <CurrencySettings />
      {/snippet}
    </Card>

    <!-- Privacy & Security Section -->
    <Card 
      title="Privacy & Security" 
      icon="shield" 
      iconColor="text-green-600 dark:text-green-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <PrivacySettings />
      {/snippet}
    </Card>

    <!-- App Information Section - Enhanced Design -->
    <Card 
      title="About" 
      icon="info-circle" 
      iconColor="text-indigo-600 dark:text-indigo-400"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <!-- Enhanced App Info with Gradient Background -->
        <div class="relative overflow-hidden">
          <!-- Subtle gradient background -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 rounded-xl"></div>
          
          <div class="relative text-center py-8 px-4">
            <!-- Enhanced App Logo with better shadow -->
            <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/25 dark:shadow-indigo-900/40 transform hover:scale-105 transition-transform duration-300">
              <img src='/logo.png' class="w-14 h-14" alt="TempoDay" />
            </div>
            
            <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">TempoDay</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-8 font-medium">Version 0.0.1 • Privacy First</p>
            
            <!-- Enhanced Key Features - Beautiful 2x2 Grid -->
            <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div class="group flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 mb-2 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Icon name="clipboard" class="text-white" size="sm" />
                </div>
                <span class="text-sm font-semibold text-blue-800 dark:text-blue-200">Tasks</span>
                <span class="text-xs text-blue-600 dark:text-blue-300 text-center">Smart planning</span>
              </div>
              
              <div class="group flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl border border-purple-200/50 dark:border-purple-700/30 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 mb-2 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Icon name="edit" class="text-white" size="sm" />
                </div>
                <span class="text-sm font-semibold text-purple-800 dark:text-purple-200">Notes</span>
                <span class="text-xs text-purple-600 dark:text-purple-300 text-center">Daily thoughts</span>
              </div>
              
              <div class="group flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/80 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/30 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 mb-2 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Icon name="dollar" class="text-white" size="sm" />
                </div>
                <span class="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Finance</span>
                <span class="text-xs text-emerald-600 dark:text-emerald-300 text-center">Track expenses</span>
              </div>
              
              <div class="group flex flex-col items-center p-4 bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/30 hover:shadow-lg hover:shadow-slate-500/10 dark:hover:shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1">
                <div class="w-10 h-10 mb-2 bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-400 dark:to-slate-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Icon name="shield" class="text-white" size="sm" />
                </div>
                <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">Private</span>
                <span class="text-xs text-slate-600 dark:text-slate-300 text-center">Local data</span>
              </div>
            </div>
            
            <!-- Enhanced tagline with better styling -->
            <div class="mb-6">
              <p class="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                📅 Calendar-centric personal management
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                All your data stays on your device
              </p>
            </div>
            
            <!-- Enhanced Terms & Conditions Link -->
            <Button
              variant="outline"
              size="sm"
              onclick={navigateToTerms}
              class="!w-full !justify-center !text-gray-700 dark:!text-gray-300 hover:!text-indigo-600 dark:hover:!text-indigo-400 !border-gray-300 dark:!border-gray-600 hover:!border-indigo-300 dark:hover:!border-indigo-500 hover:!bg-indigo-50 dark:hover:!bg-indigo-950/30 transition-all duration-200"
            >
              {#snippet children()}
                <Icon name="info-circle" class="text-gray-500 dark:text-gray-400" size="sm" />
                <span>Terms & Conditions</span>
              {/snippet}
            </Button>
          </div>
        </div>
      {/snippet}
    </Card>
  </div>
</div>

<!-- Donation Modal -->
<DonationModal bind:open={showDonationModal} />