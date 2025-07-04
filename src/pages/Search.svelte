<script lang="ts">
import { onMount } from 'svelte';
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import SearchFiltersComponent from '../components/ui/SearchFilters.svelte';
import { setSelectedDate } from '../stores/app.svelte';
import { reactiveRouter } from '../stores/router.svelte';
import {
  type SearchFilters,
  type SearchResult,
  searchStore,
} from '../stores/search.svelte';

let searchInput = $state('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let lastSearchQuery = $state('');
let searchInputElement: HTMLInputElement = $state()!;
let showMoreCategories = $state(false);

// Reactive values from search store
let {
  query,
  results,
  isSearching,
  error,
  hasSearched,
  hasResults,
  filters,
  hasActiveFilters,
} = $derived(searchStore);

// Improved debounced search function
function handleSearchInput() {
  const trimmedInput = searchInput.trim();

  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }

  // If input is empty, clear results immediately
  if (!trimmedInput) {
    searchStore.clearResults();
    lastSearchQuery = '';
    return;
  }

  // Don't search if it's the same as the last query
  if (trimmedInput === lastSearchQuery) {
    return;
  }

  // Set up new debounced search
  searchTimeout = setTimeout(() => {
    if (trimmedInput && trimmedInput !== lastSearchQuery) {
      lastSearchQuery = trimmedInput;
      searchStore.performSearch(trimmedInput);
    }
    searchTimeout = null;
  }, 500); // Increased to 500ms for better debouncing
}

// Watch for input changes with proper debouncing
$effect(() => {
  handleSearchInput();
});

// Keep focus on search input after search completes
$effect(() => {
  // When search completes (isSearching becomes false) and we have an input element
  if (!isSearching && searchInputElement && searchInput.trim()) {
    // Use a small delay to ensure the DOM has updated
    setTimeout(() => {
      if (searchInputElement) {
        searchInputElement.focus();
      }
    }, 50);
  }
});

// Navigate back to previous page
function goBack() {
  // Clean up any pending search
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
  reactiveRouter.navigate('/');
}

// Handle clicking on a search result
function handleResultClick(result: SearchResult) {
  // Set the selected date to the result's date
  const resultDate = new Date(result.date);
  setSelectedDate(resultDate);

  // Navigate to calendar page to show the selected date
  reactiveRouter.navigate('/calendar');
}

// Format date for display
function formatResultDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get icon for result type
function getResultIcon(
  type: SearchResult['type'],
): 'clipboard' | 'edit' | 'dollar' {
  switch (type) {
    case 'task':
      return 'clipboard';
    case 'note':
      return 'edit';
    case 'transaction':
      return 'dollar';
  }
}

// Get color for result type
function getResultColor(type: SearchResult['type']): string {
  switch (type) {
    case 'task':
      return 'text-blue-600 dark:text-blue-400';
    case 'note':
      return 'text-purple-600 dark:text-purple-400';
    case 'transaction':
      return 'text-green-600 dark:text-green-400';
  }
}

// Get background color for result type
function getResultBgColor(type: SearchResult['type']): string {
  switch (type) {
    case 'task':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'note':
      return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    case 'transaction':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  }
}

// Handle filter changes
function handleFiltersChange(newFilters: SearchFilters) {
  searchStore.updateFilters(newFilters);
}

// Handle clear filters
function handleClearFilters() {
  searchStore.clearFilters();
}

// Toggle more categories panel
function toggleMoreCategories() {
  showMoreCategories = !showMoreCategories;
}

// Clear search
function clearSearch() {
  // Clear timeout first
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }

  // Clear input and results
  searchInput = '';
  lastSearchQuery = '';
  searchStore.clearResults();

  // Keep focus on input after clearing
  if (searchInputElement) {
    searchInputElement.focus();
  }
}

