<script lang="ts">
  import { currentDayData, updateCurrentDayData, settingsStore, type Transaction } from '../lib/stores';
  import { formatCurrency, generateId } from '../lib/utils';

  let transactions = $derived($currentDayData.transactions);
  let settings = $derived($settingsStore);

  let showAddForm = $state(false);
  let description = $state('');
  let amount = $state('');
  let type = $state<'income' | 'expense'>('expense');

  // Helper function to format currency with current settings
  function formatAmount(amount: number): string {
    return formatCurrency(amount, settings.currency, settings.locale);
  }

  function addTransaction(desc: string, amt: number, transactionType: 'income' | 'expense') {
    const newTransaction: Transaction = {
      id: generateId(),
      description: desc,
      amount: amt,
      type: transactionType,
      date: new Date().toISOString().split('T')[0] // Will be overridden by the store logic
    };
    
    updateCurrentDayData({
      transactions: [...$currentDayData.transactions, newTransaction]
    });
  }

  function deleteTransaction(transactionId: string) {
    updateCurrentDayData({
      transactions: $currentDayData.transactions.filter(t => t.id !== transactionId)
    });
  }

  // Calculate totals
  let totalIncome = $derived(
    transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  let totalExpenses = $derived(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  let netBalance = $derived(totalIncome - totalExpenses);

  function handleAddTransaction() {
    const desc = description.trim();
    const amt = parseFloat(amount);
    
    if (desc && !isNaN(amt) && amt > 0) {
      addTransaction(desc, amt, type);
      description = '';
      amount = '';
      type = 'expense';
      showAddForm = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleAddTransaction();
    } else if (event.key === 'Escape') {
      showAddForm = false;
      description = '';
      amount = '';
      type = 'expense';
    }
  }
</script>

<section class="bg-white rounded-lg border border-gray-200 p-4">
  <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
    </svg>
    Financial Records
  </h2>

  <!-- Daily Summary -->
  {#if transactions.length > 0}
    <div class="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Income:</span>
        <span class="text-green-600 font-medium">{formatAmount(totalIncome)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Expenses:</span>
        <span class="text-red-600 font-medium">{formatAmount(totalExpenses)}</span>
      </div>
      <hr class="border-gray-200">
      <div class="flex justify-between text-sm font-semibold">
        <span class="text-gray-900">Net Balance:</span>
        <span class="{netBalance >= 0 ? 'text-green-600' : 'text-red-600'}">
          {formatAmount(netBalance)}
        </span>
      </div>
    </div>
  {/if}

  <!-- Transaction List -->
  <div class="space-y-2 mb-4">
    {#each transactions as transaction (transaction.id)}
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group">
        <div class="flex-shrink-0 w-3 h-3 rounded-full {transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}"></div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 truncate">{transaction.description}</p>
          <p class="text-xs text-gray-500 capitalize">{transaction.type}</p>
        </div>
        
        <div class="text-right">
          <p class="text-sm font-medium {transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}">
            {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
          </p>
        </div>
        
        <button
          onclick={() => deleteTransaction(transaction.id)}
          class="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
          aria-label="Delete transaction"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    {/each}

    {#if transactions.length === 0}
      <p class="text-gray-500 text-sm text-center py-4">No transactions for this day</p>
    {/if}
  </div>

  <!-- Add Transaction Form -->
  {#if showAddForm}
    <div class="space-y-3 border-t pt-4">
      <!-- Type Selection -->
      <div class="flex gap-2">
        <button
          onclick={() => type = 'income'}
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
            {type === 'income' 
              ? 'bg-green-100 text-green-700 border-2 border-green-200' 
              : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }"
        >
          Income
        </button>
        <button
          onclick={() => type = 'expense'}
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
            {type === 'expense' 
              ? 'bg-red-100 text-red-700 border-2 border-red-200' 
              : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }"
        >
          Expense
        </button>
      </div>

      <!-- Description Input -->
      <input
        bind:value={description}
        onkeydown={handleKeydown}
        placeholder="Description (e.g., Lunch, Salary, Gas)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
      />

      <!-- Amount Input -->
      <input
        bind:value={amount}
        onkeydown={handleKeydown}
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
      />

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          onclick={handleAddTransaction}
          class="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
        <button
          onclick={() => { showAddForm = false; description = ''; amount = ''; type = 'expense'; }}
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <button
      onclick={() => showAddForm = true}
      class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors text-sm font-medium"
    >
      + Add Transaction
    </button>
  {/if}
</section>
