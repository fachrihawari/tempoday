<script lang="ts">
import { settingsStore } from '../stores/settings.svelte';
import Alert from './ui/Alert.svelte';
import Card from './ui/Card.svelte';
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

<Card title="Currency Settings" icon="dollar" iconColor="text-green-500">
  {#snippet children()}
    {#if error}
      <Alert
        type="error"
        description={error}
        onDismiss={() => settingsStore.clearError()}
        class="mb-4"
      />
    {/if}

    {#if isLoading}
      <Loading size="lg" message="Loading settings..." />
    {:else}
      <div class="space-y-4">
        <div>
          <label for="currency-select" class="block text-sm font-medium text-gray-700 mb-2">
            Choose your preferred currency
          </label>
          <select
            id="currency-select"
            value={settings.currency}
            onchange={(e) => updateCurrency((e.target as HTMLSelectElement).value)}
            disabled={isSaving}
            class={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-base transition-all duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
          >
            {#each currencies as currency (currency.code)}
              <option value={currency.code}>
                {currency.symbol} {currency.code} - {currency.name}
              </option>
            {/each}
          </select>
        </div>
        
        {#if isSaving}
          <div class="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <Icon name="loader" size="sm" class="animate-spin" />
            <span>Saving changes...</span>
          </div>
        {/if}

        <!-- Current Settings Display -->
        <div class="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-4 border border-gray-200">
          <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="check-circle" class="text-green-500" size="sm" />
            Current Configuration
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Currency</div>
              <div class="font-semibold text-gray-900">{settings.currencySymbol} {settings.currency}</div>
            </div>
            <div class="bg-white rounded-lg p-3 border border-gray-200">
              <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Locale</div>
              <div class="font-semibold text-gray-900">{settings.locale}</div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/snippet}
</Card>