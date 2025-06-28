<script lang="ts">
import { reactiveRouter } from '../../stores/router.svelte';
import Icon from './Icon.svelte';

const navItems = [
  {
    path: '/',
    label: 'Home',
    icon: 'home' as const,
  },
  {
    path: '/calendar',
    label: 'Calendar',
    icon: 'calendar' as const,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings' as const,
  },
];

const router = $derived(reactiveRouter);
</script>

<nav
  class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom"
>
  <div class="max-w-md mx-auto">
    <div
      class="flex justify-around items-center py-2 pb-safe-area-inset-bottom"
    >
      {#each navItems as item (item.path)}
        <button
          onclick={() => router.navigate(item.path)}
          class="flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors duration-200
            {router.activePath === item.path
            ? 'text-blue-600'
            : 'text-gray-500 hover:text-gray-700'}"
        >
          <Icon
            name={item.icon}
            size="lg"
            class="mb-1 {router.activePath === item.path
              ? 'text-blue-600'
              : 'text-gray-500'}"
          />
          <span class="text-xs font-medium truncate">
            {item.label}
          </span>
        </button>
      {/each}
    </div>
  </div>
</nav>

<style>
  /* Ensure proper safe area handling on iOS */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .pb-safe-area-inset-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  /* Add safe area class for bottom navigation */
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
