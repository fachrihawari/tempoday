<script lang="ts">
  import { onMount } from 'svelte';
  import { activePath, initializeRouter, navigate } from './stores/router.svelte';
  import Calendar from "./pages/Calendar.svelte";
  import Dashboard from "./pages/Dashboard.svelte";

  // Initialize router on mount
  onMount(() => {
    initializeRouter();
  });
</script>

<div class="h-screen overflow-y-auto">
  <nav class="p-4 bg-gray-100 border-b">
    <button 
      class="mr-4 px-3 py-1 rounded {activePath() === '/' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      onclick={() => navigate('/')}
    >
      Home
    </button>
    <button 
      class="px-3 py-1 rounded {activePath() === '/calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      onclick={() => navigate('/calendar')}
    >
      Calendar
    </button>
  </nav>
  
  <div class="p-4">
    {#if activePath() === '/'}
      <Dashboard />
    {:else if activePath() === '/calendar'}
      <Calendar />
    {:else}
      <Dashboard />
    {/if}
  </div>
</div>
