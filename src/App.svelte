<script lang="ts">
import { onMount } from 'svelte';
import Alert from './components/ui/Alert.svelte';
import Loading from './components/ui/Loading.svelte';
import { db } from './db';
import { initializeDatabase } from './db/setup';
import Home from './pages/Home.svelte';
import { appState, setDbError, setDbReady } from './stores/app.svelte';

// Initialize database when component mounts
onMount(async () => {
  try {
    console.time('Database Initialization');
    // Initialize database with automatic migration system
    await initializeDatabase(db);
    console.timeEnd('Database Initialization');

    // Database is ready
    setDbReady();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    setDbError(
      error instanceof Error ? error.message : 'Failed to initialize database',
    );
  }
});
</script>

<div class="h-screen overflow-y-auto">
  {#if appState.initializing}
    <div class="flex items-center justify-center h-full">
      <Loading size='3xl' message="Preparing TempoDay..." />
    </div>
  {:else if appState.dbError}
    <div class="flex items-center justify-center h-full">
      <Alert
        type="error"
        title="Failed to Initialize TempoDay"
        description={appState.dbError}
        class="m-4"
      />
    </div>
  {:else if appState.dbReady}
    <Home />
  {/if}
</div>
