<script lang="ts">
import BottomSheet from '../ui/BottomSheet.svelte';
import Button from '../ui/Button.svelte';
import Icon from '../ui/Icon.svelte';

interface Props {
  open: boolean;
}

export interface DonationTier {
  identifier: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

// Donation tiers - these represent different donation amounts
export const DONATION_TIERS: DonationTier[] = [
  {
    identifier: 'small_coffee',
    title: 'Small Coffee',
    description: 'Buy us a small coffee',
    price: 'Rp. 15.000',
    link: 'https://app.midtrans.com/payment-links/hawari-dev-small-coffee',
  },
  {
    identifier: 'large_coffee',
    title: 'Large Coffee',
    description: 'Buy us a large coffee',
    price: 'Rp. 25.000',
    link: 'https://app.midtrans.com/payment-links/hawari-dev-large-coffee',
  },
  {
    identifier: 'lunch',
    title: 'Lunch',
    description: 'Buy us lunch',
    price: 'Rp. 50.000',
    link: 'https://app.midtrans.com/payment-links/hawari-dev-lunch',
  },
  {
    identifier: 'generous_support',
    title: 'Generous Support',
    description: 'Super generous support',
    price: 'Rp. 100.000',
    link: 'https://app.midtrans.com/payment-links/hawari-dev-generous-support',
  },
];

let { open = $bindable() }: Props = $props();

// Handle donation
async function handleDonation(tier: DonationTier) {
  // Open the donation link in a new tab
  window.open(tier.link, '_blank', 'noopener,noreferrer');
}

// Close modal
function closeModal() {
  open = false;
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
    url: 'https://tempoday.com',
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


    <!-- Donation Tiers -->
    <div class="space-y-3">
      {#each DONATION_TIERS as tier}
        <Button
          variant="outline"
          fullWidth
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
                <Icon name="chevron-right" class="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          {/snippet}
        </Button>
      {/each}
    </div>

  {/snippet}
</BottomSheet>
