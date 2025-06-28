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


  </div>
</div>