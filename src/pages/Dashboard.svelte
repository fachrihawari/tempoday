<script lang="ts">
import { onMount } from 'svelte';
import { formatDate } from '../lib/date';
import { reactiveTasks } from '../stores/tasks.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { settingsStore } from '../stores/settings.svelte';
import { formatCurrency } from '../lib/currency';
import { formatDateKey } from '../lib/date';
import { reactiveRouter } from '../stores/router.svelte';
import Card from '../components/ui/Card.svelte';
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';
import Loading from '../components/ui/Loading.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';

// Reactive values from stores
let { tasks, isLoading: tasksLoading } = $derived(reactiveTasks);
let { transactions, totalIncome, totalExpenses, netBalance, isLoading: transactionsLoading } = $derived(reactiveTransactions);
let { hasNote, isLoading: notesLoading } = $derived(reactiveNotes);
let { settings } = $derived(settingsStore);
let router = $derived(reactiveRouter);

// Load data for today
onMount(async () => {
  const today = formatDateKey(new Date());
  
  // Load settings first
  await settingsStore.loadSettings();
  
  // Load data for today
  await Promise.all([
    reactiveTasks.loadTasks(today),
    reactiveTransactions.loadTransactions(today),
    reactiveNotes.loadNote(today)
  ]);
});

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  const currency = settings?.currency || 'USD';
  const locale = settings?.locale || 'en-US';
  return formatCurrency(amount, currency, locale);
}

