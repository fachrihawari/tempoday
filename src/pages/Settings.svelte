<script lang="ts">
import Settings from '../components/Settings.svelte';
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200">
    <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
  </div>

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto p-4">
    <div class="space-y-6">
      <!-- Settings Component -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <span>Preferences</span>
        </h2>
        <Settings />
      </div>

      <!-- About Section -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">About TempoDay</h2>
        <div class="space-y-4 text-sm text-gray-600">
          <div class="space-y-2">
            <p><strong class="text-gray-900">TempoDay</strong> - A privacy-focused, calendar-centric personal management app</p>
            <p>Version: 0.0.1</p>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <h3 class="font-medium text-gray-900 mb-2">Privacy & Data</h3>
            <p>All your data stays private and secure on your device. We don't collect, store, or transmit any of your personal information to external servers.</p>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <h3 class="font-medium text-gray-900 mb-2">Features</h3>
            <ul class="space-y-1 list-disc list-inside">
              <li>Calendar-centric task management</li>
              <li>Daily notes and journaling</li>
              <li>Personal finance tracking</li>
              <li>Offline-first design</li>
              <li>Local data storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>