<script lang="ts">
  import { onMount } from 'svelte';
  import { activePath, initializeRouter } from './stores/router.svelte';
  import Calendar from "./pages/Calendar.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Settings from "./pages/Settings.svelte";
  import BottomNavigation from "./components/ui/BottomNavigation.svelte";

  // Initialize router on mount
  onMount(() => {
    initializeRouter();
  });


  $effect(() => {

    console.log(activePath())
  })
  
</script>

<div class="h-screen flex flex-col relative">
  <!-- Main Content Area -->
  <div class="flex-1 overflow-y-auto pb-20">
    {#if activePath() === '/'}
      <Dashboard />
    {:else if activePath() === '/calendar'}
      <Calendar />
    {:else if activePath() === '/settings'}
      <Settings />
    {:else}
      <Dashboard />
    {/if}
  </div>
  
  <!-- Bottom Navigation -->
  <BottomNavigation />
</div>