<script lang="ts">
import { settingsStore } from '../stores/settings.svelte';
import Alert from './ui/Alert.svelte';
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
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="dollar" class="text-green-600" size="sm" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">Currency Preference</h3>
            <p class="text-sm text-gray-600 mb-4">Choose your preferred currency for financial tracking and reporting</p>
            
            <div class="space-y-3">
              <select
                value={settings.currency}
                onchange={(e) => updateCurrency((e.target as HTMLSelectElement).value)}
                disabled={isSaving}
                class={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-base transition-all duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
              >
                {#each currencies as currency (currency.code)}
                  <option value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                {/each}
              </select>
              
              {#if isSaving}
                <div class="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <Icon name="loader" size="sm" class="animate-spin" />
                  <span>Saving changes...</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Current Settings Display -->
      <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Icon name="check-circle" class="text-green-500" size="sm" />
          Current Configuration
        </h4>
        <div class="grid grid-cols-2 gap-4">
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
</div>