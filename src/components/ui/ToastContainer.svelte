<script lang="ts">
import { toastStore } from '../../stores/toast.svelte';
import Toast from './Toast.svelte';

let { toasts } = $derived(toastStore);
</script>

{#if toasts.length > 0}
  <div class="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none">
    {#each toasts as toast (toast.id)}
      <div class="pointer-events-auto">
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          dismissible={toast.dismissible}
          onDismiss={() => toastStore.remove(toast.id)}
        />
      </div>
    {/each}
  </div>
{/if}