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
import AIAssistant from '../components/AIAssistant.svelte';
import Card from '../components/ui/Card.svelte';
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';
import Loading from '../components/ui/Loading.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';

// Reactive values from stores
let { tasks, isLoading: tasksLoading, completedCount, totalCount } = $derived(reactiveTasks);
let { transactions, totalIncome, totalExpenses, netBalance, isLoading: transactionsLoading } = $derived(reactiveTransactions);
let { hasNote, content: noteContent, isLoading: notesLoading } = $derived(reactiveNotes);
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

// Derived values for summary
const isLoading = $derived(tasksLoading || transactionsLoading || notesLoading);
const hasAnyData = $derived(totalCount > 0 || transactions.length > 0 || hasNote);
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

  <!-- Dashboard Content -->
  <div class="flex-1 overflow-y-auto">
    <!-- Today's Summary Section -->
    <Card title="Today's Summary" icon="home" iconColor="text-blue-500">
      {#snippet children()}
        {#if isLoading}
          <Loading size="lg" message="Loading today's summary..." />
        {:else if hasAnyData}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Tasks Summary -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Icon name="clipboard" size="sm" class="text-white" />
                  </div>
                  <h3 class="font-semibold text-blue-900">Tasks</h3>
                </div>
                <span class="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full font-medium">
                  {completedCount}/{totalCount}
                </span>
              </div>
              
              {#if totalCount > 0}
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-blue-700">Completed:</span>
                    <span class="font-medium text-blue-900">{completedCount}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-blue-700">Remaining:</span>
                    <span class="font-medium text-blue-900">{totalCount - completedCount}</span>
                  </div>
                  <div class="w-full bg-blue-200 rounded-full h-2 mt-3">
                    <div 
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style="width: {totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%"
                    ></div>
                  </div>
                  <p class="text-xs text-blue-600 text-center mt-2">
                    {Math.round((completedCount / totalCount) * 100)}% complete
                  </p>
                </div>
              {:else}
                <p class="text-sm text-blue-600">No tasks for today</p>
              {/if}
            </div>

            <!-- Notes Summary -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Icon name="edit" size="sm" class="text-white" />
                  </div>
                  <h3 class="font-semibold text-purple-900">Daily Note</h3>
                </div>
                <span class="text-xs {hasNote ? 'text-purple-600 bg-purple-200' : 'text-gray-500 bg-gray-200'} px-2 py-1 rounded-full font-medium">
                  {hasNote ? 'Written' : 'Empty'}
                </span>
              </div>
              
              {#if hasNote}
                <div class="bg-white rounded-lg p-3 border border-purple-200">
                  <p class="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {noteContent.length > 100 ? noteContent.substring(0, 100) + '...' : noteContent}
                  </p>
                </div>
                <p class="text-xs text-purple-600 mt-2">
                  {noteContent.length} characters
                </p>
              {:else}
                <p class="text-sm text-purple-600">No note written today</p>
              {/if}
            </div>

            <!-- Finance Summary -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Icon name="dollar" size="sm" class="text-white" />
                  </div>
                  <h3 class="font-semibold text-green-900">Finances</h3>
                </div>
                <span class="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full font-medium">
                  {transactions.length} transactions
                </span>
              </div>
              
              {#if transactions.length > 0}
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-green-700">Income:</span>
                    <span class="font-medium text-green-900">{formatAmount(totalIncome)}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-green-700">Expenses:</span>
                    <span class="font-medium text-red-600">{formatAmount(totalExpenses)}</span>
                  </div>
                  <hr class="border-green-200" />
                  <div class="flex justify-between text-sm font-semibold">
                    <span class="text-green-900">Net:</span>
                    <span class={netBalance >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatAmount(netBalance)}
                    </span>
                  </div>
                </div>
              {:else}
                <p class="text-sm text-green-600">No transactions today</p>
              {/if}
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-6 flex flex-wrap gap-3">
            <Button variant="tasks" onclick={goToCalendar} class="flex-1 min-w-0">
              {#snippet children()}
                <Icon name="clipboard" size="sm" class="mr-2" />
                Add Task
              {/snippet}
            </Button>
            <Button variant="notes" onclick={goToCalendar} class="flex-1 min-w-0">
              {#snippet children()}
                <Icon name="edit" size="sm" class="mr-2" />
                Write Note
              {/snippet}
            </Button>
            <Button variant="financials" onclick={goToCalendar} class="flex-1 min-w-0">
              {#snippet children()}
                <Icon name="dollar" size="sm" class="mr-2" />
                Add Transaction
              {/snippet}
            </Button>
          </div>
        {:else}
          <!-- Empty State -->
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="home" size="xl" class="text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Welcome to TempoDay!</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              Start your day by adding tasks, writing notes, or tracking expenses. Use the AI assistant below to get started quickly.
            </p>
            <Button variant="primary" onclick={goToCalendar}>
              {#snippet children()}
                <Icon name="calendar" size="sm" class="mr-2" />
                Open Calendar
              {/snippet}
            </Button>
          </div>
        {/if}
      {/snippet}
    </Card>

    <!-- AI Assistant Section - Moved to Bottom -->
    <AIAssistant />
  </div>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>