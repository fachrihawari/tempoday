<script lang="ts">
import Settings from '../components/Settings.svelte';
import Icon from '../components/ui/Icon.svelte';
</script>

<div class="h-full flex flex-col bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between p-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-sm text-gray-600 mt-1">Customize your TempoDay experience</p>
      </div>
      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
        <Icon name="settings" class="text-white" size="lg" />
      </div>
    </div>
  </div>

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto p-6 space-y-8">
    <!-- Currency Settings -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon name="dollar" class="text-green-600" size="sm" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Currency Preference</h2>
          <p class="text-sm text-gray-600">Choose your preferred currency for financial tracking</p>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <Settings />
      </div>
    </div>

    <!-- Privacy & Security -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon name="check-circle" class="text-green-600" size="sm" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Privacy & Security</h2>
          <p class="text-sm text-gray-600">Your data stays private and secure</p>
        </div>
      </div>
      
      <div class="bg-green-50 border border-green-200 rounded-xl p-6">
        <p class="text-sm text-green-800 leading-relaxed">
          🔒 All your data stays private and secure on your device. We don't collect, store, or transmit any of your personal information to external servers.
        </p>
      </div>
    </div>

    <!-- App Features -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon name="check-circle" class="text-blue-600" size="sm" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Key Features</h2>
          <p class="text-sm text-gray-600">What makes TempoDay special</p>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Icon name="calendar" class="text-blue-600" size="sm" />
            <span class="text-sm text-blue-800 font-medium">Calendar-centric task management</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Icon name="edit" class="text-purple-600" size="sm" />
            <span class="text-sm text-purple-800 font-medium">Daily notes and journaling</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Icon name="dollar" class="text-green-600" size="sm" />
            <span class="text-sm text-green-800 font-medium">Personal finance tracking</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Icon name="check-circle" class="text-gray-600" size="sm" />
            <span class="text-sm text-gray-800 font-medium">Offline-first with local storage</span>
          </div>
        </div>
      </div>
    </div>

    <!-- App Information -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Icon name="info-circle" class="text-purple-600" size="sm" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">About TempoDay</h2>
          <p class="text-sm text-gray-600">App information and version</p>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 text-lg">TempoDay</h3>
            <p class="text-sm text-gray-600">Version 0.0.1</p>
            <p class="text-xs text-gray-500 mt-1">Calendar-centric personal management</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</script>