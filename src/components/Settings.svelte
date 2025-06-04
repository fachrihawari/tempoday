<script lang="ts">
  import { settingsStore } from "../lib/stores";
  import BottomSheet from "./ui/BottomSheet.svelte";
  import Button from "./ui/Button.svelte";
  import Icon from "./ui/Icon.svelte";

  let showSettings = $state(false);
  const settings = $derived($settingsStore);

  // Popular currencies
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  ];

  function updateCurrency(currencyCode: string) {
    const currency = currencies.find((c) => c.code === currencyCode);
    if (currency) {
      settingsStore.update((s) => ({
        ...s,
        currency: currency.code,
        currencySymbol: currency.symbol,
        locale: getLocaleForCurrency(currency.code),
      }));
    }
  }

  function getLocaleForCurrency(currencyCode: string): string {
    const localeMap: Record<string, string> = {
      USD: "en-US",
      EUR: "de-DE",
      GBP: "en-GB",
      JPY: "ja-JP",
      CAD: "en-CA",
      AUD: "en-AU",
      CHF: "de-CH",
      CNY: "zh-CN",
      INR: "en-IN",
      SGD: "en-SG",
      IDR: "id-ID",
    };
    return localeMap[currencyCode] || "en-US";
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
          onchange={(e) => updateCurrency((e.target as HTMLSelectElement).value)}
          class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
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

    <!-- Footer -->
    <div class="mt-8 pt-4">
      <Button
        variant="primary"
        onclick={() => (showSettings = false)}
        class="w-full"
      >
        {#snippet children()}
          <Icon name="check" size="sm" class="mr-2" />
          Done
        {/snippet}
      </Button>
    </div>
  {/snippet}
</BottomSheet>
