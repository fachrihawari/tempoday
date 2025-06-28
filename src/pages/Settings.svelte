<script lang="ts">
import Settings from '../components/Settings.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
</script>

<div class="h-full flex flex-col bg-gray-50">
  <!-- Header -->
  <PageHeader 
    title="Settings" 
    subtitle="Customize your TempoDay experience"
    icon="settings"
  />

  <!-- Settings Content -->
  <div class="flex-1 overflow-y-auto p-6 space-y-8">
    <!-- Currency Settings -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <Settings />
    </div>

    <!-- Privacy & Security -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
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
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Key Features</h2>
          <p class="text-sm text-gray-600">What makes TempoDay special</p>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-sm text-blue-800 font-medium">Calendar-centric task management</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span class="text-sm text-purple-800 font-medium">Daily notes and journaling</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line stroke-width="2" x1="12" y1="1" x2="12" y2="23"></line>
              <path stroke-width="2" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span class="text-sm text-green-800 font-medium">Personal finance tracking</span>
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-gray-800 font-medium">Offline-first with local storage</span>
          </div>
        </div>
      </div>
    </div>

    <!-- App Information -->
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
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