<script lang="ts">
import { activePath, navigate } from '../../stores/router.svelte';
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

function handleNavigation(path: string) {
  navigate(path);
}
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
  <div class="max-w-md mx-auto">
    <div class="flex justify-around items-center py-2">
      {#each navItems as item (item.path)}
        <button
          onclick={() => handleNavigation(item.path)}
          class="flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors duration-200
            {activePath() === item.path 
              ? 'text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}"
        >
          <Icon 
            name={item.icon} 
            size="lg" 
            class="mb-1 {activePath() === item.path ? 'text-blue-600' : 'text-gray-500'}" 
          />
          <span class="text-xs font-medium truncate">
            {item.label}
          </span>
        </button>
      {/each}
    </div>
  </div>
</nav>