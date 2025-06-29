<script lang="ts">
import { onMount } from 'svelte';
import { donationManager, getRevenueCatConfig, type DonationTier } from '../lib/revenuecat';
import Alert from './ui/Alert.svelte';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';

interface Props {
  open: boolean;
  onClose?: () => void;
}

let { open = $bindable(), onClose }: Props = $props();

let isInitializing = $state(false);
let isInitialized = $state(false);
let isPurchasing = $state(false);
let selectedTier = $state<string | null>(null);
let purchaseResult = $state<{
  success: boolean;
  message: string;
} | null>(null);
let initError = $state<string | null>(null);

// Initialize RevenueCat when component mounts
onMount(async () => {
  await initializeRevenueCat();
});

async function initializeRevenueCat() {
  if (isInitialized || isInitializing) return;
  
  isInitializing = true;
  initError = null;

  try {
    const config = getRevenueCatConfig();
    await donationManager.initialize(config);
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    initError = error instanceof Error ? error.message : 'Failed to initialize payment system';
  } finally {
    isInitializing = false;
  }
}

async function handleDonation(tierId: string) {
  if (!isInitialized) {
    await initializeRevenueCat();
    if (!isInitialized) return;
  }

  selectedTier = tierId;
  isPurchasing = true;
  purchaseResult = null;

  try {
    const result = await donationManager.makeDonation(tierId);
    
    if (result.success) {
      purchaseResult = {
        success: true,
        message: 'Thank you for your generous donation! Your support means the world to us. 🙏'
      };
      
      // Auto-close after success
      setTimeout(() => {
        close();
      }, 3000);
    } else {
      purchaseResult = {
        success: false,
        message: result.error || 'Donation failed. Please try again.'
      };
    }
  } catch (error) {
    console.error('Donation error:', error);
    purchaseResult = {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    };
  } finally {
    isPurchasing = false;
    selectedTier = null;
  }
}

function close() {
  open = false;
  onClose?.();
  // Clear states when closing
  purchaseResult = null;
  selectedTier = null;
}

function clearResult() {
  purchaseResult = null;
}

// Get donation tiers from the manager
const donationTiers = $derived(donationManager.donationTiers);
</script>

<BottomSheet bind:open={open} title="Support TempoDay" onClose={close}>
  {#snippet children()}
    <div class="space-y-6">
      {#if initError}
        <!-- Initialization Error -->
        <Alert
          type="error"
          title="Payment System Error"
          description={initError}
          dismissible={true}
          onDismiss={() => initError = null}
        />
        
        <Button
          variant="primary"
          fullWidth
          onclick={initializeRevenueCat}
          disabled={isInitializing}
        >
          {#snippet children()}
            {#if isInitializing}
              <Icon name="loader" size="sm" class="mr-2 animate-spin" />
              Initializing...
            {:else}
              <Icon name="trending-up" size="sm" class="mr-2" />
              Retry Initialization
            {/if}
          {/snippet}
        </Button>
      {:else if isInitializing}
        <!-- Loading State -->
        <Loading size="xl" message="Initializing payment system..." />
      {:else if purchaseResult?.success}
        <!-- Success State -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div class="text-4xl mb-3">🎉</div>
          <h3 class="font-medium text-green-900 text-lg mb-2">
            Donation Successful!
          </h3>
          <p class="text-sm text-green-700">
            {purchaseResult.message}
          </p>
        </div>
      {:else if purchaseResult && !purchaseResult.success}
        <!-- Error State -->
        <Alert
          type="error"
          description={purchaseResult.message}
          dismissible={true}
          onDismiss={clearResult}
        />
      {:else}
        <!-- Main Donation Interface -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-2xl">❤️</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Support TempoDay</h3>
          <p class="text-sm text-gray-600">
            Help us keep TempoDay free and continuously improving. Your support makes a difference!
          </p>
        </div>

        <!-- Donation Tiers -->
        <div class="space-y-3">
          {#each donationTiers as tier (tier.id)}
            <div class="relative">
              {#if tier.isPopular}
                <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span class="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              {/if}
              
              <button
                onclick={() => handleDonation(tier.id)}
                disabled={isPurchasing}
                class="w-full p-4 border-2 rounded-lg transition-all duration-200 text-left
                  {tier.isPopular 
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
                  {isPurchasing && selectedTier === tier.id 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-md'}"
              >
                <div class="flex items-center gap-4">
                  <div class="text-3xl">{tier.emoji}</div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-medium text-gray-900">{tier.title}</h4>
                      <span class="font-bold text-lg {tier.isPopular ? 'text-blue-600' : 'text-gray-900'}">
                        {tier.price}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{tier.description}</p>
                    <div class="flex flex-wrap gap-1">
                      {#each tier.benefits as benefit}
                        <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      {/each}
                    </div>
                  </div>
                  
                  {#if isPurchasing && selectedTier === tier.id}
                    <Icon name="loader" size="sm" class="animate-spin text-gray-400" />
                  {:else}
                    <Icon name="chevron-right" size="sm" class="text-gray-400" />
                  {/if}
                </div>
              </button>
            </div>
          {/each}
        </div>

        <!-- Additional Info -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Icon name="info-circle" class="text-gray-600" size="sm" />
            Why Donate?
          </h4>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Keep TempoDay completely free for everyone</li>
            <li>• Support ongoing development and new features</li>
            <li>• Help maintain our privacy-first approach</li>
            <li>• Show appreciation for our work</li>
          </ul>
        </div>

        <!-- Security Notice -->
        <div class="text-center">
          <p class="text-xs text-gray-500">
            🔒 Secure payments powered by RevenueCat & Apple/Google Pay
          </p>
        </div>
      {/if}
    </div>
  {/snippet}
</BottomSheet>
```