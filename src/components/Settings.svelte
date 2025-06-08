<script lang="ts">
import { reactiveSettings } from '../db/reactive/settings.svelte';
import Alert from './ui/Alert.svelte';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';

let showSettings = $state(false);

// Reactive values from the settings store
let { settings, isLoading, isSaving, error } = $derived(reactiveSettings);

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
  reactiveSettings.loadSettings();
});

async function updateCurrency(currencyCode: string) {
  const currency = currencies.find((c) => c.code === currencyCode);
  if (currency) {
    await reactiveSettings.updateSettings({
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

<!-- Settings Button -->
<Button variant="ghost" onclick={() => (showSettings = true)} class="!p-2">
  {#snippet children()}
    <Icon name="settings" />
  {/snippet}
</Button>

<!-- Settings Modal -->
<BottomSheet
  bind:open={showSettings}
  title="Settings"
  onClose={() => (showSettings = false)}
>
  {#snippet children()}
    {#if error}
      <Alert
        type="error"
        description={error}
        onDismiss={() => reactiveSettings.clearError()}
        class="mb-4"
      />
    {/if}

    {#if isLoading}
      <Loading size="lg" message="Loading settings..." />
    {:else}
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="dollar" class="text-gray-500" />
            <label for="currency-select" class="font-medium text-gray-900"
              >Currency</label
            >
          </div>

          <select
            id="currency-select"
            value={settings.currency}
            onchange={(e) =>
              updateCurrency((e.target as HTMLSelectElement).value)}
            disabled={isSaving}
            class={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {#each currencies as currency (currency.code)}
              <option value={currency.code}>
                {currency.symbol}
                {currency.code} - {currency.name}
              </option>
            {/each}
          </select>
        </div>
      </div>
    {/if}

    <!-- Footer -->
    <div class="mt-4">
      <Button
        variant="primary"
        onclick={() => (showSettings = false)}
        fullWidth
      >
        {#snippet children()}
          {#if isSaving}
            <Icon name="loader" size="sm" class="mr-2 animate-spin" />
            Saving...
            {:else}
            <Icon name="check" size="sm" class="mr-2" />
            Done
          {/if}
        {/snippet}
      </Button>
    </div>
  {/snippet}
</BottomSheet>
