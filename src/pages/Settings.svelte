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
  <div class="flex-1 overflow-y-auto p-6 space-y-6">
    <!-- Preferences Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Icon name="settings" class="text-white" size="sm" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Preferences</h2>
            <p class="text-sm text-gray-600">Customize your app settings</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <Settings />
      </div>
    </div>

    <!-- App Information Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Icon name="info-circle" class="text-white" size="sm" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">About TempoDay</h2>
            <p class="text-sm text-gray-600">Learn more about the app</p>
          </div>
        </div>
      </div>
      <div class="p-6 space-y-6">
        <!-- App Info -->
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 text-lg">TempoDay</h3>
            <p class="text-sm text-gray-600">Version 0.0.1</p>
            <p class="text-xs text-gray-500 mt-1">Calendar-centric personal management</p>
          </div>
        </div>
        
        <!-- Privacy & Data -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="check-circle" class="text-green-500" size="sm" />
            <h3 class="font-medium text-gray-900">Privacy & Data Security</h3>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <p class="text-sm text-green-800 leading-relaxed">
              🔒 All your data stays private and secure on your device. We don't collect, store, or transmit any of your personal information to external servers. Your privacy is our priority.
            </p>
          </div>
        </div>
        
        <!-- Features -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Icon name="check-circle" class="text-blue-500" size="sm" />
            <h3 class="font-medium text-gray-900">Key Features</h3>
          </div>
          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Icon name="calendar" class="text-blue-600" size="sm" />
              <span class="text-sm text-blue-800 font-medium">Calendar-centric task management</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Icon name="edit" class="text-purple-600" size="sm" />
              <span class="text-sm text-purple-800 font-medium">Daily notes and journaling</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Icon name="dollar" class="text-green-600" size="sm" />
              <span class="text-sm text-green-800 font-medium">Personal finance tracking</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Icon name="check-circle" class="text-gray-600" size="sm" />
              <span class="text-sm text-gray-800 font-medium">Offline-first design with local storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Icon name="info-circle" class="text-white" size="sm" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Support & Feedback</h2>
            <p class="text-sm text-gray-600">Get help or share your thoughts</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-2xl">💝</span>
          </div>
          <h3 class="font-medium text-gray-900 mb-2">Thank you for using TempoDay!</h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            We're constantly working to improve your experience. Your feedback helps us make TempoDay better for everyone.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>