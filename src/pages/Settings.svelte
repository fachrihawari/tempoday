<script lang="ts">
import BackupRestore from '../components/BackupRestore.svelte';
import DonationModal from '../components/DonationModal.svelte';
import Settings from '../components/Settings.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { toastStore } from '../stores/toast.svelte';

let showDonationModal = $state(false);

// GitHub repository URL
const GITHUB_REPO_URL = 'https://github.com/fachrihawari/tempoday';

// Share content
const SHARE_CONTENT = {
  title: 'TempoDay - Calendar-Centric Personal Management',
  text: 'Check out TempoDay, a privacy-focused personal management app that helps you organize tasks, notes, and finances by date!',
  url: 'https://tempoday.app'
};

async function handleRateUs() {
  try {
    window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open GitHub repo:', error);
    toastStore.error('Failed to open GitHub repository');
  }
}

async function handleShare() {
  try {
    // Try Web Share API first
    if (navigator.share && navigator.canShare && navigator.canShare(SHARE_CONTENT)) {
      await navigator.share(SHARE_CONTENT);
      toastStore.success('Content shared successfully!');
      return;
    }
    
    // Fallback to clipboard
    const shareText = `${SHARE_CONTENT.title}\n\n${SHARE_CONTENT.text}\n\n${SHARE_CONTENT.url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareText);
      toastStore.success('Share content copied to clipboard!');
    } else {
      // Final fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toastStore.success('Share content copied to clipboard!');
    }
  } catch (error) {
    console.error('Failed to share:', error);
    toastStore.error('Failed to share content');
  }
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
    <!-- Support TempoDay Section -->
    <Card 
      title="Support TempoDay" 
      icon="check-circle" 
      iconColor="text-red-500"
      collapsible={true}
      defaultExpanded={false}
    >
      {#snippet children()}
        <div class="space-y-4">
          <!-- Support Message -->
          <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-white text-lg">❤️</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-1">Love TempoDay?</h3>
                <p class="text-sm text-gray-700 leading-relaxed mb-3">
                  Help us keep TempoDay free and continuously improving. Your support makes a real difference in our development journey.
                </p>
                <div class="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span class="bg-white px-2 py-1 rounded-full">🚀 New features</span>
                  <span class="bg-white px-2 py-1 rounded-full">🔒 Privacy-first</span>
                  <span class="bg-white px-2 py-1 rounded-full">💯 Always free</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Donation Button -->
          <Button
            variant="primary"
            fullWidth
            onclick={() => showDonationModal = true}
            class="!p-4 !text-left !justify-start !bg-gradient-to-r !from-red-500 !to-pink-500 hover:!from-red-600 hover:!to-pink-600"
          >
            {#snippet children()}
              <div class="flex items-center gap-4 w-full">
                <div class="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                  <span class="text-2xl">💝</span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-white">Make a Donation</div>
                  <div class="text-sm text-red-100">Support our mission with a one-time donation</div>
                </div>
                <Icon name="chevron-right" class="text-red-200" />
              </div>
            {/snippet}
          </Button>

          <!-- Alternative Support Options -->
          <div class="grid grid-cols-2 gap-3">
            <button
              onclick={handleRateUs}
              class="bg-white rounded-lg p-3 border border-gray-200 text-center hover:bg-gray-50 transition-colors"
            >
              <div class="text-2xl mb-1">⭐</div>
              <div class="text-xs font-medium text-gray-900">Star us</div>
              <div class="text-xs text-gray-600">GitHub</div>
            </button>
            <button
              onclick={handleShare}
              class="bg-white rounded-lg p-3 border border-gray-200 text-center hover:bg-gray-50 transition-colors"
            >
              <div class="text-2xl mb-1">📢</div>
              <div class="text-xs font-medium text-gray-900">Share</div>
              <div class="text-xs text-gray-600">Tell friends</div>
            </button>
          </div>
        </div>
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
          <p class="text-xs text-gray-400">
            Calendar-centric personal management
          </p>
        </div>
      {/snippet}
    </Card>
  </div>
</div>

<!-- Donation Modal -->
<DonationModal bind:open={showDonationModal} />