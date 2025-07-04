<script lang="ts">
import Loading from './Loading.svelte';

interface Props {
  loader: () => Promise<any>;
  showLoading?: boolean;
  loadingSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  loadingMessage?: string;
  errorMessage?: string;
  class?: string;
  loadingClass?: string;
  errorClass?: string;
  [key: string]: any;
}

let { 
  loader, 
  showLoading = true,
  loadingSize = 'lg',
  loadingMessage = 'Loading...',
  errorMessage,
  class: className = '',
  loadingClass = '',
  errorClass = '',
  ...restProps 
}: Props = $props();

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
      error = err instanceof Error ? err : new Error('Failed to load component');
      Component = null;
    })
    .finally(() => {
      loading = false;
    });
});
</script>

{#if loading && showLoading}
  <div class="flex justify-center items-center py-4 text-gray-400 dark:text-gray-500 {loadingClass}">
    <Loading size={loadingSize} message={loadingMessage} />
  </div>
{:else if error}
  <div class="flex justify-center items-center py-4 text-red-500 dark:text-red-400 {errorClass}">
    <div class="text-center">
      <p class="font-medium">Failed to load</p>
      <p class="text-sm mt-1">{errorMessage || error.message}</p>
    </div>
  </div>
{:else if Component}
  <div class={className}>
    <Component {...restProps} />
  </div>
{/if}
