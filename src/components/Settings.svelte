<script lang="ts">
import { settingsStore } from '../stores/settings.svelte';
import Alert from './ui/Alert.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';

// Reactive values from the settings store
let { settings, isLoading, isSaving, error } = $derived(settingsStore);

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

// Load settings when component initializes
$effect(() => {
  settingsStore.loadSettings();
});

async function updateCurrency(currencyCode: string) {
  const currency = currencies.find((c) => c.code === currencyCode);
  if (currency) {
    await settingsStore.updateSettings({
      currency: currency.code,
      currencySymbol: currency.symbol,
      locale: getLocaleForCurrency(currency.code),
    });
  }
}

function getLocaleForCurrency(currencyCode: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CAD: 'en-CA',
    AUD: 'en-AU',
    CHF: 'de-CH',
    CNY: 'zh-CN',
    INR: 'en-IN',
    SGD: 'en-SG',
    IDR: 'id-ID',
  };
  return localeMap[currencyCode] || 'en-US';
}
</script>

<div class="space-y-6">
  {#if error}
    <Alert
      type="error"
      description={error}
      onDismiss={() => settingsStore.clearError()}
    />
  {/if}

  {#if isLoading}
    <Loading size="lg" message="Loading settings..." />
  {:else}
    <div class="space-y-6">
      <!-- Currency Settings -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Icon name="dollar" class="text-gray-500" />
          <div>
            <h3 class="font-medium text-gray-900">Currency</h3>
            <p class="text-sm text-gray-600">Choose your preferred currency for financial tracking</p>
          </div>
        </div>

        <div class="ml-8">
          <select
            value={settings.currency}
            onchange={(e) => updateCurrency((e.target as HTMLSelectElement).value)}
            disabled={isSaving}
            class={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {#each currencies as currency (currency.code)}
              <option value={currency.code}>
                {currency.symbol} {currency.code} - {currency.name}
              </option>
            {/each}
          </select>
          
          {#if isSaving}
            <div class="flex items-center mt-2 text-sm text-gray-600">
              <Icon name="loader" size="sm" class="mr-2 animate-spin" />
              Saving changes...
            </div>
          {/if}
        </div>
      </div>

      <!-- Current Settings Display -->
      <div class="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 class="font-medium text-gray-900">Current Settings</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Currency:</span>
            <span class="font-medium">{settings.currencySymbol} {settings.currency}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Locale:</span>
            <span class="font-medium">{settings.locale}</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>