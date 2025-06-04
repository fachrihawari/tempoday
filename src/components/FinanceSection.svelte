<!-- Enhanced FinanceSection using reusable UI components -->
<script lang="ts">
  import {
    currentDayData,
    updateCurrentDayData,
    settingsStore,
    type Transaction,
  } from "../lib/stores";
  import { formatCurrency, generateId } from "../lib/utils";
  import Card from "./ui/Card.svelte";
  import Button from "./ui/Button.svelte";
  import Input from "./ui/Input.svelte";
  import Icon from "./ui/Icon.svelte";
  import InlineForm from "./ui/InlineForm.svelte";
  import EmptyState from "./ui/EmptyState.svelte";

  const transactions = $derived($currentDayData.transactions);
  const settings = $derived($settingsStore);

  let showAddForm = $state(false);
  let description = $state("");
  let amount = $state("");
  let type = $state<"income" | "expense">("expense");

  // Helper function to format currency with current settings
  function formatAmount(amount: number): string {
    return formatCurrency(amount, settings.currency, settings.locale);
  }

  function addTransaction(
    desc: string,
    amt: number,
    transactionType: "income" | "expense",
  ) {
    const newTransaction: Transaction = {
      id: generateId(),
      description: desc,
      amount: amt,
      type: transactionType,
      date: new Date().toISOString().split("T")[0],
    };

    updateCurrentDayData({
      transactions: [...$currentDayData.transactions, newTransaction],
    });
  }

  function deleteTransaction(transactionId: string) {
    updateCurrentDayData({
      transactions: $currentDayData.transactions.filter(
        (t) => t.id !== transactionId,
      ),
    });
  }

  // Calculate totals
  const totalIncome = $derived(
    transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
  );

  const totalExpenses = $derived(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
  );

  const netBalance = $derived(totalIncome - totalExpenses);

  function handleAddTransaction() {
    const desc = description.trim();
    const amt = parseFloat(amount);

    if (desc && !isNaN(amt) && amt > 0) {
      addTransaction(desc, amt, type);
      resetForm();
    }
  }

  function resetForm() {
    description = "";
    amount = "";
    type = "expense";
    showAddForm = false;
  }
</script>

<Card title="Financial Records" icon="dollar" iconColor="text-green-500">
  {#snippet children()}
    <!-- Daily Summary -->
    {#if transactions.length > 0}
      <div class="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Income:</span>
          <span class="text-green-600 font-medium"
            >{formatAmount(totalIncome)}</span
          >
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Expenses:</span>
          <span class="text-red-600 font-medium"
            >{formatAmount(totalExpenses)}</span
          >
        </div>
        <hr class="border-gray-200" />
        <div class="flex justify-between text-sm font-semibold">
          <span class="text-gray-900">Net Balance:</span>
          <span class={netBalance >= 0 ? "text-green-600" : "text-red-600"}>
            {formatAmount(netBalance)}
          </span>
        </div>
      </div>
    {/if}

    <!-- Transaction List -->
    <div class="space-y-2 {transactions.length > 0 ? 'mb-4' : ''}">
      {#each transactions as transaction (transaction.id)}
        <div
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group relative"
        >
          <div
            class="flex-shrink-0 w-3 h-3 rounded-full {transaction.type ===
            'income'
              ? 'bg-green-500'
              : 'bg-red-500'}"
          ></div>

          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900 truncate">
              {transaction.description}
            </p>
            <p class="text-xs text-gray-500 capitalize">{transaction.type}</p>
          </div>

          <div class="text-right group-hover:mr-8">
            <p
              class="text-sm font-medium {transaction.type === 'income'
                ? 'text-green-600'
                : 'text-red-600'}"
            >
              {transaction.type === "income" ? "+" : "-"}{formatAmount(
                transaction.amount,
              )}
            </p>
          </div>

          <div class="w-8 flex justify-center absolute right-2">
            <Button
              variant="ghost"
              size="sm"
              onclick={() => deleteTransaction(transaction.id)}
              class="opacity-0 group-hover:opacity-100 !p-1 text-red-500 hover:bg-red-50 !w-6 !h-6"
            >
              {#snippet children()}
                <Icon name="trash" size="sm" />
              {/snippet}
            </Button>
          </div>
        </div>
      {/each}

      {#if transactions.length === 0}
        <EmptyState
          icon="dollar"
          title="No transactions for this day"
          subtitle="Tap to track your first transaction"
          onclick={() => (showAddForm = true)}
        />
      {/if}
    </div>

    <!-- Add Transaction Form -->
    <InlineForm
      bind:show={showAddForm}
      onSubmit={handleAddTransaction}
      onCancel={resetForm}
      submitText="Add {type === 'income' ? 'Income' : 'Expense'}"
      submitVariant="financials"
      className="mt-4"
    >
      {#snippet children()}
        <!-- Type Selection -->
        <div class="flex gap-2">
          <Button
            variant={type === "income" ? "primary" : "secondary"}
            onclick={() => (type = "income")}
            class="flex-1 {type === 'income'
              ? '!bg-green-100 !text-green-700 !border-2 !border-green-200'
              : ''}"
          >
            {#snippet children()}Income{/snippet}
          </Button>
          <Button
            variant={type === "expense" ? "primary" : "secondary"}
            onclick={() => (type = "expense")}
            class="flex-1 {type === 'expense'
              ? '!bg-red-100 !text-red-700 !border-2 !border-red-200'
              : ''}"
          >
            {#snippet children()}Expense{/snippet}
          </Button>
        </div>

        <!-- Description Input -->
        <Input
          bind:value={description}
          placeholder="Description (e.g., Lunch, Salary, Gas)"
          label="Description"
        />

        <!-- Amount Input -->
        <Input
          bind:value={amount}
          type="number"
          placeholder="Amount"
          label="Amount ({settings.currencySymbol})"
        />
      {/snippet}
    </InlineForm>

    {#if !showAddForm && transactions.length > 0}
      <Button
        variant="financials"
        dashed={true}
        onclick={() => (showAddForm = true)}
        class="w-full"
      >
        {#snippet children()}
          <Icon name="plus" size="sm" class="mr-2" />
          Add Transaction
        {/snippet}
      </Button>
    {/if}
  {/snippet}
</Card>
