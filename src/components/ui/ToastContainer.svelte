<script lang="ts">
import { toastStore } from '../../stores/toast.svelte';
import Toast from './Toast.svelte';

let { toasts } = $derived(toastStore);

function handleDismiss(id: string) {
  toastStore.remove(id);
}
</script>

<!-- Toast Container - Fixed position with proper centering and stacking -->
<div class="toast-container fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none">
  <!-- Mobile: Center horizontally, Desktop: Slightly right of center -->
  <div class="flex flex-col items-center gap-3 w-screen max-w-sm px-4 sm:max-w-md sm:px-0">
    {#each toasts as toast (toast.id)}
      <div class="pointer-events-auto w-full animate-in slide-in-from-top-2 duration-400">
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