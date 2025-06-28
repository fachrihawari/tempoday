<script lang="ts">
import { onMount } from 'svelte';
import { fade, fly } from 'svelte/transition';
import Button from './Button.svelte';
import Icon from './Icon.svelte';

interface Props {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: any;
}

let { open = $bindable(), title = '', onClose, children }: Props = $props();

let sheetElement: HTMLDivElement = $state()!;
let dragHandle: HTMLDivElement = $state()!;
let startY = 0;
let currentY = 0;
let isDragging = false;

function close() {
  open = false;
  onClose?.();
}

// Drag to dismiss functionality
function handleTouchStart(event: TouchEvent) {
  startY = event.touches[0].clientY;
  isDragging = true;
  if (sheetElement) {
    sheetElement.style.transition = 'none';
  }
}

function handleTouchMove(event: TouchEvent) {
  if (!isDragging) return;
  currentY = event.touches[0].clientY;
  const deltaY = Math.max(0, currentY - startY);
  if (sheetElement && deltaY > 0) {
    sheetElement.style.transform = `translateY(${deltaY}px)`;
  }
}

function handleTouchEnd() {
  if (!isDragging) return;
  isDragging = false;

  if (sheetElement) {
    const deltaY = currentY - startY;
    if (deltaY > 100) {
      // If dragged down more than 100px, close
      close();
    } else {
      // Reset position with smooth animation
      sheetElement.style.transition =
        'transform 0.3s cubic-bezier(0.4,0,0.2,1)';
      sheetElement.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (sheetElement) {
          sheetElement.style.transition = '';
          sheetElement.style.transform = '';
        }
      }, 300);
    }
  }
}

// Mouse events for desktop drag
function handleMouseDown(event: MouseEvent) {
  startY = event.clientY;
  isDragging = true;
  if (sheetElement) {
    sheetElement.style.transition = 'none';
  }
  // Prevent text selection while dragging
  event.preventDefault();
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging) return;
  currentY = event.clientY;
  const deltaY = Math.max(0, currentY - startY);
  if (sheetElement && deltaY > 0) {
    sheetElement.style.transform = `translateY(${deltaY}px)`;
  }
}

function handleMouseUp() {
  if (!isDragging) return;
  isDragging = false;

  if (sheetElement) {
    const deltaY = currentY - startY;
    if (deltaY > 100) {
      close();
    } else {
      sheetElement.style.transition =
        'transform 0.3s cubic-bezier(0.4,0,0.2,1)';
      sheetElement.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (sheetElement) {
          sheetElement.style.transition = '';
          sheetElement.style.transform = '';
        }
      }, 300);
    }
  }
}

onMount(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }
});

// Manage body scroll when bottom sheet is open
$effect(() => {
  if (open) {
    // Prevent body scroll when bottom sheet is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';

    // Auto-focus first input when opened
    setTimeout(() => {
      if (sheetElement) {
        const firstInput = sheetElement.querySelector('input, textarea');
        if (firstInput instanceof HTMLElement) {
          firstInput.focus();
        }
      }
    }, 100);

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  } else {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  }
});

// Clean up inline styles when opening
$effect(() => {
  if (open && sheetElement && !isDragging) {
    sheetElement.style.transform = '';
    sheetElement.style.transition = '';
  }
});
</script>

{#if open}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 z-[100] touch-none"
    transition:fade="{{ duration: 200 }}"
    onclick={close}
    onkeydown={(e) => e.key === 'Escape' && close()}
    role="button"
    tabindex="-1"
    aria-label="Close modal"
  ></div>

  <!-- Bottom Sheet -->
  <div 
    bind:this={sheetElement}
    class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[101] flex flex-col touch-pan-y overscroll-contain
           max-h-[85vh] sm:max-h-[90vh]
           pb-safe-area-inset-bottom"
    transition:fly="{{ y: 300, duration: 300 }}"
    style="touch-action: pan-y; overscroll-behavior: contain; padding-bottom: max(env(safe-area-inset-bottom), 24px);"
    role="dialog"
    aria-modal="true"
    aria-labelledby="sheet-title"
  >
    <!-- Drag Handle -->
    <div 
      class="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0"
      bind:this={dragHandle}
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
      onmousedown={handleMouseDown}
      role="button"
      tabindex="0"
      aria-label="Drag to dismiss modal"
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          close();
        }
      }}
    >
      <div class="w-10 h-1.5 bg-gray-300 rounded-full"></div>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between px-6 pb-4 border-b border-gray-200 flex-shrink-0">
      <h2 id="sheet-title" class="text-xl font-semibold text-gray-900">
        {title}
      </h2>
      <Button
        variant="ghost"
        size="sm"
        onclick={close}
        class="!p-2 rounded-full hover:!bg-gray-100"
      >
        {#snippet children()}
          <Icon name="close" class="w-5 h-5 text-gray-500" />
        {/snippet}
      </Button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-6 py-4 min-h-0">
      {@render children()}
    </div>
  </div>
{/if}

<style>
  /* Ensure proper safe area handling on iOS */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .pb-safe-area-inset-bottom {
      padding-bottom: max(env(safe-area-inset-bottom), 80px);
    }
  }
  
  /* Fallback for browsers that don't support env() */
  @supports not (padding-bottom: env(safe-area-inset-bottom)) {
    .pb-safe-area-inset-bottom {
      padding-bottom: 80px;
    }
  }
</style>