function goToCalendar() {
  router.navigate('/calendar');
}
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader 
    title="TempoDay" 
    subtitle={formatDate(new Date())}
    icon="home"
  >
    {#snippet children()}
      <Button variant="primary" onclick={goToCalendar} class="px-4 py-2">
        {#snippet children()}
          <Icon name="calendar" size="sm" class="mr-2" />
          View Calendar
        {/snippet}
      </Button>
    {/snippet}
  </PageHeader>

  <!-- Dashboard Content using Card components -->
  <div class="flex-1 overflow-y-auto">
    <!-- Quick Stats Section -->
    <Card title="Today's Summary" icon="home" iconColor="text-blue-500">
      {#snippet children()}
        <div class="grid grid-cols-2 gap-4">
          <!-- Tasks Summary -->
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <Icon name="clipboard" class="text-blue-500 mb-2" />
                <p class="text-sm text-blue-600 font-medium">Tasks</p>
                {#if tasksLoading}
                  <div class="flex items-center mt-1">
                    <Icon name="loader" size="sm" class="animate-spin mr-1" />
                    <span class="text-xs text-blue-500">Loading...</span>
                  </div>
                {:else}
                  <p class="text-2xl font-bold text-blue-700">
                    {tasks.filter(t => t.completed).length}/{tasks.length}
                  </p>
                {/if}
              </div>
            </div>
          </div>

          <!-- Finance Summary -->
          <div class="bg-green-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <Icon name="dollar" class="text-green-500 mb-2" />
                <p class="text-sm text-green-600 font-medium">Net Balance</p>
                {#if transactionsLoading}
                  <div class="flex items-center mt-1">
                    <Icon name="loader" size="sm" class="animate-spin mr-1" />
                    <span class="text-xs text-green-500">Loading...</span>
                  </div>
                {:else}
                  <p class="text-lg font-bold {netBalance >= 0 ? 'text-green-700' : 'text-red-600'}">
                    {formatAmount(netBalance)}
                  </p>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/snippet}
    </Card>

    <!-- Tasks Overview -->
    <Card title="Tasks" icon="clipboard" iconColor="text-blue-500">
      {#snippet headerAction()}
        {#if tasks.length > 0}
          <span class="text-sm text-gray-500">
            {tasks.filter(t => t.completed).length}/{tasks.length} completed
          </span>
        {/if}
      {/snippet}

      {#snippet children()}
        {#if tasksLoading}
          <Loading size="lg" message="Loading tasks..." />
        {:else if tasks.length === 0}
          <div class="text-center py-8">
            <Icon name="clipboard" size="xl" class="mx-auto mb-4 text-gray-300" />
            <p class="text-gray-500 mb-2">No tasks for today</p>
            <Button variant="tasks" onclick={goToCalendar}>
              {#snippet children()}
                <Icon name="plus" size="sm" class="mr-2" />
                Add Your First Task
              {/snippet}
            </Button>
          </div>
        {:else}
          <div class="space-y-2">
            {#each tasks.slice(0, 5) as task}
              <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <div class="w-2 h-2 rounded-full {task.completed ? 'bg-green-500' : 'bg-gray-300'}"></div>
                <span class="flex-1 text-sm {task.completed ? 'line-through text-gray-500' : 'text-gray-900'}">{task.description}</span>
                {#if task.completed}
                  <Icon name="check" size="sm" class="text-green-500" />
                {/if}
              </div>
            {/each}
            {#if tasks.length > 5}
              <p class="text-xs text-gray-500 text-center pt-2">+{tasks.length - 5} more tasks</p>
            {/if}
            <Button variant="tasks" dashed={true} onclick={goToCalendar} class="w-full mt-4">
              {#snippet children()}
                <Icon name="calendar" size="sm" class="mr-2" />
                View All Tasks
              {/snippet}
            </Button>
          </div>
        {/if}
      {/snippet}
    </Card>

    <!-- Daily Note Overview -->
    <Card title="Daily Note" icon="edit" iconColor="text-purple-500">
      {#snippet children()}
        {#if notesLoading}
          <Loading size="lg" message="Loading note..." />
        {:else if hasNote}
          <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div class="flex items-center gap-3">
              <Icon name="check-circle" class="text-purple-600" />
              <div>
                <p class="text-sm font-medium text-purple-900">Note added for today</p>
                <p class="text-xs text-purple-600">Your thoughts have been captured</p>
              </div>
            </div>
          </div>
          <Button variant="notes" dashed={true} onclick={goToCalendar} class="w-full mt-4">
            {#snippet children()}
              <Icon name="edit" size="sm" class="mr-2" />
              View & Edit Note
            {/snippet}
          </Button>
        {:else}
          <div class="text-center py-8">
            <Icon name="edit" size="xl" class="mx-auto mb-4 text-gray-300" />
            <p class="text-gray-500 mb-2">No note for today</p>
            <Button variant="notes" onclick={goToCalendar}>
              {#snippet children()}
                <Icon name="plus" size="sm" class="mr-2" />
                Write Your First Note
              {/snippet}
            </Button>
          </div>
        {/if}
      {/snippet}
    </Card>

    <!-- Finance Overview -->
    <Card title="Financial Records" icon="dollar" iconColor="text-green-500">
      {#snippet headerAction()}
        {#if transactions.length > 0}
          <span class="text-sm text-gray-500">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </span>
        {/if}
      {/snippet}

      {#snippet children()}
        {#if transactionsLoading}
          <Loading size="lg" message="Loading transactions..." />
        {:else if transactions.length === 0}
          <div class="text-center py-8">
            <Icon name="dollar" size="xl" class="mx-auto mb-4 text-gray-300" />
            <p class="text-gray-500 mb-2">No transactions for today</p>
            <Button variant="financials" onclick={goToCalendar}>
              {#snippet children()}
                <Icon name="plus" size="sm" class="mr-2" />
                Track Your First Transaction
              {/snippet}
            </Button>
          </div>
        {:else}
          <!-- Daily Summary -->
          <div class="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Income:</span>
              <span class="text-green-600 font-medium">{formatAmount(totalIncome)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Expenses:</span>
              <span class="text-red-600 font-medium">{formatAmount(totalExpenses)}</span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between text-sm font-semibold">
              <span class="text-gray-900">Net Balance:</span>
              <span class="{netBalance >= 0 ? 'text-green-600' : 'text-red-600'}">
                {formatAmount(netBalance)}
              </span>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="space-y-2">
            {#each transactions.slice(0, 3) as transaction}
              <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <div class="flex-shrink-0 w-3 h-3 rounded-full {transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 truncate">{transaction.description}</p>
                  <p class="text-xs text-gray-500 capitalize">{transaction.type}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium {transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    {transaction.type === "income" ? "+" : "-"}{formatAmount(transaction.amount)}
                  </p>
                </div>
              </div>
            {/each}
            {#if transactions.length > 3}
              <p class="text-xs text-gray-500 text-center pt-2">+{transactions.length - 3} more transactions</p>
            {/if}
          </div>

          <Button variant="financials" dashed={true} onclick={goToCalendar} class="w-full mt-4">
            {#snippet children()}
              <Icon name="calendar" size="sm" class="mr-2" />
              View All Transactions
            {/snippet}
          </Button>
        {/if}
      {/snippet}
    </Card>
  </div>
</div>