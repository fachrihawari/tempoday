<script lang="ts">
import Loading from './Loading.svelte';

// Svelte 5 runes mode
let allProps = $props();
let { loader, ...restProps } = allProps;
let Component = $state<any>(null);
let loading = $state(true);
let error = $state<Error | null>(null);

$effect(() => {
  loading = true;
  error = null;
  loader()
    .then((mod: any) => {
      Component = mod.default;
    })
    .catch((err: any) => {
      error =
        err instanceof Error ? err : new Error('Failed to load Component');
      Component = null;
    })
    .finally(() => {
      loading = false;
    });
});
</script>

{#if loading}
  <div class="w-full flex h-full justify-center items-center py-8 text-gray-400 dark:text-gray-500">
    <Loading size='3xl' />
  </div>
{:else if error}
  <div class="w-full flex h-full justify-center items-center py-8 text-red-500 dark:text-red-400">
    {error.message}
  </div>
{:else if Component}
  <Component {...restProps} />
{/if}