// Auto-focus search input on mount
onMount(() => {
  // Focus the search input when the page loads
  if (searchInputElement) {
    searchInputElement.focus();
  }

  return () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
  };
});
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <PageHeader title="Search" subtitle="Find tasks, notes, and transactions" onBack={goBack} />

  <!-- Search Input and Filters -->
  <div class="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 space-y-3">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {#if isSearching}
          <Icon name="loader" class="text-blue-500 dark:text-blue-400 animate-spin" size="sm" />
        {:else}
          <Icon name="search" class="text-gray-400 dark:text-gray-500" size="sm" />
        {/if}
      </div>
      <input
        bind:this={searchInputElement}
        bind:value={searchInput}
        placeholder="Search tasks, notes, and transactions..."
        class="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
               {isSearching ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        disabled={isSearching}
      />
      {#if searchInput && !isSearching}
        <button
          onclick={clearSearch}
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Icon name="close" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" size="sm" />
        </button>
      {:else if isSearching}
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <span class="text-xs text-blue-600 dark:text-blue-400 font-medium">Searching...</span>
        </div>
      {/if}
    </div>

    <!-- Show Filters Only After Search Has Been Performed -->
    {#if hasSearched}
      <!-- Horizontal Scrollable Filters -->
      <SearchFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        isOpen={showMoreCategories}
        onToggle={toggleMoreCategories}
      />
    {/if}
    
    <!-- Search Progress Indicator -->
    {#if isSearching}
      <div class="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1 overflow-hidden">
        <div class="h-full bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" style="width: 100%"></div>
      </div>
    {/if}
  </div>

  <!-- Search Results -->
  <div class="flex-1 overflow-y-auto">
    {#if isSearching}
      <!-- Enhanced Loading State -->
      <div class="flex flex-col items-center justify-center py-12 px-6">
        <div class="relative mb-6">
          <!-- Animated search icon -->
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Icon name="search" class="text-blue-600 dark:text-blue-400 animate-pulse" size="xl" />
          </div>
          <!-- Spinning loader overlay -->
          <div class="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Searching...</h3>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-4">
          Looking through your tasks, notes, and transactions
        </p>
        
        <!-- Search progress dots -->
        <div class="flex space-x-2">
          <div class="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="flex flex-col items-center justify-center py-12 px-6">
        <Icon name="alert-circle" class="text-red-500 dark:text-red-400 mb-4" size="3xl" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Search Error</h3>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
        <Button variant="primary" onclick={() => searchStore.clearError()}>
          {#snippet children()}Try Again{/snippet}
        </Button>
      </div>
    {:else if hasSearched && !hasResults}
      <!-- No Results State -->
      <div class="flex flex-col items-center justify-center py-12 px-6">
        <Icon name="search" class="text-gray-400 dark:text-gray-500 mb-4" size="3xl" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Results Found</h3>
        <p class="text-gray-600 dark:text-gray-400 text-center">
          No results match "{query}"
          {#if hasActiveFilters}
            with the current filters
          {/if}
        </p>
        {#if hasActiveFilters}
          <Button variant="outline" onclick={handleClearFilters} class="mt-4">
            {#snippet children()}
              <Icon name="close" size="sm" class="mr-2" />
              Clear Filters
            {/snippet}
          </Button>
        {/if}
      </div>
    {:else if hasResults}
      <!-- Results -->
      <div class="p-4">
        <!-- Results Summary -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Found {results.total} result{results.total !== 1 ? 's' : ''} for "{query}"
            {#if hasActiveFilters}
              <span class="text-blue-600 dark:text-blue-400">with filters</span>
            {/if}
          </p>
        </div>

        <!-- Results by Category -->
        {#if results.tasks.length > 0}
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon name="clipboard" class="text-blue-600 dark:text-blue-400" size="sm" />
              Tasks ({results.tasks.length})
            </h3>
            <div class="space-y-2">
              {#each results.tasks as result (result.id)}
                <button
                  onclick={() => handleResultClick(result)}
                  class="w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 {getResultBgColor(result.type)}"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <Icon name={getResultIcon(result.type)} class={getResultColor(result.type)} size="sm" />
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{result.title}</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{result.content}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatResultDate(result.date)}</p>
                    </div>
                    <Icon name="chevron-right" class="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" size="sm" />
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if results.notes.length > 0}
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon name="edit" class="text-purple-600 dark:text-purple-400" size="sm" />
              Notes ({results.notes.length})
            </h3>
            <div class="space-y-2">
              {#each results.notes as result (result.id)}
                <button
                  onclick={() => handleResultClick(result)}
                  class="w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 {getResultBgColor(result.type)}"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <Icon name={getResultIcon(result.type)} class={getResultColor(result.type)} size="sm" />
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{result.content}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatResultDate(result.date)}</p>
                    </div>
                    <Icon name="chevron-right" class="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" size="sm" />
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if results.transactions.length > 0}
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon name="dollar" class="text-green-600 dark:text-green-400" size="sm" />
              Transactions ({results.transactions.length})
            </h3>
            <div class="space-y-2">
              {#each results.transactions as result (result.id)}
                <button
                  onclick={() => handleResultClick(result)}
                  class="w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 {getResultBgColor(result.type)}"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <Icon name={getResultIcon(result.type)} class={getResultColor(result.type)} size="sm" />
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{result.title}</span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{result.content}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatResultDate(result.date)}</p>
                    </div>
                    <Icon name="chevron-right" class="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" size="sm" />
                  </div>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Initial State -->
      <div class="flex flex-col items-center justify-center py-12 px-6">
        <Icon name="search" class="text-gray-400 dark:text-gray-500 mb-4" size="3xl" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Search Your Data</h3>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
          Find tasks, notes, and transactions by typing in the search box above
        </p>
        
        <!-- Search Tips -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-sm w-full border border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Search Tips:</h4>
          <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Search across all your tasks, notes, and transactions</li>
            <li>• Use filters to narrow down results by type, status, or category</li>
            <li>• Results are sorted by date (newest first)</li>
            <li>• Click any result to jump to that date</li>
            <li>• Search is case-insensitive</li>
          </ul>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
/* Line clamp utility for truncating text */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom bounce animation with staggered delays */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>