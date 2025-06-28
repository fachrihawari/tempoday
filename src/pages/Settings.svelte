<script lang="ts">
import Settings from '../components/Settings.svelte';
import Header from '../components/ui/Header.svelte';
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200">
    <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
  </div>

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto p-4">
    <div class="space-y-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
        <Settings />
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">About</h2>
        <div class="space-y-3 text-sm text-gray-600">
          <p><strong>TempoDay</strong> - A privacy-focused, calendar-centric personal management app</p>
          <p>Version: 0.0.1</p>
          <p>All your data stays private and local on your device.</p>
        </div>
      </div>
    </div>
  </div>
</div>