<script lang="ts">
import { onMount } from 'svelte';
import Lazy from './components/ui/Lazy.svelte';
import { initThemeWatcher } from './lib/theme';
import { reactiveRouter } from './stores/router.svelte';
import { settingsStore } from './stores/settings.svelte';

const router = $derived(reactiveRouter);
let showIntro = $state(localStorage.getItem('tempoday-intro-seen') !== 'true');
$inspect(showIntro, '<<< showIntro');

// Lazy loader functions for each page
const loadCalendar = () => import('./pages/Calendar.svelte');
const loadDashboard = () => import('./pages/Dashboard.svelte');
const loadIntro = () => import('./pages/Intro.svelte');
const loadSearch = () => import('./pages/Search.svelte');
const loadSettings = () => import('./pages/Settings.svelte');
const loadTerms = () => import('./pages/Terms.svelte');
const loadThanks = () => import('./pages/Thanks.svelte');

// Lazy loader functions for UI components
const loadBottomNavigation = () =>
  import('./components/ui/BottomNavigation.svelte');
const loadToastContainer = () =>
  import('./components/ui/ToastContainer.svelte');

onMount(() => {
  router.initialize();
  settingsStore.loadSettings();
});

const themeEffect = initThemeWatcher(settingsStore);
$effect(themeEffect);

function handleIntroCompleted() {
  showIntro = false;
  localStorage.setItem('tempoday-intro-seen', 'true');
}
</script>

<div class="h-screen flex flex-col relative bg-gray-50 dark:bg-gray-950">
  {#if showIntro && router.activePath !== "/terms" && router.activePath !== "/thanks"}
    <Lazy
      loader={loadIntro}
      onIntroCompleted={handleIntroCompleted}
      loadingSize="3xl"
      loadingClass="w-full h-full justify-center items-center py-8"
    />
  {:else}
    <div
      class="flex-1 overflow-y-auto {router.activePath === '/terms' ||
      router.activePath === '/thanks' ||
      router.activePath === '/search'
        ? ''
        : 'pb-16'}"
    >
      {#if router.activePath === "/"}
        <Lazy
          loader={loadDashboard}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {:else if router.activePath === "/calendar"}
        <Lazy
          loader={loadCalendar}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {:else if router.activePath === "/search"}
        <Lazy
          loader={loadSearch}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {:else if router.activePath === "/settings"}
        <Lazy
          loader={loadSettings}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {:else if router.activePath === "/terms"}
        <Lazy
          loader={loadTerms}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {:else if router.activePath === "/thanks"}
        <Lazy
          loader={loadThanks}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {:else}
        <Lazy
          loader={loadDashboard}
          loadingSize="3xl"
          loadingClass="w-full h-full justify-center items-center py-8"
        />
      {/if}
    </div>
    {#if router.activePath !== "/terms" && router.activePath !== "/thanks" && router.activePath !== "/search"}
      <Lazy
        loader={loadBottomNavigation}
        showLoading={false}
        class="fixed bottom-0 left-0 right-0 z-50"
      />
    {/if}
    <Lazy
      loader={loadToastContainer}
      showLoading={false}
      class="fixed inset-x-0 bottom-20 z-[9999] pointer-events-none"
    />
  {/if}
</div>
