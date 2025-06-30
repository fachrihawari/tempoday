<script lang="ts">
import { toastStore } from '../../stores/toast.svelte';
import Toast from './Toast.svelte';

let { toasts } = $derived(toastStore);

function handleDismiss(id: string) {
  toastStore.remove(id);
}
</script>

<!-- Toast Container - Bottom positioned above navigation -->
<div class="toast-container fixed inset-x-0 bottom-20 z-[9999] pointer-events-none">
  <div class="flex flex-col-reverse items-center gap-3 px-4">
    {#each toasts as toast (toast.id)}
      <div class="pointer-events-auto w-full max-w-sm animate-in slide-in-from-bottom-2 duration-400">
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
</div>

<style>
/* Ensure proper stacking and smooth animations */
.toast-container {
  z-index: 9999;
}

/* Custom animation keyframes for bottom entrance */
@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation-fill-mode: both;
}

.slide-in-from-bottom-2 {
  animation: slide-in-from-bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

</style>