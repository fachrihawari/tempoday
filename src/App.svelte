<script lang="ts">
import { onMount } from 'svelte';
import BottomNavigation from './components/ui/BottomNavigation.svelte';
import ToastContainer from './components/ui/ToastContainer.svelte';
import Calendar from './pages/Calendar.svelte';
import Dashboard from './pages/Dashboard.svelte';
import Intro from './pages/Intro.svelte';
import Settings from './pages/Settings.svelte';
import Terms from './pages/Terms.svelte';
import Thanks from './pages/Thanks.svelte';
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

// Handle intro completion using Svelte 5 callback props
function handleIntroCompleted() {
  showIntro = false;
}
</script>

<div class="h-screen flex flex-col relative">
  {#if showIntro && router.activePath !== "/terms" && router.activePath !== "/thanks"}
    <!-- Show intro page for new users - using callback prop (Svelte 5 way) -->
    <Intro onIntroCompleted={handleIntroCompleted} />
  {:else}
    <!-- Main App Content -->
    <div class="flex-1 overflow-y-auto {router.activePath === '/terms' || router.activePath === '/thanks' ? '' : 'pb-16'}">
      {#if router.activePath === "/"}
        <Dashboard />
      {:else if router.activePath === "/calendar"}
        <Calendar />
      {:else if router.activePath === "/settings"}
        <Settings />
      {:else if router.activePath === "/terms"}
        <Terms />
      {:else if router.activePath === "/thanks"}
        <Thanks />
      {:else}
        <Dashboard />
      {/if}
    </div>

    <!-- Bottom Navigation - Hide on Terms and Thanks pages -->
    {#if router.activePath !== "/terms" && router.activePath !== "/thanks"}
      <BottomNavigation />
    {/if}
  {/if}

  <!-- Toast Container - Always visible -->
  <ToastContainer />
</div>