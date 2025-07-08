<script lang="ts">
import Button from './Button.svelte';
import Icon, { type IconName } from './Icon.svelte';

export interface FabAction {
  icon: IconName;
  label: string;
  onClick: () => void;
  color?: 'task' | 'note' | 'transaction';
}

interface Props {
  actions: FabAction[];
}

let { actions = [] }: Props = $props();

let open = $state(false);

function toggle() {
  open = !open;
}

function getActionColors(color?: string) {
  switch (color) {
    case 'task':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'note':
      return 'bg-green-500 hover:bg-green-600 text-white';
    case 'transaction':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
}
</script>

<div class="fixed bottom-20 right-6 z-[60] flex flex-col items-end">
  {#if open}
    <div
      class="mb-4 flex flex-col gap-3 animate-fade-in absolute bottom-[-75px] right-[35px]"
    >
      {#each actions as action (action.label)}
        <div class="flex items-center gap-3">
          <!-- Action Label -->
          <div
            class="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-90"
          >
            {action.label}
          </div>
          <!-- Action Button -->
          <button
            class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 {getActionColors(
              action.color,
            )}"
            onclick={() => {
              action.onClick();
              open = false;
            }}
            aria-label={action.label}
          >
            <Icon name={action.icon} size="md" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
  <!-- Main FAB Button -->
  <button
    class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    aria-label="Open actions"
    onclick={toggle}
  >
    <Icon name={open ? "close" : "plus"} size="xl" />
  </button>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.2s ease;
  }
</style>
