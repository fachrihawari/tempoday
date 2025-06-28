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

// Derived values for conditional rendering
const isLoading = $derived(tasksLoading || transactionsLoading || notesLoading);
const hasAnyData = $derived(totalCount > 0 || transactions.length > 0 || hasNote);
const hasTasks = $derived(totalCount > 0);
const hasTransactions = $derived(transactions.length > 0);

// Get limited tasks for summary (show max 5)
const summaryTasks = $derived(tasks.slice(0, 5));
const hasMoreTasks = $derived(tasks.length > 5);
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
  
    <!-- AI Assistant Section - Always show -->
    <AIAssistant />
    
    <!-- Today's Summary Section - Only show if there's data -->
    {#if isLoading}
      <Card title="Today's Summary" icon="home" iconColor="text-blue-500">
        {#snippet children()}
          <Loading size="lg" message="Loading today's summary..." />
        {/snippet}
      </Card>
    {:else if hasAnyData}
      <Card title="Today's Summary" icon="home" iconColor="text-blue-500">
        {#snippet children()}
          <div class="space-y-4">
            <!-- Tasks Summary - Only show if there are tasks -->
            {#if hasTasks}
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
                
                <!-- Progress Bar -->
                <div class="mb-4">
                  <div class="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style="width: {totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%"
                    ></div>
                  </div>
                  <p class="text-xs text-blue-600 text-center mt-2">
                    {Math.round((completedCount / totalCount) * 100)}% complete
                  </p>
                </div>

                <!-- Task Items List - Using consistent design with TasksSection -->
                <div class="space-y-2">
                  {#each summaryTasks as task (task.id)}
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 group bg-white border border-blue-200">
                      <button
                        onclick={() => reactiveTasks.toggleTask(task.id)}
                        disabled={reactiveTasks.isToggling[task.id]}
                        class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                        {task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'}
                        {reactiveTasks.isToggling[task.id]
                          ? 'opacity-50 cursor-not-allowed bg-white border-white hover:border-white hover:bg-white'
                          : ''}"
                      >
                        {#if reactiveTasks.isToggling[task.id]}
                          <Icon name="loader" size="sm" class="w-3 h-3 animate-spin" />
                        {:else if task.completed}
                          <Icon name="check" size="sm" class="w-3 h-3" />
                        {/if}
                      </button>

                      <span class="flex-1 text-sm {task.completed ? 'line-through text-gray-500' : 'text-gray-900'} leading-relaxed">
                        {task.description}
                      </span>
                    </div>
                  {/each}

                  {#if hasMoreTasks}
                    <div class="text-center pt-2">
                      <Button variant="ghost" onclick={goToCalendar} class="text-blue-600 hover:text-blue-700 text-sm">
                        {#snippet children()}
                          <Icon name="plus" size="sm" class="mr-1" />
                          View {tasks.length - 5} more tasks
                        {/snippet}
                      </Button>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Notes Summary - Only show if there's a note -->
            {#if hasNote}
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Icon name="edit" size="sm" class="text-white" />
                    </div>
                    <h3 class="font-semibold text-purple-900">Daily Note</h3>
                  </div>
                  <span class="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded-full font-medium">
                    Written
                  </span>
                </div>
                
                <div class="bg-white rounded-lg p-3 border border-purple-200">
                  <p class="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {noteContent.length > 100 ? noteContent.substring(0, 100) + '...' : noteContent}
                  </p>
                </div>
                <p class="text-xs text-purple-600 mt-2">
                  {noteContent.length} characters
                </p>
              </div>
            {/if}

            <!-- Finance Summary - Only show if there are transactions -->
            {#if hasTransactions}
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Icon name="dollar" size="sm" class="text-white" />
                    </div>
                    <h3 class="font-semibold text-green-900">Finances</h3>
                  </div>
                  <span class="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full font-medium">
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
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
              </div>
            {/if}
          </div>
        {/snippet}
      </Card>
    {:else}
      <!-- Empty State - Only show when no data exists -->
      <Card title="Welcome to TempoDay!" icon="home" iconColor="text-blue-500">
        {#snippet children()}
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="home" size="xl" class="text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Start Your Day</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              Begin by adding tasks, writing notes, or tracking expenses. Use the AI assistant below to get started quickly.
            </p>
          </div>
        {/snippet}
      </Card>
    {/if}

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