<script lang="ts">
  import { onMount } from "svelte";
  import { reactiveRouter } from "./stores/router.svelte";
  import Calendar from "./pages/Calendar.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Settings from "./pages/Settings.svelte";
  import BottomNavigation from "./components/ui/BottomNavigation.svelte";

  const router = $derived(reactiveRouter);

  // Initialize router on mount
  onMount(() => {
    router.initialize();
  });
</script>

<div class="h-screen flex flex-col relative">
  <!-- Main Content Area -->
  <div class="flex-1 overflow-y-auto pb-20">
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
</div>
