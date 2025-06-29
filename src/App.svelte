<script lang="ts">
import { onMount } from 'svelte';
import BottomNavigation from './components/ui/BottomNavigation.svelte';
import Calendar from './pages/Calendar.svelte';
import Dashboard from './pages/Dashboard.svelte';
import Intro from './pages/Intro.svelte';
import Settings from './pages/Settings.svelte';
import { reactiveRouter } from './stores/router.svelte';

const router = $derived(reactiveRouter);

let showIntro = $state(false);

// Initialize router on mount and check if intro should be shown
onMount(() => {
  router.initialize();
  
  // Check if user has seen the intro before
  const hasSeenIntro = localStorage.getItem('tempoday-intro-seen');
  if (!hasSeenIntro) {
    showIntro = true;
  }
});

// Handle intro completion using Svelte event system
function handleIntroCompleted() {
  showIntro = false;
}
</script>

<div class="h-screen flex flex-col relative">
  {#if showIntro}
    <!-- Show intro page for new users -->
    <Intro on:intro-completed={handleIntroCompleted} />
  {:else}
    <!-- Main App Content -->
    <div class="flex-1 overflow-y-auto pb-16">
      {#if router.activePath === "/"}
        <Dashboard />
      {:else if router.activePath === "/calendar"}
        <Calendar />
      {:else if router.activePath === "/settings"}
        <Settings />
      {:else}
        <Dashboard />
      {/if}
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation />
  {/if}
</div>