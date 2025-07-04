<script lang="ts">
import {
  DONATION_TIERS,
  type DonationTier,
  revenueCatService,
} from '../lib/revenuecat';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';

interface Props {
  open: boolean;
}

let { open = $bindable() }: Props = $props();

let isProcessing = $state(false);
let selectedTier: DonationTier | null = $state(null);

// Handle donation
async function handleDonation(tier: DonationTier) {
  try {
    isProcessing = true;
    selectedTier = tier;

    const success = await revenueCatService.makeDonation(tier);

    if (success) {
      // Close modal after successful donation
      setTimeout(() => {
        open = false;
        selectedTier = null;
      }, 2000);
    }
  } catch (error) {
    console.error('Donation error:', error);
  } finally {
    isProcessing = false;
    selectedTier = null;
  }
}

// Close modal
function closeModal() {
  if (!isProcessing) {
    open = false;
  }
}

// Handle GitHub star
function handleGitHubStar() {
  window.open(
    'https://github.com/fachrihawari/tempoday',
    '_blank',
    'noopener,noreferrer',
  );
}

// Handle share
async function handleShare() {
  const shareContent = {
    title: 'TempoDay - Calendar-Centric Personal Management',
    text: 'Check out TempoDay, a privacy-focused personal management app!',
    url: 'https://tempoday.site',
  };

  try {
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareContent)
    ) {
      await navigator.share(shareContent);
    } else {
      // Fallback to clipboard
      const shareText = `${shareContent.title}\n\n${shareContent.text}\n\n${shareContent.url}`;
      await navigator.clipboard.writeText(shareText);
    }
  } catch (error) {
    console.error('Failed to share:', error);
  }
}
</script>

<BottomSheet bind:open title="Support TempoDay" onClose={closeModal}>
  {#snippet children()}
    <!-- Message -->
    <div class="text-center mb-6">
      <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 rounded-2xl flex items-center justify-center">
        <span class="text-2xl">❤️</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Every donation matters</h3>
      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        TempoDay is built with love by a small team. Your support helps us dedicate more time to adding new features, 
        fixing bugs, and keeping the app completely free for everyone.
      </p>
    </div>

    <!-- Demo Mode Notice -->
    {#if revenueCatService.isDemoMode()}
      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
        <div class="flex items-start gap-2">
          <Icon name="info-circle" class="text-amber-600 dark:text-amber-400 mt-0.5" size="sm" />
          <div class="text-sm">
            <div class="font-medium text-amber-900 dark:text-amber-100">Demo Mode</div>
            <div class="text-amber-700 dark:text-amber-300">This is a demo. No actual payments will be processed.</div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Donation Tiers -->
    <div class="space-y-3 mb-6">
      {#each DONATION_TIERS as tier}
        <Button
          variant="outline"
          fullWidth
          disabled={isProcessing}
          onclick={() => handleDonation(tier)}
          class="!p-4 !text-left !justify-start !relative !h-auto"
        >
          {#snippet children()}
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <div class="text-2xl">
                  {#if tier.identifier === 'small_coffee'}☕
                  {:else if tier.identifier === 'large_coffee'}☕
                  {:else if tier.identifier === 'lunch'}🍽️
                  {:else if tier.identifier === 'generous_support'}🎉
                  {:else}💝{/if}
                </div>
                <div class="text-left">
                  <div class="font-medium text-gray-900 dark:text-gray-100">{tier.title}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300">{tier.description}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{tier.price}</div>
                
                {#if isProcessing && selectedTier?.identifier === tier.identifier}
                  <div class="w-5 h-5 border-2 border-red-500 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                {:else}
                  <Icon name="chevron-right" class="text-gray-400 dark:text-gray-500" />
                {/if}
              </div>
            </div>
          {/snippet}
        </Button>
      {/each}
    </div>

    <!-- Features Reminder -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
      <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-3 text-sm">What your support helps us build:</h4>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="flex items-center gap-2">
          <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
          <span class="text-gray-700 dark:text-gray-300">New features</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
          <span class="text-gray-700 dark:text-gray-300">Bug fixes</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
          <span class="text-gray-700 dark:text-gray-300">Better performance</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon name="check-circle" class="text-green-500 dark:text-green-400" size="sm" />
          <span class="text-gray-700 dark:text-gray-300">Always free</span>
        </div>
      </div>
    </div>

    <!-- Alternative Support -->
    <div class="text-center text-sm text-gray-600 dark:text-gray-300">
      <p class="mb-3">Can't donate right now? No problem!</p>
      <div class="flex justify-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onclick={handleGitHubStar}
          class="!text-red-500 hover:!text-red-600 dark:!text-red-400 dark:hover:!text-red-300"
        >
          {#snippet children()}
            ⭐ Star on GitHub
          {/snippet}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onclick={handleShare}
          class="!text-red-500 hover:!text-red-600 dark:!text-red-400 dark:hover:!text-red-300"
        >
          {#snippet children()}
            📢 Share with friends
          {/snippet}
        </Button>
      </div>
    </div>
  {/snippet}
</BottomSheet>
