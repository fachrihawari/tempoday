<script lang="ts">
import { toastStore } from '../../stores/toast.svelte';
import Toast from './Toast.svelte';

let { toasts } = $derived(toastStore);

function handleDismiss(id: string) {
  toastStore.remove(id);
}
</script>

<!-- Toast Container - Properly centered using flexbox -->
<div class="toast-container fixed inset-x-0 top-4 z-[9999] pointer-events-none">
  <div class="flex flex-col items-center gap-3 px-4">
    {#each toasts as toast (toast.id)}
      <div class="pointer-events-auto w-full max-w-sm animate-in slide-in-from-top-2 duration-400">
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

/* Custom animation keyframes for smoother entrance */
@keyframes slide-in-from-top {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes zoom-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-in {
  animation-fill-mode: both;
}

.slide-in-from-top-2 {
  animation: slide-in-from-top 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.zoom-in-50 {
  animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>