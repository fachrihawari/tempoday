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
  </div>
</div>