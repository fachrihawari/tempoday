<script lang="ts">
  import { settingsStore } from '../lib/stores';
  import Modal from './ui/Modal.svelte';
  import Button from './ui/Button.svelte';
  import Icon from './ui/Icon.svelte';

  let showSettings = $state(false);
  const settings = $derived($settingsStore);
  
  // Popular currencies
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  ];

  function updateCurrency(currencyCode: string) {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      settingsStore.update(s => ({
        ...s,
        currency: currency.code,
        currencySymbol: currency.symbol,
        locale: getLocaleForCurrency(currency.code)
      }));
    }
  }

  function getLocaleForCurrency(currencyCode: string): string {
    const localeMap: Record<string, string> = {
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'JPY': 'ja-JP',
      'CAD': 'en-CA',
      'AUD': 'en-AU',
      'CHF': 'de-CH',
      'CNY': 'zh-CN',
      'INR': 'en-IN',
      'SGD': 'en-SG',
      'IDR': 'id-ID',
    };
    return localeMap[currencyCode] || 'en-US';
  }
</script>

<!-- Settings Button -->
<Button 
  variant="ghost"
  onclick={() => showSettings = true}
  class="!p-2"
>
  {#snippet children()}
    <Icon name="settings" />
  {/snippet}
</Button>

<!-- Settings Modal -->
<Modal bind:open={showSettings} title="Settings" onClose={() => showSettings = false}>
  {#snippet children()}
    <div class="space-y-6">
      <!-- Currency Section -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 mb-3">Currency</h3>
        <div class="space-y-2">
          <p class="text-xs text-gray-500 mb-2">
            Current: {settings.currencySymbol} ({settings.currency})
          </p>
          <div class="grid grid-cols-1 gap-2">
            {#each currencies as currency (currency.code)}
              <button
                onclick={() => updateCurrency(currency.code)}
                class="flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors
                  {settings.currency === currency.code ? 'bg-blue-50 border-blue-200' : ''}"
              >
                <div class="flex items-center gap-3">
                  <span class="text-lg font-medium text-gray-700">{currency.symbol}</span>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{currency.code}</div>
                    <div class="text-xs text-gray-500">{currency.name}</div>
                  </div>
                </div>
                {#if settings.currency === currency.code}
                  <Icon name="check" class="text-blue-500" />
                {/if}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-6 pt-4 border-t border-gray-200">
      <Button 
        variant="secondary"
        onclick={() => showSettings = false}
        class="w-full"
      >
        {#snippet children()}Done{/snippet}
      </Button>
    </div>
  {/snippet}
</Modal>
