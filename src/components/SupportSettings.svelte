<script lang="ts">
import { toastStore } from '../stores/toast.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';

// Svelte 5 approach: Use callback props
interface Props {
  onDonate: () => void;
}

let { onDonate }: Props = $props();

// GitHub repository URL
const GITHUB_REPO_URL = 'https://github.com/fachrihawari/tempoday';

// Share content
const SHARE_CONTENT = {
  title: 'TempoDay - Calendar-Centric Personal Management',
  text: 'Check out TempoDay, a privacy-focused personal management app that helps you organize tasks, notes, and finances by date!',
  url: 'https://tempoday.site',
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
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(SHARE_CONTENT)
    ) {
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
    // Check if the error is an AbortError (user canceled the share)
    if (error instanceof DOMException && error.name === 'AbortError') {
      // User canceled the share dialog - this is expected behavior, don't show error
      return;
    }

    console.error('Failed to share:', error);
    toastStore.error('Failed to share content');
  }
}
</script>

<div class="space-y-4">
  <!-- Support Message -->
  <div
    class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800"
  >
    <div class="flex items-start gap-3">
      <div
        class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      >
        <span class="text-white text-lg">❤️</span>
      </div>
      <div>
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
          Love TempoDay?
        </h3>
        <p
          class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3"
        >
          Help us keep TempoDay free and continuously improving. Your support
          makes a real difference in our development journey.
        </p>
        <div
          class="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400"
        >
          <span
            class="bg-white dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full"
            >🚀 New features</span
          >
          <span
            class="bg-white dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full"
            >🔒 Privacy-first</span
          >
          <span
            class="bg-white dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full"
            >💯 Always free</span
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Donation Button -->
  <Button
    variant="primary"
    fullWidth
    onclick={onDonate}
    class="!p-4 !text-left !justify-start !bg-gradient-to-r  !from-red-500  !via-red-600 !to-red-700  dark:!from-red-800  dark:!via-red-900 dark:!to-red-950"
  >
    {#snippet children()}
      <div class="flex items-center gap-4 w-full">
        <span class="text-2xl">💝</span>
        <div class="flex-1">
          <h3 class="font-semibold text-white mb-1">Support TempoDay</h3>
          <p class="text-red-100 text-sm">
            Help keep this app free and growing
          </p>
        </div>
        <div class="text-white">
          <Icon name="chevron-right" />
        </div>
      </div>
    {/snippet}
  </Button>

  <!-- Alternative Support Options -->
  <div class="grid grid-cols-2 gap-3">
    <button
      onclick={handleRateUs}
      class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div class="text-2xl mb-1">⭐</div>
      <div class="text-xs font-medium text-gray-900 dark:text-gray-100">
        Star us
      </div>
      <div class="text-xs text-gray-600 dark:text-gray-400">GitHub</div>
    </button>
    <button
      onclick={handleShare}
      class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div class="text-2xl mb-1">📢</div>
      <div class="text-xs font-medium text-gray-900 dark:text-gray-100">
        Share
      </div>
      <div class="text-xs text-gray-600 dark:text-gray-400">Tell friends</div>
    </button>
  </div>
</div>
