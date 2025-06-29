<script lang="ts">
import { toastStore } from '../../stores/toast.svelte';
import Toast from './Toast.svelte';

let { toasts } = $derived(toastStore);

function handleDismiss(id: string) {
  toastStore.remove(id);
}
</script>

<!-- Toast Container - Fixed position at top right -->
<div class="toast-container fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
  {#each toasts as toast (toast.id)}
    <div class="pointer-events-auto">
      <Toast
        id={toast.id}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        dismissible={toast.dismissible}
        onDismiss={handleDismiss}
      />
    </div>
  {/each}
</div>