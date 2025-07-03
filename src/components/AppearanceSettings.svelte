<script lang="ts">
import Icon from './ui/Icon.svelte';
import { settingsStore } from '../stores/settings.svelte';

// Use $derived for selectedTheme to always reflect the store
const selectedTheme = $derived(settingsStore.settings.theme);

async function handleThemeChange(theme: 'light' | 'dark' | 'system') {
  await settingsStore.setTheme(theme);
}
</script>

<div class="flex flex-col gap-3 w-full">
  <div class="flex items-center gap-3 justify-center mt-2">
    <button
      id="theme-light"
      class={(selectedTheme === 'light'
        ? 'flex-1 min-w-[100px] flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none bg-yellow-400/90 text-gray-900 border-yellow-300 ring-2 ring-yellow-300 dark:bg-yellow-300 dark:text-gray-900 dark:border-yellow-400 dark:ring-yellow-400'
        : 'flex-1 min-w-[100px] flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none bg-gray-50 text-gray-700 border-gray-200 hover:bg-yellow-100 hover:border-yellow-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-yellow-900/20 dark:hover:border-yellow-400')}
      aria-pressed={selectedTheme === 'light'}
      aria-label="Light theme"
      title="Light theme"
      onclick={() => handleThemeChange('light')}
      type="button"
    >
      <Icon name="sun" class={selectedTheme === 'light' ? 'text-yellow-600 dark:text-yellow-700' : 'text-yellow-500 dark:text-yellow-300'} size="md" />
      <span class="text-xs mt-1">Light</span>
    </button>
    <button
      id="theme-dark"
      class={(selectedTheme === 'dark'
        ? 'flex-1 min-w-[100px] flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none bg-gray-800 text-yellow-300 border-yellow-400 ring-2 ring-yellow-400 dark:bg-gray-700 dark:text-yellow-300 dark:border-yellow-400 dark:ring-yellow-400'
        : 'flex-1 min-w-[100px] flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-900 hover:text-yellow-300 hover:border-yellow-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-yellow-300 dark:hover:border-yellow-400')}
      aria-pressed={selectedTheme === 'dark'}
      aria-label="Dark theme"
      title="Dark theme"
      onclick={() => handleThemeChange('dark')}
      type="button"
    >
      <Icon name="moon" class={selectedTheme === 'dark' ? 'text-yellow-300 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'} size="md" />
      <span class="text-xs mt-1">Dark</span>
    </button>
    <button
      id="theme-system"
      class={(selectedTheme === 'system'
        ? 'flex-1 min-w-[100px] flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none bg-blue-100 text-blue-700 border-blue-400 ring-2 ring-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-500 dark:ring-blue-500'
        : 'flex-1 min-w-[100px] flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-200 dark:hover:border-blue-500')}
      aria-pressed={selectedTheme === 'system'}
      aria-label="System theme"
      title="System theme"
      onclick={() => handleThemeChange('system')}
      type="button"
    >
      <Icon name="monitor" class={selectedTheme === 'system' ? 'text-blue-700 dark:text-blue-200' : 'text-blue-400 dark:text-blue-400'} size="md" />
      <span class="text-xs mt-1">System</span>
    </button>
  </div>
  <div class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
    <span>
      {selectedTheme === 'system' ? 'Follows your device or OS setting.' : selectedTheme === 'dark' ? 'Dark mode is always on.' : 'Light mode is always on.'}
    </span>
  </div>
</div>
