<script lang="ts">
import { onMount } from 'svelte';
import BottomNavigation from './components/ui/BottomNavigation.svelte';
import LazyPage from './components/ui/LazyPage.svelte';
import ToastContainer from './components/ui/ToastContainer.svelte';
import { initThemeWatcher } from './lib/theme';
import { reactiveRouter } from './stores/router.svelte';
import { settingsStore } from './stores/settings.svelte';

const router = $derived(reactiveRouter);
let showIntro = $state(false);

// Lazy loader functions for each page
const loadCalendar = () => import('./pages/Calendar.svelte');
const loadDashboard = () => import('./pages/Dashboard.svelte');
const loadIntro = () => import('./pages/Intro.svelte');
const loadSearch = () => import('./pages/Search.svelte');
const loadSettings = () => import('./pages/Settings.svelte');
const loadTerms = () => import('./pages/Terms.svelte');
const loadThanks = () => import('./pages/Thanks.svelte');

onMount(() => {
  router.initialize();
  settingsStore.loadSettings();
  const hasSeenIntro = localStorage.getItem('tempoday-intro-seen');
  if (!hasSeenIntro) {
    showIntro = true;
  }
});

const themeEffect = initThemeWatcher(settingsStore);
$effect(themeEffect);

function handleIntroCompleted() {
  showIntro = false;
}
</script>

<div class="h-screen flex flex-col relative">
  {#if showIntro && router.activePath !== "/terms" && router.activePath !== "/thanks"}
    <LazyPage loader={loadIntro} onIntroCompleted={handleIntroCompleted} />
  {:else}
    <div class="flex-1 overflow-y-auto {router.activePath === '/terms' || router.activePath === '/thanks' || router.activePath === '/search' ? '' : 'pb-16'}">
      {#if router.activePath === "/"}
        <LazyPage loader={loadDashboard} />
      {:else if router.activePath === "/calendar"}
        <LazyPage loader={loadCalendar} />
      {:else if router.activePath === "/search"}
        <LazyPage loader={loadSearch} />
      {:else if router.activePath === "/settings"}
        <LazyPage loader={loadSettings} />
      {:else if router.activePath === "/terms"}
        <LazyPage loader={loadTerms} />
      {:else if router.activePath === "/thanks"}
        <LazyPage loader={loadThanks} />
      {:else}
        <LazyPage loader={loadDashboard} />
      {/if}
    </div>
    {#if router.activePath !== "/terms" && router.activePath !== "/thanks" && router.activePath !== "/search"}
      <BottomNavigation />
    {/if}
  {/if}
  <ToastContainer />
</div>