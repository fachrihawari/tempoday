<script lang="ts">
import Icon from './ui/Icon.svelte';
</script>

<div class="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/30 dark:via-emerald-900/25 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700/50">
  <div class="flex items-start gap-3">
    <div class="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon name="check-circle" class="text-white" size="sm" />
    </div>
    <div>
      <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-1">100% Local Storage</h3>
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        All your data is stored locally on your device. We don't collect, store, or transmit any personal information to external servers.
      </p>
    </div>
  </div>
</div>
