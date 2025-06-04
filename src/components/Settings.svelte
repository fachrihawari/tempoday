<script lang="ts">
  import { settingsStore, type Settings } from '../lib/stores';

  let showSettings = $state(false);
  let settings = $derived($settingsStore);
  
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
<button
  onclick={() => showSettings = true}
  class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Settings"
>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
</button>

<!-- Settings Modal -->
{#if showSettings}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Settings</h2>
        <button
          onclick={() => showSettings = false}
          class="p-1 text-gray-400 hover:text-gray-600 rounded"
          aria-label="Close settings"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-6">
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
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200">
        <button
          onclick={() => showSettings = false}
          class="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Done
        </button>
      </div>
    </div>
  </div>
{/if}
