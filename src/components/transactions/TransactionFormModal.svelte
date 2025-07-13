<script lang="ts">
import type { TransactionCategory } from '../../dexie/models';
import { getDefaultCategory } from '../../lib/categories';
import { formatDateKey } from '../../lib/date';
import { appState } from '../../stores/app.svelte';
    import { settingsStore } from '../../stores/settings.svelte';
import { toastStore } from '../../stores/toast.svelte';
import { reactiveTransactions } from '../../stores/transactions.svelte';
import BottomSheet from '../ui/BottomSheet.svelte';
import Button from '../ui/Button.svelte';
import CategorySelector from '../ui/CategorySelector.svelte';
import Icon from '../ui/Icon.svelte';
import Input from '../ui/Input.svelte';

type Props = {
  open: boolean;
};
let { open = $bindable() }: Props = $props();

const { isCreating } = $derived(reactiveTransactions);
const { settings } = $derived(settingsStore);

let description = $state('');
let amount = $state(0);
let type = $state<'income' | 'expense'>('expense');
let category = $state<TransactionCategory>(getDefaultCategory('expense'));

// Update category when transaction type changes
$effect(() => {
  category = getDefaultCategory(type);
});

async function handleAddTransaction(event?: Event) {
  if (event) {
    event.preventDefault();
  }

  const desc = description.trim();

  const dateKey = formatDateKey(appState.selectedDate);
  try {
    await reactiveTransactions.createTransaction({
      description: desc,
      amount,
      type,
      category,
      date: dateKey,
    });
    toastStore.success(
      `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
    );
    resetForm();
  } catch (err) {
    console.error('Failed to add transaction:', err);
    // Error is already handled by reactive store
  }
}

function resetForm() {
  description = '';
  amount = 0;
  type = 'expense';
  category = getDefaultCategory('expense');
  open = false;
}
</script>

<!-- Add Transaction Form -->
<BottomSheet bind:open title="Add Transaction">
  {#snippet children()}
    <form onsubmit={handleAddTransaction} class="space-y-6">
      <!-- Type Selection -->
      <fieldset>
        <legend
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
          >Transaction Type</legend
        >
        <div class="flex gap-2">
          <Button
            type="button"
            variant={type === "income" ? "primary" : "outline"}
            onclick={() => (type = "income")}
            class="flex-1 transition-all duration-200 {type === 'income'
              ? '!bg-green-100 dark:!bg-green-900 !text-green-700 dark:!text-green-300 !border-2 !border-green-200 dark:!border-green-700 shadow-sm'
              : ''}"
          >
            {#snippet children()}
              <Icon name="trending-up" size="sm" class="mr-2" />
              Income
            {/snippet}
          </Button>
          <Button
            type="button"
            variant={type === "expense" ? "primary" : "outline"}
            onclick={() => (type = "expense")}
            class="flex-1 transition-all duration-200 {type === 'expense'
              ? '!bg-red-100 dark:!bg-red-900 !text-red-700 dark:!text-red-300 !border-2 !border-red-200 dark:!border-red-700 shadow-sm'
              : ''}"
          >
            {#snippet children()}
              <Icon name="trending-down" size="sm" class="mr-2" />
              Expense
            {/snippet}
          </Button>
        </div>
      </fieldset>

      <!-- Category Selection -->
      <div class="space-y-2">
        <label
          for="new-transaction-category"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Category
        </label>
        <CategorySelector
          id="new-transaction-category"
          value={category}
          transactionType={type}
          onSelect={(selectedCategory: TransactionCategory) =>
            (category = selectedCategory)}
          size="md"
          dropdownWidth="full"
          class="w-full"
        />
      </div>

      <!-- Description Input -->
      <Input
        bind:value={description}
        placeholder="What was this for?"
        label="Description"
        theme="financials"
        required
      />

      <!-- Amount Input -->
      <Input
        bind:value={amount}
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        label="Amount ({settings.currencySymbol})"
        theme="financials"
        required
      />

      <div class="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onclick={resetForm}
          class="flex-none w-1/4"
        >
          {#snippet children()}
            Cancel
          {/snippet}
        </Button>
        <Button
          type="submit"
          variant="financials"
          class="flex-1"
          disabled={!description.trim() || amount <= 0 || isCreating}
        >
          {#snippet children()}
            {#if isCreating}
              <Icon name="loader" size="sm" class="mr-2 animate-spin" />
              Adding...
            {:else}
              <Icon name="plus" size="sm" class="mr-2" />
              Add {type === "income" ? "Income" : "Expense"}
            {/if}
          {/snippet}
        </Button>
      </div>
    </form>
  {/snippet}
</BottomSheet>
